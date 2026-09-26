import type { DataSnapshot } from 'firebase/database'
import { expect, test, vi } from 'vitest'
import FirebaseAdapter from './index'

// Hits the real Hacker News Firebase; opt in with HN_LIVE=1 so CI stays hermetic.
test.runIf(process.env.HN_LIVE)('should return get data from firebase', async () => {
  const firebaseAdapter = new FirebaseAdapter()
  const response = await firebaseAdapter.get('/item/1')
  expect(response.exists()).toBe(true)
})

test('should return data when snapshot exists', async () => {
  const dummyResponse = {
    exists: () => true,
    data: 'this is dummy data',
  } as unknown as DataSnapshot

  const firebaseAdapter = new FirebaseAdapter({ onSuccess: (snapshot) => snapshot })
  vi.spyOn(firebaseAdapter, 'get').mockResolvedValue(dummyResponse)

  const response = (await firebaseAdapter.fetchData('/item/1')) as Record<string, string>
  expect(response.data).toEqual('this is dummy data')
})

test('should console.debug data not available when snapshot not exists', async () => {
  const dummyResponse = {
    exists: () => false,
    data: 'this is dummy data',
  } as unknown as DataSnapshot

  const firebaseAdapter = new FirebaseAdapter()
  vi.spyOn(firebaseAdapter, 'get').mockResolvedValue(dummyResponse)
  const debug = vi.spyOn(console, 'debug').mockImplementation(() => {})

  await firebaseAdapter.fetchData('/item/1')
  expect(debug).toHaveBeenCalledWith('No data available')
})

test('should call callback.error when error', async () => {
  const dummyResponse = { text: 'this is error' }

  const firebaseAdapter = new FirebaseAdapter({ onError: (error) => error })
  vi.spyOn(firebaseAdapter, 'get').mockRejectedValue(dummyResponse)

  const response = (await firebaseAdapter.fetchData('/item/1')) as Record<string, string>
  expect(response.text).toEqual('this is error')
})
