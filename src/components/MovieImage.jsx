import { useState, useEffect } from 'react'

export default function MovieImage({ src, alt, className = '' }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)

  const showFallback = error || !src || src === 'N/A'

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {showFallback ? (
        <div
          className={`bg-gray-950 text-gray-300 flex items-center justify-center rounded-xl aspect-2/3 cursor-pointer ${className}`}
          onClick={e => {
            e.stopPropagation()
            setOpen(true)
          }}
        >
          No Poster
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`cursor-pointer transition-transform duration-300 hover:scale-105 rounded-xl ${className}`}
          onClick={e => {
            e.stopPropagation()
            setOpen(true)
          }}
          onError={() => setError(true)}
        />
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fadeIn"
          onClick={e => {
            e.stopPropagation()
            setOpen(false)
          }}
        >
          <div
            className="max-w-3xl w-auto p-4 animate-scaleIn"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={!showFallback ? src : null}
              alt={alt}
              className="max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
