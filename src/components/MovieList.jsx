import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MovieCard from '@/components/MovieCard'
import { fetchMovies } from '@/redux/movieSlice'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'

export default function MovieList() {
  const dispatch = useDispatch()
  const { list, status, error, query, page, hasMore } = useSelector(
    s => s.movies
  )

  const loadMore = useCallback(() => {
    if (status === 'loading' || !hasMore || !query || status === 'failed') {
      return
    }
    dispatch(fetchMovies({ query, page: page + 1 }))
  }, [dispatch, query, page, hasMore, status])

  const loaderRef = useInfiniteScroll(
    loadMore,
    !!query && hasMore && status !== 'loading'
  )

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      {status === 'failed' && (
        <div className="text-center max-w-md mx-auto px-4 mt-36">
          <h2 className="text-white text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-gray-300 mb-6">{error}</p>
        </div>
      )}
      {list.length === 0 && status !== 'loading' && !error && (
        <div className="p-6 text-center text-gray-600">
          No results yet — try searching a movie.
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
        {list.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
      <div className="py-6 text-center">
        {status === 'loading' && <div className="text-white">Loading...</div>}

        {!hasMore && list.length > 0 && (
          <div className="text-sm text-white mt-4">
            You've reached the end of results.
          </div>
        )}

        <div ref={loaderRef} className="h-10" />
      </div>
    </div>
  )
}
