import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Stories from './stories'

test('should be able to render successfully', () => {
  const { baseElement } = render(
    <MemoryRouter initialEntries={['/']}>
      <Stories type='topstories' />
    </MemoryRouter>
  )
  expect(baseElement).toBeTruthy()
})