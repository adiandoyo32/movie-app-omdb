import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MovieCard from '@/components/MovieCard'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('MovieCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('movie card click navigates', () => {
    const movie = {
      Title: 'Test Movie',
      Year: '2020',
      Type: 'movie',
      Poster: 'N/A',
      imdbID: 'tt12345'
    }

    const { container } = render(
      <MemoryRouter>
        <MovieCard movie={movie} />
      </MemoryRouter>
    )

    const card = container.firstChild
    const title = screen.getByTestId('movie-title')
    expect(title).toHaveTextContent('Test Movie (2020)')

    fireEvent.click(card)
    expect(mockNavigate).toHaveBeenCalledWith('/movie/tt12345')
  })
})