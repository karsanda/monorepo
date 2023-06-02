import FirebaseAdapter from '@monorepo/firebase-adapter';
import { renderHook, waitFor } from '@testing-library/react';
import { DataSnapshot } from 'firebase/database';
import useFetch from './useFetch';

test('should return loading state when fetch is in progress', () => {
  const { result } = renderHook(() => useFetch('/item/1'));
  expect(result.current).toEqual({
    state: 'loading',
    data: undefined,
    error: undefined,
  });
});

test('should return fetched state when fetch is success', async () => {
  jest.spyOn(FirebaseAdapter.prototype, 'get').mockResolvedValue({
    exists: () => true,
    val: () => 'this is dummy data',
  } as unknown as DataSnapshot);

  const { result } = renderHook(() => useFetch('/item/1'));

  waitFor(() => {
    expect(result.current).toEqual({
      state: 'fetched',
      data: 'this is dummy data',
      error: undefined,
    });
  })
});

test('should return error state when fetch is error', async () => {
  const errorData = { text: 'this is error data' };
  jest.spyOn(FirebaseAdapter.prototype, 'get').mockRejectedValue(errorData);
  const { result } = renderHook(() => useFetch('/item/1'));

  waitFor(() => {
    expect(result.current).toEqual({
      state: 'error',
      data: undefined,
      error: errorData,
    });
  })
});
