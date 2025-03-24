import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importamos Firestore

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtYl3atSd-CYTkUNcsvIrLHjPMZe9aVTY",
  authDomain: "chatgpt2025-28ab2.firebaseapp.com",
  projectId: "chatgpt2025-28ab2",
  storageBucket: "chatgpt2025-28ab2.appspot.com",
  messagingSenderId: "469700705883",
  appId: "1:469700705883:web:4ec6e276b34b055b8c897e",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
const auth = getAuth(app);
const db = getFirestore(app); // Inicializamos Firestore

// Exportar auth y db para usarlos en toda la app
export { app, auth, db };
//       await updateDoc(doc(db, "chats", id), { messages });
//         getChats(); // Refrescar lista de chats