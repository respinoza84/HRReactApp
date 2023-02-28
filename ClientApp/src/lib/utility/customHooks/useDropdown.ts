/**
 * @author Oliver Zamora
 * @description 9/23/2019 - separating display from logic. Holding the state, changing the height of dropdown
 */

import React, {useState, useRef, useEffect} from 'react'
import {useOnClickOutside} from '.'

type UseDropdownOptions = {
  itemLimit?: number
  mouseLeaveDelay?: number
}

type UseDropdownState = {
  menuOpen: boolean
  height: string | 'auto'
}

export type DropdownContentBind = {
  ref: React.RefObject<HTMLDivElement>
  itemLimitHeight: string
  onMouseEnter: () => void
  onMouseLeave: () => void
}

const defaultOptions: UseDropdownOptions = {
  itemLimit: 0, // 0 is No Limit
  mouseLeaveDelay: 500 // Milliseconds
}

export const useDropdown = <T>(items?: T[], opts?: UseDropdownOptions) => {
  const {itemLimit, mouseLeaveDelay} = {...defaultOptions, ...opts}

  const dropdownContentRef: React.RefObject<HTMLDivElement> = useRef(null)
  const clickOutsideRef: React.RefObject<HTMLDivElement> = useRef(null)
  const timeoutId = useRef(0)

  const [dropdownState, setState] = useState<UseDropdownState>(() => ({
    menuOpen: false,
    height: 'auto'
  }))

  /**
   * true to open, false to close, undefined to toggle
   * @param open true to open, false to close, undefined to toggle
   */
  const setMenu = (open?: boolean) => {
    setState((prevState) => ({
      ...prevState,
      menuOpen: open === undefined ? !dropdownState.menuOpen : open
    }))
  }

  useOnClickOutside(clickOutsideRef, () => setMenu(false))

  const bind: DropdownContentBind = {
    ref: dropdownContentRef,
    itemLimitHeight: dropdownState.height,
    onMouseEnter: () => {
      if (timeoutId.current) window.clearTimeout(timeoutId.current)
    },
    // For Relative Container
    onMouseLeave: () => {
      timeoutId.current = window.setTimeout(() => {
        if (dropdownState.menuOpen) {
          setMenu(false)
        }
      }, mouseLeaveDelay)
    }
  }

  useEffect(() => {
    if (
      items &&
      !!items.length && // has items
      !!itemLimit && // has itemLimit
      items.length > itemLimit && // over the limit
      (!dropdownState.height || dropdownState.height === 'auto') && // has default or no height
      dropdownContentRef.current // has current ref
    ) {
      const calcMenuHeight = (limit: number) =>
        dropdownContentRef.current && items && !!items.length
          ? `${(dropdownContentRef.current.clientHeight * ((limit / items.length) * 100)) / 100}px`
          : 'auto'

      setState((prevState) => ({
        ...prevState,
        height: calcMenuHeight(itemLimit)
      }))
    }
  }, [dropdownState.height, itemLimit, dropdownState.menuOpen, items])

  return [
    dropdownState,
    {
      setMenu,
      clickOutsideRef
    },
    bind
  ] as [
    UseDropdownState,
    {
      setMenu: (open?: boolean) => void
      clickOutsideRef: React.RefObject<HTMLDivElement>
    },
    DropdownContentBind
  ]
}
