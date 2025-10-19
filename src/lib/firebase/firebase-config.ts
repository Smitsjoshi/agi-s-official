import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCSKbAL2hZ_rqBa5wzWvXLBbhI3k5ajyAs",
  authDomain: "agi-s-final.firebaseapp.com",
  projectId: "agi-s-final",
  storageBucket: "agi-s-final.firebasestorage.app",
  messagingSenderId: "12010671731",
  appId: "1:12010671731:web:dfa6f50cb7abc42ab8a406",
  measurementId: "G-C0357L2ER5"
};

// Initialize Firebase
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
