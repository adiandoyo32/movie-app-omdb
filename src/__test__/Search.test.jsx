import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Search from '@/components/Search'
import moviesReducer from '@/redux/movieSlice'

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

  it('dispatches setQuery action after debounce delay', async () => {
    vi.useFakeTimers()
    const { store } = renderWithProvider(<Search />)
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'Inception' } })
    expect(input).toHaveValue('Inception')
    expect(store.getState().movies.query).toBe('')
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(store.getState().movies.query).toBe('Inception')
    vi.useRealTimers()
  })

  it('trims whitespace from input before dispatching', async () => {
    vi.useFakeTimers()
    const { store } = renderWithProvider(<Search />)
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: ' Inception ' } })
    expect(input).toHaveValue(' Inception ')
    expect(store.getState().movies.query).toBe('')
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(store.getState().movies.query).toBe('Inception')
    vi.useRealTimers()
  })

  it('does not dispatch setQuery for empty values', async () => {
    vi.useFakeTimers()
    const { store } = renderWithProvider(<Search />)
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'Test' } })
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(store.getState().movies.query).toBe('Test')
    fireEvent.change(input, { target: { value: '' } })
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(store.getState().movies.query).toBe('Test')
    vi.useRealTimers()
  })

  it('debounces multiple rapid input changes', async () => {
    vi.useFakeTimers()
    const { store } = renderWithProvider(<Search />)
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'In' } })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    fireEvent.change(input, { target: { value: 'Incep' } })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    fireEvent.change(input, { target: { value: 'Inception' } })
    expect(store.getState().movies.query).toBe('')
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(store.getState().movies.query).toBe('Inception')
    vi.useRealTimers()
  })
})