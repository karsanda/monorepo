import { reactive, toRefs } from 'vue'
import FirebaseAdapter from 'firebase-adapter'

interface State<T> {
  state: 'idle' | 'loading' | 'fetched' | 'error';
  data?: T;
  error?: Error;
}

async function useFetch<T = unknown>(url: string) {
  const payload = reactive<State<T>>({
    state: 'idle',
    data: undefined,
    error: undefined,
  })

  const firebaseAdapter = new FirebaseAdapter({
    onSuccess: (snapshot) => {
      const data = snapshot.val();
      payload.state = 'fetched'
      payload.data = data
    },
    onError: (error) => {
      payload.state = 'error'
      payload.error = error as Error
    },
  })

  await firebaseAdapter.fetchData(url);

  return { ...toRefs(payload) }
}

export default useFetch