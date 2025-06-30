require('dotenv').config()
require('module-alias/register')
const chokidar = require('chokidar')
const express = require('express')
const path = require('path')
const fs = require('fs').promises
// require('express-async-errors')


const { PORT, inProduction } = require('@root/server/util/common')
const logger = require('@util/logger')


const app = express()
// app.use(cors())

// Require is here so we can delete it from cache when files change (*)
// app.use('/api', (req, res, next) => require('@root/server')(req, res, next)) // eslint-disable-line
// app.use('/api', (_, res) => res.sendStatus(404))

/**
 *  Use "hot loading" in backend
 */
const watcher = chokidar.watch('server') // Watch server folder
watcher.on('ready', () => {
    watcher.on('all', () => {
        Object.keys(require.cache).forEach((id) => {
            if (id.includes('server')) delete require.cache[id] // Delete all require caches that point to server folder (*)
        })
    })
})

/**
 * For frontend use hot loading when in development, else serve the static content
 */

async function startServer() { 
    if (!inProduction) {
        const vite = require('vite')
        const viteConfig = require('./vite.config.mjs') // Import Vite config
        const viteServer = await vite.createServer({
            ...viteConfig,
            appType: 'custom',
            // base: '/',
            server: {
                middlewareMode: true, // Enable middlewares for Vite
                // watch: {
                //     usePolling: true // Use polling for file changes
                // }
            },

        })
        app.use(viteServer.middlewares) // Use Vite middlewares for development
        app.get('/', async (req, res) => {
            try {
                // console.log('Rendering index page...')
                const url = req.originalUrl
                const templatePath = path.resolve(__dirname, './index.html')
                const template = await viteServer.transformIndexHtml(url, await fs.readFile(templatePath, 'utf-8'))
                const renderedHtml = (await viteServer.ssrLoadModule('/src/server.jsx')).render(url)
                const html = template
                    .replace(`<!--app-head-->`, renderedHtml.head ?? '')
                    .replace(`<!--app-html-->`, renderedHtml.html ?? '')

                res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
            } catch (error) {
                viteServer.ssrFixStacktrace(error)
                logger.error(error)
                res.status(500).end(error.message)
            }
        })
    } else {
        const DIST_PATH = path.resolve(__dirname, './dist')
        const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')
        app.use(express.static(DIST_PATH))
        app.get('/', (req, res) => res.sendFile(INDEX_PATH))
    }



    app.listen(PORT, () => { logger.info(`Started on port ${PORT}`) })
}

startServer()