import { useEffect, useRef } from 'react'

export default function useInfiniteScroll(onLoadMore, shouldLoad = true) {
  const ref = useRef(null)

  useEffect(() => {
    if (!shouldLoad) return

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          onLoadMore()
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [onLoadMore, shouldLoad])

  return ref
}
