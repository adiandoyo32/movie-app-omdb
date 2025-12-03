import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { useEffect, useCallback } from 'react'
import { fetchMovies } from '@/redux/movieSlice'
import Search from '@/components/Search'
import MovieList from '@/components/MovieList'
import MovieCard from '@/components/MovieCard'

function App() {
  const dispatch = useDispatch()
  const { query, list, page, status, error, hasMore, totalResults } =
    useSelector(s => s.movies)

  useEffect(() => {
    if (query) {
      dispatch(fetchMovies({ query, page: 1 }))
    }
  }, [query, dispatch])

  // const handleScroll = useCallback(() => {
  //   const nearBottom =
  //     window.innerHeight + window.scrollY >= document.body.offsetHeight - 800
  //   console.log("🚀 ~ App ~ nearBottom:", nearBottom)
  //   if (nearBottom && status !== 'loading' && hasMore) {
  //     dispatch(fetchMovies({ query, page: page + 1 }))
  //   }
  // }, [dispatch, query, page, status, hasMore])

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll, { passive: true })
  //   return () => window.removeEventListener('scroll', handleScroll)
  // }, [handleScroll])

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white shadow">
          <div className="max-w-4xl mx-auto p-6 flex items-center gap-4">
            <h1 className="text-2xl font-bold">OMDb Movie Search</h1>
            <p className="text-sm text-gray-500">
              Search movies with infinite scroll
            </p>
          </div>
        </header>

        <main className="py-6">
          hiii {query}
          {status} - {page} - {totalResults}
          <Search />
          <MovieList />
          {/* <section className="grid grid-cols-1 gap-4">
            {list.length === 0 && status === 'succeeded' && (
              <div className="p-6 text-center text-gray-600">
                No movies found.
              </div>
            )}

            {list.map(m => (
              <MovieCard key={m.imdbID} movie={m} />
            ))}

            {status === 'loading' && (
              <div className="p-4 text-center">Loading...</div>
            )}

            {error && <div className="p-4 text-red-500">Error: {error}</div>}

            {!hasMore && list.length > 0 && (
              <div className="p-4 text-center text-gray-500">
                No more results
              </div>
            )}
          </section> */}
        </main>

        <footer className="py-6 text-center text-sm text-gray-500">
          Powered by OMDb API
        </footer>
      </div>
    </>
  )
}

export default App
