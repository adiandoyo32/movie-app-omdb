import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchMovies } from '@/redux/movieSlice'
import Search from '@/components/Search'
import MovieList from '@/components/MovieList'

export default function Home() {
  const dispatch = useDispatch()
  const { query } = useSelector(s => s.movies)

  useEffect(() => {
    if (query) {
      dispatch(fetchMovies({ query, page: 1 }))
    }
  }, [query, dispatch])

  return (
    <>
      <div className="min-h-screen text-gray-900">
        {/* <header className="bg-white shadow">
          <div className="max-w-4xl mx-auto p-6 flex items-center gap-4">
            <h1 className="text-2xl font-bold">OMDb Movie Search</h1>
            <p className="text-sm text-gray-500">
              Search movies with infinite scroll
            </p>
          </div>
        </header> */}

        <main className="py-6">
          <Search />
          <MovieList />
        </main>

        {/* <footer className="py-6 text-center text-sm text-white">
          Powered by OMDb API
        </footer> */}
      </div>
    </>
  )
}
