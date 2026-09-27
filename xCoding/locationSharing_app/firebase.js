import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// =====================================================
// 🔥 Firebase 프로젝트 연결 정보
// Firebase Console에서 발급받은 현재 앱의 설정값입니다.
// =====================================================
const firebaseConfig = {
  apiKey: 'AIzaSyCQy77DDv9ngWeQznZo7e24do5cm_-SbFE',
  authDomain: 'dowajwo-location-app.firebaseapp.com',
  projectId: 'dowajwo-location-app',
  storageBucket: 'dowajwo-location-app.firebasestorage.app',
  messagingSenderId: '723606312229',
  appId: '1:723606312229:web:33c7be8cd92d077dc0b6cc',
};

// Firebase 앱과 Firestore 데이터베이스를 한 번 초기화합니다.
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// =====================================================
// 🔐 React Native 로그인 상태 유지
// AsyncStorage를 이용해 앱을 다시 열어도 로그인 상태를 복원합니다.
// Fast Refresh로 이미 초기화된 경우에는 기존 Auth를 사용합니다.
// =====================================================
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

export { auth };
