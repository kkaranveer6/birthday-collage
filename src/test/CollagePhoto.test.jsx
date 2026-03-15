import { render, screen, fireEvent } from '@testing-library/react'
import CollagePhoto from '../components/CollagePhoto'

describe('CollagePhoto', () => {
  const defaultProps = {
    filename: '01.jpg',
    style: { left: '100px', top: '200px', transform: 'rotate(5deg)' },
    onClick: vi.fn(),
  }

  it('renders an img with the correct src', () => {
    render(<CollagePhoto {...defaultProps} />)
    const img = screen.getByRole('img')
    expect(img.getAttribute('src')).toContain('/images/edited/')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<CollagePhoto {...defaultProps} onClick={onClick} />)
    fireEvent.click(screen.getByRole('img').closest('.collage-photo'))
    expect(onClick).toHaveBeenCalledWith('01.jpg')
  })

  test('calls onBurst with click event when photo is clicked', () => {
    const onBurst = vi.fn()
    render(
      <CollagePhoto
        filename="01.jpg"
        style={{}}
        onClick={() => {}}
        onBurst={onBurst}
      />
    )
    fireEvent.click(screen.getByRole('img').closest('.collage-photo'))
    expect(onBurst).toHaveBeenCalledOnce()
  })
})
