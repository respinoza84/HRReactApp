import {useEffect, RefObject} from 'react'

const useOnHoverOutside = <T extends Element>(ref: RefObject<T>, handler: (event: MouseEvent) => void) => {
  useEffect(() => {
    const currentRef = ref.current
    const listener = (event: any) => {
      if (!currentRef || (currentRef.contains && currentRef.contains(event.relatedTarget))) {
        return
      }

      handler(event)
    }

    if (currentRef) {
      currentRef.addEventListener('mouseleave', listener)
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mouseleave', listener)
      }
    }
  }, [handler, ref])
}

export {useOnHoverOutside}
