import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Comments from './comments'

test('should be able to render successfully', () => {
  const { baseElement } = render(
    <MemoryRouter initialEntries={['/comments/777']}>
      <Comments />
    </MemoryRouter>
  )

  expect(baseElement).toBeTruthy()
})