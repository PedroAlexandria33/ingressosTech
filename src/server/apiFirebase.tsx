import { initializeApp } from 'firebase/app'
import * as firebaseAuth from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from 'firebase/firestore'
import { initializeAuth } from 'firebase/auth'

// Configuração do Firebase
const firebaseConfig = {
  apiKey: ,
  authDomain: ,
  projectId: ,
  storageBucket: ,
  messagingSenderId: ,
  appId: ,
  measurementId: ,
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence

// initialize auth
export const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
})
