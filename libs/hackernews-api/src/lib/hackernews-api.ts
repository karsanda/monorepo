import { initializeApp } from 'firebase/app'
import { getDatabase, ref, child, get, DataSnapshot } from "firebase/database"

const config = {
  databaseURL: 'https://hacker-news.firebaseio.com'
}

const app = initializeApp(config)
const database = getDatabase(app)
const api = ref(database, '/v0')

export const getDataFromFirebase = async (url: string, callback: {
  success?: (snapshot: DataSnapshot) => void,
  error?: (error: Error) => void
}) => {
  try {
    const snapshot = await get(child(api, url))
    if (snapshot.exists()) {
      callback.success && callback.success(snapshot)
    } else {
      console.log("No data available")
    }
  } catch(error) {
    callback.error && callback.error(error as Error)
  }
}
