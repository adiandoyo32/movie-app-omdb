import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import MovieList from '@/components/MovieList'
import moviesReducer from '@/redux/movieSlice'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// eslint-disable-next-line no-undef
global.IntersectionObserver = class {
  constructor(callback, options) {
    this.callback = callback
    this.options = options
  }
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

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
    ...render(
      <MemoryRouter>
        <Provider store={store}>{component}</Provider>
      </MemoryRouter>
    ),
    store
  }
}

describe('MovieList', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    vi.clearAllMocks()
  })

  it('renders empty state when no movies and not loading', () => {
    renderWithProvider(<MovieList />, {
      list: [],
      status: 'idle',
      error: null
    })

    expect(screen.getByText('No results yet — try searching a movie.')).toBeInTheDocument()
  })

  it('renders list of movies', () => {
    const movies = [
      {
        Title: 'Movie 1',
        Year: '2020',
        Type: 'movie',
        Poster: 'N/A',
        imdbID: 'tt1'
      },
      {
        Title: 'Movie 2',
        Year: '2021',
        Type: 'movie',
        Poster: 'N/A',
        imdbID: 'tt2'
      }
    ]

    renderWithProvider(<MovieList />, {
      list: movies,
      status: 'succeeded',
      query: 'test',
      hasMore: true
    })

    expect(screen.getByText('Movie 1 (2020)')).toBeInTheDocument()
    expect(screen.getByText('Movie 2 (2021)')).toBeInTheDocument()
  })

  it('renders error message when error exists', () => {
    renderWithProvider(<MovieList />, {
      list: [],
      status: 'failed',
      error: 'Failed to fetch movies',
      query: 'test'
    })

    expect(screen.getByText('Failed to fetch movies')).toBeInTheDocument()
  })

  it('renders loading indicator when loading', () => {
    renderWithProvider(<MovieList />, {
      list: [],
      status: 'loading',
      query: 'test',
      hasMore: true
    })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders end of results message when no more movies', () => {
    const movies = [
      {
        Title: 'Movie 1',
        Year: '2020',
        Type: 'movie',
        Poster: 'N/A',
        imdbID: 'tt1'
      }
    ]

    renderWithProvider(<MovieList />, {
      list: movies,
      status: 'succeeded',
      query: 'test',
      hasMore: false
    })

    expect(screen.getByText("You've reached the end of results.")).toBeInTheDocument()
  })

  it('does not show empty state when loading', () => {
    renderWithProvider(<MovieList />, {
      list: [],
      status: 'loading',
      query: 'test'
    })

    expect(screen.queryByText('No results yet — try searching a movie.')).not.toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('does not show empty state when error exists', () => {
    renderWithProvider(<MovieList />, {
      list: [],
      status: 'failed',
      error: 'Error message',
      query: 'test'
    })

    expect(screen.queryByText('No results yet — try searching a movie.')).not.toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('renders multiple movie cards correctly', () => {
    const movies = Array.from({ length: 5 }, (_, i) => ({
      Title: `Movie ${i + 1}`,
      Year: `202${i}`,
      Type: 'movie',
      Poster: 'N/A',
      imdbID: `tt${i + 1}`
    }))

    renderWithProvider(<MovieList />, {
      list: movies,
      status: 'succeeded',
      query: 'test',
      hasMore: true
    })

    movies.forEach(movie => {
      expect(screen.getByText(`${movie.Title} (${movie.Year})`)).toBeInTheDocument()
    })
  })
})