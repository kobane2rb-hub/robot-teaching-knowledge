// ============================================================
// Firebase 初期化設定
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase アプリ初期化
export const firebaseApp = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(firebaseApp);

// Firestore
export const db = getFirestore(firebaseApp);

// 開発環境でのエミュレータ接続（オプション）
// if (process.env.NODE_ENV === "development" && !process.env.EXPO_PUBLIC_USE_EMULATOR) {
//   try {
//     connectAuthEmulator(auth, "http://localhost:9099");
//     connectFirestoreEmulator(db, "localhost", 8080);
//   } catch (e) {
//     // エミュレータが既に接続されている場合
//   }
// }
