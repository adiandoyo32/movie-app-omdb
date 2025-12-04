import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MovieImage from '@/components/MovieImage'

describe('MovieImage', () => {
  describe('Rendering', () => {
    it('renders image when valid src is provided', () => {
      const src = 'https://example.com/poster.jpg'
      const alt = 'Movie poster'
      render(<MovieImage src={src} alt={alt} />)
      const image = screen.getByAltText(alt)
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', src)
    })

    it('renders fallback when src is N/A', () => {
      render(<MovieImage src="N/A" alt="Movie poster" />)
      expect(screen.getByText('No Poster')).toBeInTheDocument()
      expect(screen.queryByAltText('Movie poster')).not.toBeInTheDocument()
    })

    it('renders fallback when src is null', () => {
      render(<MovieImage src={null} alt="Movie poster" />)
      expect(screen.getByText('No Poster')).toBeInTheDocument()
    })

    it('renders fallback when src is undefined', () => {
      render(<MovieImage alt="Movie poster" />)
      expect(screen.getByText('No Poster')).toBeInTheDocument()
    })

    it('renders fallback when image fails to load', () => {
      const src = 'https://example.com/invalid.jpg'
      render(<MovieImage src={src} alt="Movie poster" />)
      const image = screen.getByAltText('Movie poster')
      expect(image).toBeInTheDocument()
      fireEvent.error(image)
      expect(screen.getByText('No Poster')).toBeInTheDocument()
      expect(screen.queryByAltText('Movie poster')).not.toBeInTheDocument()
    })

    it('applies custom className to image', () => {
      const src = 'https://example.com/poster.jpg'
      const className = 'custom-class'
      const { container } = render(
        <MovieImage src={src} alt="Movie poster" className={className} />
      )
      const image = container.querySelector('img')
      expect(image).toHaveClass(className)
    })

    it('applies custom className to fallback', () => {
      const className = 'custom-class'
      const { container } = render(
        <MovieImage src="N/A" alt="Movie poster" className={className} />
      )
      const fallback = container.querySelector('.bg-gray-950')
      expect(fallback).toHaveClass(className)
    })
  })

  describe('Modal functionality', () => {
    it('opens modal when image is clicked', () => {
      const src = 'https://example.com/poster.jpg'
      const alt = 'Movie poster'
      
      render(<MovieImage src={src} alt={alt} />)
      
      const image = screen.getByAltText(alt)
      fireEvent.click(image)
      
      const modal = screen.getByTestId('modal')
      expect(modal).toBeInTheDocument()
      expect(modal).toHaveClass('fixed', 'inset-0', 'z-50')
    })

    it('opens modal when fallback is clicked', () => {
      render(<MovieImage src="N/A" alt="Movie poster" />)
      const fallback = screen.getByText('No Poster')
      fireEvent.click(fallback)
      const modal = screen.getByTestId('modal')
      expect(modal).toBeInTheDocument()
    })

    it('closes modal when backdrop is clicked', () => {
      const src = 'https://example.com/poster.jpg'
      const alt = 'Movie poster'
      render(<MovieImage src={src} alt={alt} />)
      const image = screen.getByAltText(alt)
      fireEvent.click(image)
      const modal = screen.getByTestId('modal')
      fireEvent.click(modal)
      expect(modal).not.toBeInTheDocument()
    })

    it('does not close modal when modal content is clicked', () => {
      const src = 'https://example.com/poster.jpg'
      const alt = 'Movie poster'
      render(<MovieImage src={src} alt={alt} />)
      const image = screen.getByAltText(alt)
      fireEvent.click(image)
      const modalContent = screen.getByTestId('modal-content')
      expect(modalContent).toBeInTheDocument()
      fireEvent.click(modalContent)
      const modal = screen.getByTestId('modal')
      expect(modal).toBeInTheDocument()
    })

    it('displays image in modal when valid src exists', () => {
      const src = 'https://example.com/poster.jpg'
      const alt = 'Movie poster'
      
      render(<MovieImage src={src} alt={alt} />)
      
      const image = screen.getByAltText(alt)
      fireEvent.click(image)
      const images = screen.getAllByAltText(alt)
      expect(images.length).toBeGreaterThan(0)
      const modalImage = images.find(img => 
        img.closest('.fixed.inset-0')
      )
      expect(modalImage).toHaveAttribute('src', src)
    })

    it('does not display image in modal when fallback is shown', () => {
      render(<MovieImage src="N/A" alt="Movie poster" />)      
      const fallback = screen.getByText('No Poster')
      fireEvent.click(fallback)

      const modal = screen.getByTestId('modal')
      expect(modal).toBeInTheDocument()

      const modalImage = modal?.querySelector('img')
      expect(modalImage).not.toHaveAttribute('src')
    })
  })
})