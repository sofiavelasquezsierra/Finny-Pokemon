import { useCallback, useState } from 'react'

// Returns a callback ref plus whether that element is in view. A callback ref
// (not useRef + useEffect) re-attaches when the element mounts conditionally.
export function useIntersectionObserver<T extends Element>(rootMargin = '0px') {
  const [isIntersecting, setIsIntersecting] = useState(false)

  const ref = useCallback(
    (node: null | T) => {
      if (!node) return

      const observer = new IntersectionObserver(
        ([entry]) => setIsIntersecting(entry.isIntersecting),
        { rootMargin }
      )
      observer.observe(node)

      // React 19 calls a returned cleanup when the ref detaches
      return () => observer.disconnect()
    },
    [rootMargin]
  )

  return { isIntersecting, ref }
}
