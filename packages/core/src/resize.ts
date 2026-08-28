export function observeContainer(
  container: HTMLElement,
  resize: (width: number, height: number) => void,
): () => void {
  const measure = () => {
    const rect = container.getBoundingClientRect()
    resize(Math.max(1, rect.width || container.clientWidth), Math.max(1, rect.height || container.clientHeight))
  }
  measure()

  if (typeof ResizeObserver === 'undefined') {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }

  const observer = new ResizeObserver(measure)
  observer.observe(container)
  return () => observer.disconnect()
}
