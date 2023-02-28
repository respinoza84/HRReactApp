export type BaseProps = {
  id?: string
  dataTestId?: string
}

export type ImgProps = BaseProps & {
  alt: string
}

export type WithOnClick<T> = T & {
  onClick?: () => void
}
