import React, {useReducer, useRef, useEffect} from 'react'

// HELPERS
const getNextIndex = (idx: number, max: number) => {
  if (idx === max - 1) return idx

  return idx + 1
}

const getPrevIndex = (idx: number) => {
  return idx === 0 ? idx : idx - 1
}

type Action<T> =
  | {type: 'ENTER_KEY'} // Includes TAB KEY
  | {type: 'DOWN_KEY'}
  | {type: 'UP_KEY'}
  | {type: 'ON_BLUR_ESC'}
  | {type: 'INPUT_UPDATE'; payload: string}
  | {type: 'SELECT_ITEM'; payload: {index: number}}
  | {type: 'UPDATE_ITEMS'; payload: WithTypeaheadIdAndSearchString<T>[]}

function init<S>(initialState: S) {
  return {
    ...initialState
  }
}
const mapBack = <T>({
  typeaheadInputValue,
  typeaheadSearchString,
  customItemDisplay,
  getImageUrl,
  ...t
}: WithTypeaheadIdAndSearchString<T>) => ({
  ...((t as unknown) as T)
})

const CreateTypeaheadReducer = <T>() => (state: TypeaheadState<T>, action: Action<T>): TypeaheadState<T> => {
  switch (action.type) {
    // TODO: img
    case 'INPUT_UPDATE':
      // TODO: better find match using search string
      const newFiltered =
        action.payload !== ''
          ? state.results.filter((i) =>
              i.typeaheadInputValue.toLowerCase().trim().includes(action.payload.toLowerCase().trim())
            )
          : []
      const hasResults = !!newFiltered.length

      if (!state.activeItem && state.allowFreeSelection) {
        state.emitChange.current(action.payload)
      }

      return {
        ...state,
        userInput: action.payload,
        showResults: hasResults,
        activeIndex: hasResults ? 0 : -1,
        activeItem: hasResults ? newFiltered[0] : undefined,
        filteredResults: newFiltered,
        imageUrl: ''
      }
    case 'SELECT_ITEM': {
      const selected = state.filteredResults[action.payload.index]
      const imageUrl = selected.getImageUrl ? selected.getImageUrl(selected) : ''
      state.emitChange.current(mapBack(selected))

      return {
        ...state,
        showResults: false,
        userInput: selected.typeaheadSearchString,
        activeIndex: action.payload.index,
        activeItem: selected,
        imageUrl
      }
    }
    case 'ENTER_KEY': {
      // Also TAB KEY
      if (!state.activeItem) return state

      const {activeItem} = state
      const imageUrl = activeItem.getImageUrl ? activeItem.getImageUrl(activeItem) : ''

      state.emitChange.current(mapBack(activeItem))

      return {
        ...state,
        showResults: false,
        userInput: activeItem.typeaheadSearchString,
        activeIndex: undefined,
        activeItem: undefined,
        imageUrl
      }
    }
    case 'DOWN_KEY':
      const nextIndex = getNextIndex(state.activeIndex || 0, state.filteredResults.length)
      const nextItem = state.filteredResults[nextIndex]
      return {
        ...state,
        showResults: true, // Down key opens the results
        activeIndex: nextIndex,
        activeItem: nextItem
      }
    case 'UP_KEY':
      const prevIndex = getPrevIndex(state.activeIndex || 0)
      const prevItem = state.filteredResults[prevIndex]
      return {
        ...state,
        activeIndex: prevIndex,
        activeItem: prevItem
      }
    case 'ON_BLUR_ESC': {
      return {
        ...state,
        showResults: false,
        activeIndex: undefined,
        activeItem: undefined
      }
    }
    case 'UPDATE_ITEMS': {
      const results = action.payload
      const [selected] = results.filter((res) => res.typeaheadInputValue === state.userInput)
      const imageUrl = selected && selected.getImageUrl ? selected.getImageUrl(selected) : ''

      return {
        ...state,
        results,
        showResults: false,
        imageUrl
        // ? TODO: find/keep match if active item
        // filteredResults: action.payload,
        // activeIndex: undefined,
        // activeItem: undefined,
      }
    }
    default:
      return state
  }
}

type WithEmit<T> = {
  emitChange: React.MutableRefObject<(item: T | string) => void>
}

type WithTypeaheadIdAndSearchString<T = {}> = T & {
  typeaheadInputValue: string
  typeaheadSearchString: string
  customItemDisplay?: (item: T, query: string) => string | React.ReactNode
  getImageUrl?: (item: T) => string
}

export type TypeaheadState<T> = WithEmit<T> & {
  userInput: string
  showResults: boolean
  activeIndex?: number
  activeItem?: WithTypeaheadIdAndSearchString<T>
  results: WithTypeaheadIdAndSearchString<T>[]
  filteredResults: WithTypeaheadIdAndSearchString<T>[]
  allowFreeSelection?: boolean
  imageUrl?: string
}

type MapTo<T> = Pick<
  TypeaheadV2Props<T>,
  'items' | 'getItemInputValue' | 'getSearchItemString' | 'customItemDisplay' | 'getImageUrl'
>

const mapToResults = <T>({
  items,
  getItemInputValue,
  getSearchItemString,
  customItemDisplay,
  getImageUrl
}: MapTo<T>): WithTypeaheadIdAndSearchString<T>[] =>
  items.map((item) => ({
    ...item,
    typeaheadInputValue: getItemInputValue(item),
    typeaheadSearchString: getSearchItemString(item),
    customItemDisplay,
    getImageUrl
  }))

export type TypeaheadV2Props<T> = {
  items: T[]
  inputValue?: string
  onChange: (item: T | string) => void // select cb
  getItemInputValue: (item: T) => string
  getSearchItemString: (item: T) => string
  customItemDisplay?: (item: T, query: string) => string | React.ReactNode

  // TODO: handle image
  getImageUrl?: (item: T) => string
  defaultImage?: React.ReactNode

  allowFreeSelection?: boolean

  initialState?: TypeaheadState<T> // maybe not needed
}

export const useTypeahead = <T>({
  items,
  inputValue,
  onChange,
  initialState,
  getItemInputValue,
  getSearchItemString,
  customItemDisplay,
  getImageUrl,
  ...props
}: TypeaheadV2Props<T>) => {
  const cbRef = useRef(onChange)

  useEffect(() => {
    cbRef.current = onChange
  }, [onChange])

  // Create Typed Reducer
  const typeaheadReducer = CreateTypeaheadReducer<T>()
  const [
    // STATE
    state,
    // DISPATCH
    localDispatch
  ] = useReducer(
    typeaheadReducer,
    {
      emitChange: cbRef,
      userInput: inputValue || '',
      activeIndex: 0,
      showResults: true,
      filteredResults: [],
      results: [],
      allowFreeSelection: props.allowFreeSelection,
      ...initialState
    },
    // INITIALIZE FUNCTION
    init
  )

  const eventActions = {
    onInputEnter: () => localDispatch({type: 'ENTER_KEY'}),
    onInputDownKey: () => localDispatch({type: 'DOWN_KEY'}),
    onInputUpKey: () => localDispatch({type: 'UP_KEY'}),
    onInputBlurEsc: () => localDispatch({type: 'ON_BLUR_ESC'}),
    onInputChange: (value: string) => localDispatch({type: 'INPUT_UPDATE', payload: value}),
    onItemSelect: (index: number) => {
      localDispatch({
        type: 'SELECT_ITEM',
        payload: {index}
      })
    },
    refreshItems: (newItems: T[]) => {
      const payload = mapToResults({
        items: newItems,
        getItemInputValue,
        getSearchItemString,
        customItemDisplay,
        getImageUrl
      })
      localDispatch({type: 'UPDATE_ITEMS', payload})
    }
  } as const

  return [state, eventActions] as [TypeaheadState<T>, typeof eventActions]
}
