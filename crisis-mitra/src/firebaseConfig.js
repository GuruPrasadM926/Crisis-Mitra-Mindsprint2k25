import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database'

// Firebase Configuration
// Replace with your Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyDemoKeyChangeThis",
    authDomain: "seva-hub-demo.firebaseapp.com",
    projectId: "seva-hub-demo",
    storageBucket: "seva-hub-demo.appspot.com",
    messagingSenderId: "123456789",
    databaseURL: "https://seva-hub-demo-default-rtdb.firebaseio.com",
    appId: "1:123456789:web:abcdef123456"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Get reference to the database
export const database = getDatabase(app)
export const dbRef = ref
export const dbGet = get
export const dbQuery = query
export const dbOrderByChild = orderByChild
export const dbEqualTo = equalTo
export const dbPush = push
export const dbSet = set

export default app
