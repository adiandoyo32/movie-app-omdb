import { useNavigate } from 'react-router-dom'
import MovieImage from '@/components/MovieImage'

export default function MovieCard({ movie }) {
  const navigate = useNavigate()

  return (
    <>
      <div
        className="relative overflow-hidden cursor-pointer group"
        onClick={() => navigate(`/movie/${movie.imdbID}`)}
      >
        <div className="overflow-hidden rounded-xl aspect-2/3">
          <MovieImage
            src={movie.Poster}
            alt={movie.Title}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-white/85 text-base font-semibold px-3 py-3 leading-5">
          {movie.Title} ({movie.Year})
        </p>
      </div>
    </>
  )
}
