import { initializeApp } from "firebase/app"
import { getDatabase, ref, child, get, DatabaseReference, DataSnapshot } from "firebase/database"

const HACKERNEWS_FIREBASE_URL = 'https://hacker-news.firebaseio.com'

type OnSuccessCallback = (snapshot: DataSnapshot) => unknown

type OnErrorCallback = (error: Error) => unknown

type FirebaseConstructor = {
  onSuccess?: OnSuccessCallback
  onError?: OnErrorCallback
}

export default class FirebaseAdapter {
  private api: DatabaseReference

  private onSuccess: OnSuccessCallback | undefined

  private onError: OnErrorCallback | undefined

  constructor({ onSuccess, onError }: FirebaseConstructor) {
    const app = initializeApp({ databaseURL: HACKERNEWS_FIREBASE_URL })
    const database = getDatabase(app)

    this.api = ref(database, '/v0')
    this.onSuccess = onSuccess
    this.onError = onError
  }

  get(url: string) {
    return get(child(this.api, url))
  }

  async fetchData(url: string) {
    try {
      const snapshot = await this.get(url)
      if (snapshot.exists() && this.onSuccess) {
        return this.onSuccess(snapshot)
      } else {
        console.log('No data available')
      }
    } catch (error) {
      if (this.onError) {
        return this.onError(error as Error)
      }
    }
  }
}