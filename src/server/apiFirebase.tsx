import { initializeApp } from 'firebase/app'
import * as firebaseAuth from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from 'firebase/firestore'
import { initializeAuth } from 'firebase/auth'

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC-mRMPU4Mkm3KM47g2Oec3JF1bUtrlYwY',
  authDomain: 'vaidarcerto-ca4a0.firebaseapp.com',
  projectId: 'vaidarcerto-ca4a0',
  storageBucket: 'vaidarcerto-ca4a0.appspot.com',
  messagingSenderId: '869061276507',
  appId: '1:869061276507:web:5398398fe79b9dd8bca07e',
  measurementId: 'G-B45Y1TNCEH',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence

// initialize auth
export const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
})
