import { initializeApp, getApps, getApp } from 'firebase/app'
import type { DatabaseReference, DataSnapshot } from 'firebase/database'
import { getDatabase, ref, child, get } from 'firebase/database'

const HACKERNEWS_FIREBASE_URL = 'https://hacker-news.firebaseio.com'

type OnSuccessCallback = (snapshot: DataSnapshot) => unknown

type OnErrorCallback = (error: Error) => unknown

interface FirebaseConstructor {
  onSuccess?: OnSuccessCallback
  onError?: OnErrorCallback
}

// Reuse the default app so creating many adapters doesn't re-initialize Firebase.
const firebaseApp = () =>
  getApps().length ? getApp() : initializeApp({ databaseURL: HACKERNEWS_FIREBASE_URL })

export default class FirebaseAdapter {
  private api: DatabaseReference

  private onSuccess: OnSuccessCallback | undefined

  private onError: OnErrorCallback | undefined

  constructor({ onSuccess, onError }: FirebaseConstructor = {}) {
    this.api = ref(getDatabase(firebaseApp()), '/v0')
    this.onSuccess = onSuccess
    this.onError = onError
  }

  get(url: string): Promise<DataSnapshot> {
    return get(child(this.api, url))
  }

  async fetchData(url: string): Promise<unknown> {
    try {
      const snapshot = await this.get(url)
      if (snapshot.exists() && this.onSuccess) {
        return this.onSuccess(snapshot)
      }
      console.debug('No data available')
    } catch (error) {
      if (this.onError) {
        return this.onError(error as Error)
      }
    }
    return undefined
  }
}
