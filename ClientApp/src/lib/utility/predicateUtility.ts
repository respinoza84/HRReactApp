import {SortDirection} from '../type/shared'

const isNullOrEmpty = <T>(things?: T[]) => !things || (things && things.length <= 0)

const hasIntersect = <T>(left?: T[], right?: T[]) =>
  left && left.some((lValue) => right && right.some((rValue) => lValue === rValue))

const hasIntersectOrLeftEmpty = <T>(left: T[] | undefined, right: T[]) =>
  isNullOrEmpty(left) || hasIntersect(left || [], right || [])

const unique = <T>(value: T, index: number, self: T[]) => self.indexOf(value) === index

const ascending = <T>(valueSelector: (thing: T) => any) => (a: T, b: T) =>
  ((x: any, y: any) => +(x > y) - +(x < y))(valueSelector(a), valueSelector(b))

const descending = <T>(valueSelector: (thing: T) => any) => (a: T, b: T) =>
  ((x: any, y: any) => +(x < y) - +(x > y))(valueSelector(a), valueSelector(b))

const sortBy = (dir?: SortDirection) => {
  switch (dir) {
    case 'Descending':
      return descending
    case 'Ascending':
    case '':
    default:
      return ascending
  }
}

const take = (num: number) => <T>(_: T, index: number) => index < num

const skip = (num: number) => <T>(_: T, index: number) => index > num

export {isNullOrEmpty, hasIntersect, hasIntersectOrLeftEmpty, unique, ascending, descending, take, skip, sortBy}
