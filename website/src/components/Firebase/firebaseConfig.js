import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Substitua com suas configurações do Firebase
const firebaseConfig = {

  apiKey: "AIzaSyB-X4Co2bQ5lkOkxECWWdsR0U9i5oyHQWo",

  authDomain: "clinica-medica-5d56d.firebaseapp.com",

  databaseURL: "https://clinica-medica-5d56d-default-rtdb.firebaseio.com",

  projectId: "clinica-medica-5d56d",

  storageBucket: "clinica-medica-5d56d.firebasestorage.app",

  messagingSenderId: "443677686461",

  appId: "1:443677686461:web:3208ffd55f943626a6d5d4",

  measurementId: "G-GFHQJ3C4JG"

};


// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta as instâncias
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;