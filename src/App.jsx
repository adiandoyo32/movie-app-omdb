import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import MovieDetail from '@/pages/MovieDetail'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
