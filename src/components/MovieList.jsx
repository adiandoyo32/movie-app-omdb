import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MovieCard from '@/components/MovieCard'
import { fetchMovies } from '@/redux/movieSlice'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'

export default function MovieList() {
  const dispatch = useDispatch()
  const { list, loading, error, keyword, page, hasMore } = useSelector(
    s => s.movies
  )

  const loadMore = useCallback(() => {
    if (loading || !hasMore || !keyword) return
    dispatch(fetchMovies({ keyword, page: page + 1 }))
  }, [dispatch, keyword, page, hasMore, loading])

  useInfiniteScroll(loadMore, !!keyword && hasMore && !loading)

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      has more
      {hasMore}
      asdasd
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}
      {list.length === 0 && !loading && !error && (
        <div className="p-6 text-center text-gray-600">
          No results yet — try searching a movie.
        </div>
      )}
      {/* <div className="grid grid-cols-1 gap-4">
        {list.map(m => (
          <MovieCard key={m.imdbID} movie={m} />
        ))}
      </div> */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
        {list.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
      <div className="py-6 text-center">
        {loading && <div>Loading...</div>}
        {!hasMore && list.length > 0 && (
          <div className="text-sm text-gray-500 mt-4">
            You've reached the end of results.
          </div>
        )}
      </div>
    </div>
  )
}
