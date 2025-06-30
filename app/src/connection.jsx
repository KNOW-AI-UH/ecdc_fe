import axios from 'axios'

const getData = async (dataName) => {
    const uniqueParam = `timestamp=${new Date().getTime()}`
    const url = `http://localhost:8000/summary?data=${dataName}&${uniqueParam}`
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error)
        throw error
    }
}

export { getData }