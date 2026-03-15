import { render, act } from '@testing-library/react'
import { vi } from 'vitest'
import HeartBurst from '../components/HeartBurst'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

test('renders 5 heart elements', () => {
  const { container } = render(
    <HeartBurst id="abc" x={100} y={200} onDone={() => {}} />
  )
  expect(container.querySelectorAll('.heart-burst__heart')).toHaveLength(5)
})

test('calls onDone with id after 900ms', () => {
  const onDone = vi.fn()
  render(<HeartBurst id="abc" x={100} y={200} onDone={onDone} />)
  act(() => vi.advanceTimersByTime(900))
  expect(onDone).toHaveBeenCalledOnce()
  expect(onDone).toHaveBeenCalledWith('abc')
})

test('does not call onDone if unmounted before 900ms', () => {
  const onDone = vi.fn()
  const { unmount } = render(<HeartBurst id="abc" x={100} y={200} onDone={onDone} />)
  act(() => vi.advanceTimersByTime(500))
  unmount()
  act(() => vi.advanceTimersByTime(500))
  expect(onDone).not.toHaveBeenCalled()
})
