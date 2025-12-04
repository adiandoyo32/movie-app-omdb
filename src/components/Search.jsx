import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setQuery } from '@/redux/movieSlice'
import { searchMovies } from '@/api/movie'
import useDebounce from '@/hooks/useDebounce'
import MovieImage from '@/components/MovieImage'

const Search = () => {
  const dispatch = useDispatch()
  const { query } = useSelector(s => s.movies)
  const [value, setValue] = useState(query || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const debouncedForSuggestions = useDebounce(value, 500)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const suggestionItemRefs = useRef([])

  useEffect(() => {
    const fetchSuggestions = async () => {
      const trimmedValue = debouncedForSuggestions.trim()
      if (trimmedValue.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setIsLoadingSuggestions(true)
      try {
        const data = await searchMovies({ query: trimmedValue, page: 1 })
        if (data.Response === 'True' && data.Search) {
          setSuggestions(data.Search.slice(0, 8))
          suggestionItemRefs.current = []
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      } catch {
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }

    fetchSuggestions()
  }, [debouncedForSuggestions])

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionItemRefs.current[selectedIndex]) {
      suggestionItemRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [selectedIndex])

  const handleSelectSuggestion = suggestion => {
    const searchValue = suggestion.Title
    setValue(searchValue)
    setShowSuggestions(false)
    dispatch(setQuery(searchValue.trim()))
    inputRef.current?.blur()
  }

  const handleKeyDown = e => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && value.trim()) {
        dispatch(setQuery(value.trim()))
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex])
        } else if (value.trim()) {
          dispatch(setQuery(value.trim()))
          setShowSuggestions(false)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
      default:
        break
    }
  }

  const handleInputChange = e => {
    setValue(e.target.value)
    setSelectedIndex(-1)
    suggestionItemRefs.current = []
    if (e.target.value.trim().length >= 2) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0 && value.trim().length >= 2) {
      setShowSuggestions(true)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-8 py-4 relative">
      <input
        ref={inputRef}
        className="w-full px-3 py-3 rounded-lg bg-neutral-900 text-gray-100 placeholder-gray-500 
                  border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 
                  focus:border-transparent transition"
        placeholder="Search movies by title..."
        value={value}
        data-testid="search-input"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
      />
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full max-w-2xl mt-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          data-testid="autocomplete-suggestions"
        >
          {isLoadingSuggestions ? (
            <div className="px-4 py-3 text-gray-400 text-sm">Loading...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.imdbID}-${index}`}
                ref={el => (suggestionItemRefs.current[index] = el)}
                className={`flex items-center gap-2 p-2 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-yellow-600/80 text-white'
                    : 'text-gray-200 hover:bg-neutral-700'
                }`}
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                data-testid={`suggestion-${index}`}
              >
                <MovieImage
                  src={suggestion.Poster}
                  alt={suggestion.Title}
                  className="w-12 rounded-none object-cover"
                  openable={false}
                  hoverable={false}
                />
                <div>
                  <div className="font-medium">{suggestion.Title}</div>
                  <div className="text-sm text-gray-200">{suggestion.Year}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-400 text-sm">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
