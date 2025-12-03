import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setQuery } from '@/redux/movieSlice'
import useDebounce from '@/hooks/useDebounce'

const Search = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const debounced = useDebounce(value, 500)

  useEffect(() => {
    if (debounced) {
      dispatch(setQuery(debounced.trim() || ''))
    }
  }, [debounced, dispatch])

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <input
        className="w-full p-3 rounded shadow-sm border focus:outline-none"
        placeholder="Search movies by title..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
}

export default Search