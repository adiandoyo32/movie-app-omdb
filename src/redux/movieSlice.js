import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { searchMovies } from '@/api/movie'

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ query = '', page = 1 }, { rejectWithValue }) => {
    try {
      const res = await searchMovies({ query, page })
      return { data: res, page }
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch')
    }
  }
)

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    query: '',
    list: [],
    totalResults: 0,
    page: 1,
    status: 'idle',
    error: null,
    hasMore: true
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload
      state.list = []
      state.page = 1
      state.hasMore = true
    },
    resetMovies(state) {
      state.list = []
      state.page = 1
      state.hasMore = true
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMovies.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const { data, page } = action.payload
        if (data.Response === 'True') {
          // Append unique results
          const newItems = data.Search || []
          // Avoid duplicates by imdbID
          const existingIds = new Set(state.list.map(m => m.imdbID))

          newItems.forEach(it => {
            if (!existingIds.has(it.imdbID)) state.list.push(it)
          })
          state.totalResults = parseInt(data.totalResults || 0, 10)
          state.page = page
          state.hasMore = state.list.length < state.totalResults
        } else {
          // No results
          if (page === 1) state.list = []
          state.hasMore = false
          state.totalResults = 0
        }
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
  }
})

export const { setQuery, resetMovies } = moviesSlice.actions
export default moviesSlice.reducer
