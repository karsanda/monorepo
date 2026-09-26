import FirebaseAdapter from '@repo/firebase-adapter'

/** Fetches a Hacker News path via Firebase; resolves `undefined` when missing or on error. */
export default async function getData<T>(url: string): Promise<T | undefined> {
  const firebaseAdapter = new FirebaseAdapter({
    onSuccess: (snapshot) => snapshot.val() as T,
    onError: (error) => console.error(error),
  })

  return (await firebaseAdapter.fetchData(url)) as T | undefined
}
