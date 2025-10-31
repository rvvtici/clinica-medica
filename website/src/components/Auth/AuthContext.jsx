import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { auth, database } from '../Firebase/firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega dados do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    
    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType);
    }
  }, []);

  // Monitora mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Busca o tipo de usuário no Realtime Database
        try {
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const tipo = userData.tipo; // 'atendente' ou 'medico'
            
            const userInfo = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            };
            
            setUser(userInfo);
            setUserType(tipo);
            
            // Salva no localStorage
            localStorage.setItem('user', JSON.stringify(userInfo));
            localStorage.setItem('userType', tipo);
          } else {
            console.error('Dados do usuário não encontrados no database');
            await signOut(auth);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      } else {
        setUser(null);
        setUserType(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth, database]);

  const login = async (email, password, tipo) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Verifica no database se o tipo corresponde
      const userRef = ref(database, `users/${firebaseUser.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        if (userData.tipo !== tipo) {
          await signOut(auth);
          throw new Error(`Este usuário não é um ${tipo}. Verifique o tipo selecionado.`);
        }
        
        return { success: true };
      } else {
        await signOut(auth);
        throw new Error('Usuário não cadastrado no sistema');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserType(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  const value = {
    user,
    userType,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};