export type RenderProps<T> = {
  children: (renderProps: T) => React.ReactElement
}
