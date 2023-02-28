import {useState, useEffect} from 'react'
import {Subject, timer} from 'rxjs'
import {debounce} from 'rxjs/operators'

type XY = {
  x: number
  y: number
}
type HoverPayload<T> = XY & {
  payload: T
}

const useOnHover = <T>(onSubscribe: (payload: HoverPayload<T>) => void, delay: number = 500) => {
  const [getHoverX, setHoverX] = useState(() => 450)
  const [getHoverY, setHoverY] = useState(() => 475)
  const [hoverSubject$] = useState(() => new Subject<HoverPayload<T>>())

  useEffect(() => {
    const hoverSubscription = hoverSubject$.pipe(debounce(() => timer(delay))).subscribe(({payload, x, y}) => {
      setHoverX(x)
      setHoverY(y)
      onSubscribe({payload, x, y})
    })

    return () => {
      if (!hoverSubscription.closed) hoverSubscription.unsubscribe()
    }
  }, [delay, onSubscribe, hoverSubject$])

  return [hoverSubject$, getHoverX, getHoverY] as [Subject<HoverPayload<T>>, number, number]
}

export {useOnHover}
