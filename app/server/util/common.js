const PORT = process.env.PORT || 8000
const inProduction = process.env.NODE_ENV === 'production'

module.exports = {
    PORT,
    inProduction
}