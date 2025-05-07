export const debounce = <T extends any[]>(fn: (...args: T) => void, delay: number) => {
  let timer: number

  return (...args: T) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
