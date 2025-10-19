import { getFirestore, collection, addDoc } from "firebase/firestore";
import "./firebase-config"; // This ensures Firebase is initialized

const db = getFirestore();

export const chatsCollection = collection(db, "chats");

export const addChatMessage = async (chatMessage: any) => {
  await addDoc(chatsCollection, chatMessage);
};
