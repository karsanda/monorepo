import { useEffect, useRef, useReducer, useMemo } from 'react';
import FirebaseAdapter from '@monorepo/firebase-adapter';

interface State<T> {
  state: 'idle' | 'loading' | 'fetched' | 'error';
  data?: T;
  error?: Error;
}

type Cache<T> = { [url: string]: T };

type Action<T> =
  | { type: 'loading' }
  | { type: 'fetched'; payload: T }
  | { type: 'error'; payload: Error };

function useFetch<T = unknown>(url: string): State<T> {
  const cache = useRef<Cache<T>>({});
  const cancelRequest = useRef<boolean>(false);

  const initialState: State<T> = {
    state: 'idle',
    data: undefined,
    error: undefined,
  };

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case 'loading':
        return { ...initialState, state: action.type };
      case 'fetched':
        return { ...initialState, state: action.type, data: action.payload };
      case 'error':
        return { ...initialState, state: action.type, error: action.payload };
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    if (!url) return;
    cancelRequest.current = false;

    const firebaseAdapter = new FirebaseAdapter({
      onSuccess: (snapshot) => {
        const data = snapshot.val();
        if (cancelRequest.current) return;
        cache.current[url] = data;
        dispatch({ type: 'fetched', payload: data });
      },
      onError: (error) => {
        if (cancelRequest.current) return;
        dispatch({ type: 'error', payload: error as Error });
      },
    });

    const fetchDataFromFirebase = () => {
      dispatch({ type: 'loading' });

      if (cache.current[url]) {
        dispatch({ type: 'fetched', payload: cache.current[url] });
        return;
      }

      firebaseAdapter.fetchData(url);
    };

    fetchDataFromFirebase();
    return () => {
      cancelRequest.current = true;
    };
  }, [url]);

  return state;
}

export default useFetch;
