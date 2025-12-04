import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Search from '@/components/Search'
import moviesReducer from '@/redux/movieSlice'
import { searchMovies } from '@/api/movie'

vi.mock('@/api/movie', () => ({
  searchMovies: vi.fn()
}))

const mockSearchMovies = vi.mocked(searchMovies)

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      movies: moviesReducer
    },
    preloadedState: {
      movies: {
        query: '',
        list: [],
        totalResults: 0,
        page: 1,
        status: 'idle',
        error: null,
        hasMore: true,
        ...initialState
      }
    }
  })
}

const renderWithProvider = (component, initialState = {}) => {
  const store = createMockStore(initialState)
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store
  }
}

describe('Search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSearchMovies.mockResolvedValue({
      Response: 'True',
      Search: [
        {
          Title: 'Inception',
          Year: '2010',
          imdbID: 'tt1375666',
          Type: 'movie',
          Poster: 'https://example.com/inception.jpg'
        },
        {
          Title: 'Interstellar',
          Year: '2014',
          imdbID: 'tt0816692',
          Type: 'movie',
          Poster: 'https://example.com/interstellar.jpg'
        }
      ],
      totalResults: '2'
    })
  })

  it('renders the search input field', () => {
    renderWithProvider(<Search />)
    const input = screen.getByTestId('search-input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('updates input value when user types', async () => {
    renderWithProvider(<Search />)
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'Inception' } })
    expect(input).toHaveValue('Inception')
  })

  it('dispatches setQuery action when Enter is pressed', async () => {
    vi.useFakeTimers()
    const { store } = renderWithProvider(<Search />)
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'Inception' } })
    expect(input).toHaveValue('Inception')
    expect(store.getState().movies.query).toBe('')
    
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(store.getState().movies.query).toBe('Inception')
    vi.useRealTimers()
  })

  it('trims whitespace from input before dispatching on Enter', async () => {
    vi.useFakeTimers()
    const { store } = renderWithProvider(<Search />)
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: ' Inception ' } })
    expect(input).toHaveValue(' Inception ')
    expect(store.getState().movies.query).toBe('')
    
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(store.getState().movies.query).toBe('Inception')
    vi.useRealTimers()
  })

  it('does not dispatch setQuery for empty values on Enter', async () => {
    vi.useFakeTimers()
    const { store } = renderWithProvider(<Search />)
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'Test' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(store.getState().movies.query).toBe('Test')
    
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(store.getState().movies.query).toBe('Test')
    vi.useRealTimers()
  })

  it('fetches and displays autocomplete suggestions', async () => {
    renderWithProvider(<Search />)
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'In' } })
    await waitFor(() => {
      expect(mockSearchMovies).toHaveBeenCalledWith({ query: 'In', page: 1 })
    })
    expect(screen.getByTestId('autocomplete-suggestions')).toBeInTheDocument()
    expect(screen.getByText('Inception')).toBeInTheDocument()
    expect(screen.getByText('Interstellar')).toBeInTheDocument()
  })
})