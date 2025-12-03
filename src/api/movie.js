import axios from 'axios'

const API_KEY = import.meta.env.VITE_OMDB_API_KEY
const BASE_URL = 'https://www.omdbapi.com/'

const client = axios.create({ baseURL: BASE_URL, timeout: 10000 })

export const searchMovies = async ({ query, page }) => {
  const params = {
    apikey: API_KEY,
    s: query,
    page,
    type: 'movie'
  }
  const { data } = await client.get('/', { params })
  return data
}

export default client