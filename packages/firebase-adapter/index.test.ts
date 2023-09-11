/* eslint-disable no-console -- Needed for debugging purpose */

import type { DataSnapshot } from 'firebase/database';
import FirebaseAdapter from './index';

test('should return get data from firebase', async () => {
  const firebaseAdapter = new FirebaseAdapter({});
  const response = await firebaseAdapter.get('/item/1');
  expect(response).not.toBe(undefined);
});

test('should return data when snapshot exists', async () => {
  const dummyResponse = {
    exists: () => true,
    data: 'this is dummy data',
  } as unknown as DataSnapshot;

  const firebaseAdapter = new FirebaseAdapter({ onSuccess: (snapshot) => snapshot });
  jest.spyOn(firebaseAdapter, 'get').mockResolvedValue(dummyResponse);

  const response = (await firebaseAdapter.fetchData('/item/1')) as Record<string, string>;
  expect(response.data).toEqual('this is dummy data');
});

test('should return console.log data not available when snapshot not exists', async () => {
  const dummyResponse = {
    exists: () => false,
    data: 'this is dummy data',
  } as unknown as DataSnapshot;

  const firebaseAdapter = new FirebaseAdapter({});
  jest.spyOn(firebaseAdapter, 'get').mockResolvedValue(dummyResponse);
  jest.spyOn(console, 'debug');

  await firebaseAdapter.fetchData('/item/1');
  expect(console.debug).toHaveBeenCalledWith('No data available');
});

test('should call callback.error when error', async () => {
  const dummyResponse = { text: 'this is error' } as unknown as DataSnapshot;

  const firebaseAdapter = new FirebaseAdapter({ onError: (error) => error });
  jest.spyOn(firebaseAdapter, 'get').mockRejectedValue(dummyResponse);

  const response = (await firebaseAdapter.fetchData('/item/1')) as Record<string, string>;
  expect(response.text).toEqual('this is error');
});