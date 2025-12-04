import { useState, useEffect } from 'react'

export default function MovieImage({ src, alt, className = '', openable = true, hoverable = true }) {
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

  const handleClick = (e) => {
    e.stopPropagation()
    if (openable) {
      setOpen(true)
    }
  }

  return (
    <>
      {showFallback ? (
        <div
          className={`bg-gray-950 text-gray-300 flex items-center justify-center aspect-2/3 cursor-pointer ${className}`}
          onClick={handleClick}
        >
          No Poster
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${hoverable ? 'cursor-pointer transition-transform duration-300 hover:scale-105' : ''} ${className}`}
          onClick={handleClick}
          onError={() => setError(true)}
        />
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fadeIn"
          data-testid="modal"
          onClick={e => {
            e.stopPropagation()
            setOpen(false)
          }}
        >
          <div
            className="max-w-3xl w-auto p-4 animate-scaleIn"
            data-testid="modal-content"
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
