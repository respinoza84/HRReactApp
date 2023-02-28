import * as React from 'react'

type Dimensions = {
  height: number
  width: number
}

const useResizeDimensions = (ref: React.RefObject<HTMLElement>) => {
  const [{height, width}, setDimensions] = React.useState({
    height: ref.current ? ref.current.clientHeight : 0,
    width: ref.current ? ref.current.clientWidth : 0
  } as Dimensions)

  React.useEffect(() => {
    const handleResize = () =>
      setDimensions({
        height: ref.current!.clientHeight - 120,
        width: ref.current!.clientWidth - 120
      })

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [ref])

  return [{height, width}]
}

export {useResizeDimensions}
