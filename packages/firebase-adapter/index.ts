/* eslint-disable import/no-default-export -- Preferred named export to export this class */
/* eslint-disable no-console -- Needed for debugging purpose */

import { initializeApp } from 'firebase/app';
import type { DatabaseReference, DataSnapshot } from 'firebase/database';
import { getDatabase, ref, child, get } from 'firebase/database';

const HACKERNEWS_FIREBASE_URL = 'https://hacker-news.firebaseio.com';

type OnSuccessCallback = (snapshot: DataSnapshot) => unknown;

type OnErrorCallback = (error: Error) => unknown;

interface FirebaseConstructor {
  onSuccess?: OnSuccessCallback;
  onError?: OnErrorCallback;
}

export default class FirebaseAdapter {
  private api: DatabaseReference;

  private onSuccess: OnSuccessCallback | undefined;

  private onError: OnErrorCallback | undefined;

  constructor({ onSuccess, onError }: FirebaseConstructor) {
    const app = initializeApp({ databaseURL: HACKERNEWS_FIREBASE_URL });
    const database = getDatabase(app);

    this.api = ref(database, '/v0');
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  get(url: string): Promise<DataSnapshot> {
    return get(child(this.api, url));
  }

  async fetchData(url: string): Promise<unknown> {
    try {
      const snapshot = await this.get(url);
      if (snapshot.exists() && this.onSuccess) {
        return this.onSuccess(snapshot);
      } 
        console.debug('No data available');
      
    } catch (error) {
      if (this.onError) {
        return this.onError(error as Error);
      }
    }
  }
}