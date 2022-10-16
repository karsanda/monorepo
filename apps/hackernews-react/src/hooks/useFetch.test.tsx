import FirebaseAdapter from '@monorepo/firebase-adapter';
import { renderHook } from '@testing-library/react-hooks';
import { DataSnapshot } from 'firebase/database';
import useFetch from './useFetch';

test('should return idle state when fetch is called', () => {
  const { result } = renderHook(() => useFetch('/item/1'));
  expect(result.all[0]).toEqual({
    state: 'idle',
    data: undefined,
    error: undefined,
  });
});

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

  const { result, waitForNextUpdate } = renderHook(() => useFetch('/item/1'));

  await waitForNextUpdate();

  expect(result.current).toEqual({
    state: 'fetched',
    data: 'this is dummy data',
    error: undefined,
  });
});

test('should return error state when fetch is error', async () => {
  const errorData = { text: 'this is error data' };
  jest.spyOn(FirebaseAdapter.prototype, 'get').mockRejectedValue(errorData);
  const { result, waitForNextUpdate } = renderHook(() => useFetch('/item/1'));

  await waitForNextUpdate();

  expect(result.current).toEqual({
    state: 'error',
    data: undefined,
    error: errorData,
  });
});
