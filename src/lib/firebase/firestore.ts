import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";
import "./firebase-config"; // This ensures Firebase is initialized

const db = getFirestore();

export const chatsCollection = collection(db, "chats");

export const addChatMessage = async (chatMessage: any) => {
  await addDoc(chatsCollection, chatMessage);
};

export const getAgent = async (id: string) => {
  const docRef = doc(db, "agents", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};
