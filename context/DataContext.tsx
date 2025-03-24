import { createContext, useState, useEffect, useContext } from "react";
import { Chat, Message } from "../interfaces/interfaces";
import { db } from "../Utils/Firebase";
import { addDoc, collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { AuthContext } from "./AuthContext";

interface DataContextProps {
  chats: Chat[];
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
  createChat: (text: string, messages: Message[]) => Promise<string | undefined>;
  updateChat: (id: string, messages: Message[]) => Promise<void>;
  getChats: () => Promise<void>;
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: any) => {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  // Cuando inicia sesión, se cargan los chats del usuario actual y se crea un chat nuevo en blanco.
  useEffect(() => {
    if (user) {
      getChats();
      // Crea un nuevo chat en blanco para iniciar la conversación actual,
      // pero sin borrar los chats anteriores del usuario.
      createChat("Chat sin título", []);
    }
  }, [user]);

  const createChat = async (text: string, messages: Message[]) => {
    try {
      const textSplit = text.split(" ");
      const tempId = Date.now().toString();
      const title = textSplit.slice(0, 5).join(" ");

      const newChat: Chat = {
        id: tempId,
        title,
        create_at: new Date(),
        messages,
        userId: user?.uid || ""
      };

      // Se añade el chat localmente
      setChats((prev) => [newChat, ...prev]);
      setSelectedChat(newChat);

      // Se guarda en Firebase
      const docRef = await addDoc(collection(db, "chats"), {
        title,
        create_at: new Date(),
        messages,
        userId: user?.uid
      });

      // Actualizamos el chat con el ID real
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === tempId ? { ...chat, id: docRef.id } : chat
        )
      );
      setSelectedChat((prev) =>
        prev?.id === tempId ? { ...prev, id: docRef.id } : prev
      );

      return docRef.id;
    } catch (error) {
      console.error("Error en createChat:", error);
    }
  };

  const updateChat = async (id: string, messages: Message[]) => {
    if (!user) return;
    try {
      const chatRef = doc(db, "chats", id);
      let updatedFields: any = { messages };

      // Si el chat tiene el título "Chat sin título" y hay al menos un mensaje,
      // se actualiza el título con las primeras 5 palabras del primer mensaje.
      if (messages.length > 0 && messages[0].text) {
        updatedFields.title = messages[0].text.split(" ").slice(0, 5).join(" ");
      }

      await updateDoc(chatRef, updatedFields);

      setChats((prev) =>
        prev.map((chat) => (chat.id === id ? { ...chat, ...updatedFields } : chat))
      );
    } catch (error) {
      console.log("Error al actualizar chat:", error);
    }
  };

  const getChats = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "chats"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const newChats: Chat[] = querySnapshot.docs.map((docu) => ({
        id: docu.id,
        create_at: docu.data().create_at.toDate(),
        messages: docu.data().messages,
        title: docu.data().title,
        userId: docu.data().userId,
      }));
      setChats(newChats);
    } catch (error) {
      console.log("Error al obtener chats:", error);
    }
  };

  return (
    <DataContext.Provider
      value={{ chats, selectedChat, setSelectedChat, createChat, updateChat, getChats }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
