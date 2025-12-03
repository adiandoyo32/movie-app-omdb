import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovieById } from '@/api/movie'
import MovieImage from '@/components/MovieImage'

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getMovieById(id)
        if (data.Response === 'True') {
          setMovie(data)
        } else {
          setError(data.Error || 'Movie not found')
        }
      } catch (err) {
        setError('Failed to fetch movie details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMovie()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-white text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 cursor-pointer text-sm text-gray-900 rounded-md font-semibold transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  if (!movie) {
    return null
  }

  const genres = movie.Genre?.split(', ').filter(Boolean) || []
  const actors = movie.Actors?.split(', ').filter(Boolean) || []
  const directors = movie.Director?.split(', ').filter(Boolean) || []
  const writers = movie.Writer?.split(', ').filter(Boolean) || []

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="">
        <div className="grid md:grid-cols-3 gap-8 p-6 md:py-16 md:px-10">
          <div className="md:col-span-1">
            <div className="md:sticky top-6">
              <div className="rounded-xl overflow-hidden">
                <MovieImage
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white mb-2">
                {movie.Title}
              </h1>
              <div className="flex flex-wrap items-center gap-6">
                {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                  <div className="">
                    <div className="text-sm">{movie.imdbRating}</div>
                  </div>
                )}
                {movie.Runtime && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm">{movie.Runtime}</span>
                  </span>
                )}
                <span className="text-sm">{movie.Year}</span>
                {movie.Rated && (
                  <span className="px-2 py-0.5 bg-gray-700/20 text-yellow-500 rounded text-sm font-medium">
                    {movie.Rated}
                  </span>
                )}
              </div>
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-4 py-1 bg-gray-700/20 text-gray-400 rounded text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {movie.Plot && movie.Plot !== 'N/A' && (
              <p className="text-gray-300 leading-relaxed text-base">
                {movie.Plot}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {directors.length > 0 && (
                <div>
                  <h4 className="text-gray-400 text-sm font-semibold mb-1">
                    Director{directors.length > 1 ? 's' : ''}
                  </h4>
                  <p className="text-white">{directors.join(', ')}</p>
                </div>
              )}
              {writers.length > 0 && (
                <div>
                  <h4 className="text-gray-400 text-sm font-semibold mb-1">
                    Writer{writers.length > 1 ? 's' : ''}
                  </h4>
                  <p className="text-white">{writers.join(', ')}</p>
                </div>
              )}
              {actors.length > 0 && (
                <div className="sm:col-span-2">
                  <h4 className="text-gray-400 text-sm font-semibold mb-1">
                    Cast
                  </h4>
                  <p className="text-white">{actors.join(', ')}</p>
                </div>
              )}
              {movie.Language && movie.Language !== 'N/A' && (
                <div>
                  <h4 className="text-gray-400 text-sm font-semibold mb-1">
                    Language
                  </h4>
                  <p className="text-white">{movie.Language}</p>
                </div>
              )}
              {movie.Country && movie.Country !== 'N/A' && (
                <div>
                  <h4 className="text-gray-400 text-sm font-semibold mb-1">
                    Country
                  </h4>
                  <p className="text-white">{movie.Country}</p>
                </div>
              )}
              {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                <div>
                  <h4 className="text-gray-400 text-sm font-semibold mb-1">
                    Box Office
                  </h4>
                  <p className="text-white font-semibold">{movie.BoxOffice}</p>
                </div>
              )}
              {movie.Production && movie.Production !== 'N/A' && (
                <div>
                  <h4 className="text-gray-400 text-sm font-semibold mb-1">
                    Production
                  </h4>
                  <p className="text-white">{movie.Production}</p>
                </div>
              )}
              {movie.Released && movie.Released !== 'N/A' && (
                <div>
                  <h4 className="text-gray-400 text-sm font-semibold mb-1">
                    Release Date
                  </h4>
                  <p className="text-white">{movie.Released}</p>
                </div>
              )}
              {movie.DVD && movie.DVD !== 'N/A' && (
                <div>
                  <h4 className="text-gray-400 text-sm font-semibold mb-1">
                    DVD Release
                  </h4>
                  <p className="text-white">{movie.DVD}</p>
                </div>
              )}
              {movie.Awards && movie.Awards !== 'N/A' && (
                <div className="sm:col-span-2">
                  <h4 className="text-gray-400 text-sm font-semibold mb-1">
                    Awards
                  </h4>
                  <p className="text-white">{movie.Awards}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
