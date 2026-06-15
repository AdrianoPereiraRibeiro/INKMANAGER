import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // Inicializa os estados lendo direto do LocalStorage para evitar renderizações em cascata
  const [userRole, setUserRole] = useState(() => localStorage.getItem('@InkManager:role'));
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

  // CORREÇÃO 1: Ajustado para receber também o ID do usuário e atualizar ambos os estados reativos na hora
  const login = (role, id) => {
    localStorage.setItem('@InkManager:role', role);
    setUserRole(role);

    if (id) {
      localStorage.setItem('userId', String(id));
      setUserId(String(id));
    }
  };

  // Função de Logout
  const logout = () => {
    localStorage.clear();
    setUserRole(null);
    setUserId(null);
  };

  // Função de Registro Centralizada (Chama o C# e já autentica direto se a API mandar o token)
  const registerUser = async (userData) => {
    try {
      const response = await api.post('/Auth/register', userData);
      
      // Captura os dados retornados do nosso controller C#
      const token = response.data.token;
      const rId = response.data.userId;
      const rRole = response.data.role;

      if (token) {
        // Se a API já devolveu o token no cadastro, salva direto e evita fazer um segundo POST em /login
        localStorage.setItem('@InkManager:token', token);
        
        // CORREÇÃO 2: Passa tanto a role quanto o ID do usuário para a função login atualizar os estados reativos
        login(rRole, rId);
        
        return { success: true, role: rRole, userId: rId };
      }
      
      return { success: true, autoLogin: false };
    } catch (error) {
      console.error("Erro no processo de registro:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ userRole, userId, login, logout, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}