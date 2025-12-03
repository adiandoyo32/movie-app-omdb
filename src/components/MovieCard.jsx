export default function MovieCard({ movie }) {
  return (
    <div className="relative overflow-hidden cursor-pointer group">
      <div className="overflow-hidden rounded-xl">
        <img
          src={
            movie.Poster === 'N/A'
              ? `https://via.placeholder.com/120x170?text=${encodeURIComponent(movie.Title)}`
              : movie.Poster
          }
          alt={movie.Title}
          className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="text-neutral-950 text-base font-semibold mt-2 leading-5">
        {movie.Title} ({movie.Year})
      </p>
    </div>
  )
}
