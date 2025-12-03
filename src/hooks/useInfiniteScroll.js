import { useEffect } from 'react'

export default function useInfiniteScroll(callback, canLoad) {
  useEffect(() => {
    // console.log("object", !canLoad);
    // if (!canLoad){
    //   return
    // }

    const onScroll = () => {
      console.log("scroll");
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        callback()
      }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [callback, canLoad])
}
