import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Users from './users'

test('should be able to render successfully', () => {
  const { baseElement } = render(
    <MemoryRouter initialEntries={['/topstories']}>
      <Users />
    </MemoryRouter>
  )

  expect(baseElement).toBeTruthy()
})