import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Credenciales reales de tu Firebase "AlimentadorDeGato"
const firebaseConfig = {
  apiKey: "L7wmHIGCYQomKC0dUt0R957GNFgsClrOzTqmhKeR", 
  authDomain: "alimentadordegato.firebaseapp.com",
  databaseURL: "https://alimentadordegato-default-rtdb.firebaseio.com", // <-- Revisa que diga esto tal cual
  projectId: "alimentadordegato",
  storageBucket: "alimentadordegato.appspot.com",
  messagingSenderId: "384752948752", 
  appId: "1:384752948752:web:a1b2c3d4e5f6g7h8i9j0k1"
};

// Inicializar la App
const app = initializeApp(firebaseConfig);

// Exportar la base de datos
export const db = getDatabase(app);