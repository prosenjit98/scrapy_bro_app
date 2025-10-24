import { create } from 'zustand'

type LoaderState = {
  loader: boolean
  show: () => void
  hide: () => void
}
const useLoaderState = create<LoaderState>((set) => ({
  loader: false,
  show: () => set({ loader: true }),
  hide: () => set({ loader: false })
}))

export default useLoaderState
