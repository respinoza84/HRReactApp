import {useEffect, useRef, useState} from 'react'
import {filter, merge, debounce, map} from 'rxjs/operators'
import {Subject, timer} from 'rxjs'

const getScrollableTarget = (scrollableTarget: HTMLElement | string | Window | null) => {
  if (scrollableTarget instanceof HTMLElement) return scrollableTarget
  if (typeof scrollableTarget === 'string') {
    return document.getElementById(scrollableTarget)
  }

  return null
}

const atBottomCalc = (scrollPercent: number) => ({scrollTop, clientHeight, scrollHeight}: ScrollPosition) => {
  const isAtBottom = (scrollTop + clientHeight) / scrollHeight > scrollPercent / 100

  return isAtBottom
}

type ScrollPosition = {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
}

type InfiniteScrollOptions = {
  scrollableTarget?: HTMLElement | string | Window | null
  scrollPercent?: number
  debounceMs?: number
  useWindow?: boolean
}

const defaultOptions: InfiniteScrollOptions = {
  scrollableTarget: null,
  scrollPercent: 90,
  debounceMs: 1000,
  useWindow: false
}

const useInfiniteScroll = (options?: InfiniteScrollOptions, handler?: (event: any) => void, deps: any[] = []) => {
  const {scrollableTarget, scrollPercent, debounceMs, useWindow} = {
    ...defaultOptions,
    ...options
  }
  const scrollSubject$ = useRef(new Subject())
  const resizeSubject$ = useRef(new Subject())
  const isAtBottom = atBottomCalc(scrollPercent!)
  const onScrollListener = (event: Event) => scrollSubject$.current.next(event)
  const onResizeListener = (event: Event) => resizeSubject$.current.next(event)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let lastScrollTop = 0
    scrollSubject$.current
      .pipe(
        map(
          ({target}: any): ScrollPosition =>
            target === document
              ? {
                  scrollTop: document.body.scrollTop || document.documentElement.scrollTop,
                  scrollHeight: document.documentElement.scrollHeight,
                  clientHeight: document.documentElement.clientHeight
                }
              : {
                  scrollTop: target.scrollTop,
                  scrollHeight: target.scrollHeight,
                  clientHeight: target.clientHeight
                }
        ),
        filter(({scrollTop}: ScrollPosition) => {
          const down = scrollTop > lastScrollTop
          lastScrollTop = scrollTop

          return down
        }),
        filter(isAtBottom),
        debounce(() => timer(debounceMs)),
        merge(resizeSubject$.current)
      )
      .subscribe((scrollPosition) => {
        setIsScrolling(true)
        if (handler) handler(scrollPosition)
        setIsScrolling(false)
      })
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let scrollableNode: HTMLElement | Window | null
    if (scrollableTarget) {
      scrollableNode = getScrollableTarget(scrollableTarget!) || window

      if (scrollableNode) scrollableNode.addEventListener('scroll', onScrollListener)
    } else if (useWindow) {
      scrollableNode = window
      scrollableNode.addEventListener('resize', onResizeListener)
    }
    window.addEventListener('resize', onResizeListener)

    return () => {
      if (scrollableNode) scrollableNode.removeEventListener('scroll', onScrollListener)
      if (useWindow) window.removeEventListener('scroll', onScrollListener)
      window.removeEventListener('resize', onResizeListener)
    }
  }, [scrollableTarget, useWindow])

  const bind = {
    onScroll: onScrollListener
  }

  return [isScrolling, bind] as [boolean, any]
}

export {useInfiniteScroll}
