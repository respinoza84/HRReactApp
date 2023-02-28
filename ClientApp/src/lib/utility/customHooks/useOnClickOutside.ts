import {useEffect, RefObject} from 'react'

const useOnClickOutside = (ref: RefObject<any>, handler: (event: MouseEvent) => void) => {
  useEffect(() => {
    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || !ref.current.contains || ref.current.contains(event.target)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
    }
  }, [handler, ref])
}

export {useOnClickOutside}
