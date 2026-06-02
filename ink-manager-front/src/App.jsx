import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importa a configuração de internacionalização para o app inteiro
import './i18n'; 

// Importa o hook customizado de atalhos de teclado (Acessibilidade - Critério 1)
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

// Importa as telas públicas e do cliente totalmente prontas
import Login from './pages/Login';
import Catalog from './pages/client/Catalog';
import AppointmentForm from './pages/client/AppointmentForm';
import MyAppointments from './pages/client/MyAppointments';

// Importa as telas do tatuador totalmente prontas
import ArtistDashboard from './pages/artist/Dashboard';
import ArtistSchedule from './pages/artist/Schedule';

// Guarda de Rotas para proteger o sistema contra acessos indevidos (Segurança do app)
function ProtectedRoute({ children, allowedRole }) {
  const { userRole } = useAuth();

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={userRole === 'Artist' ? '/artist/dashboard' : '/client/catalog'} replace />;
  }

  return children;
}

// COMPONENTE AUXILIAR: Criado especificamente para rodar com segurança DENTRO do BrowserRouter
function AppContent() {
  const { userRole } = useAuth();

  // Agora sim! O hook roda com o contexto do Router perfeitamente carregado na memória
  useKeyboardShortcuts();

  return (
    <Routes>
      {/* Rota Pública */}
      <Route path="/login" element={!userRole ? <Login /> : <Navigate to={userRole === 'Artist' ? '/artist/dashboard' : '/client/catalog'} replace />} />

      {/* Rotas Privadas do CLIENTE */}
      <Route path="/client/catalog" element={
        <ProtectedRoute allowedRole="Client">
          <Catalog />
        </ProtectedRoute>
      } />
      <Route path="/client/schedule/:artistId" element={
        <ProtectedRoute allowedRole="Client">
          <AppointmentForm />
        </ProtectedRoute>
      } />
      <Route path="/client/appointments" element={
        <ProtectedRoute allowedRole="Client">
          <MyAppointments />
        </ProtectedRoute>
      } />

      {/* Rotas Privadas do TATUADOR */}
      <Route path="/artist/dashboard" element={
        <ProtectedRoute allowedRole="Artist">
          <ArtistDashboard />
        </ProtectedRoute>
      } />
      <Route path="/artist/schedule" element={
        <ProtectedRoute allowedRole="Artist">
          <ArtistSchedule />
        </ProtectedRoute>
      } />

      {/* Rota de Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// RENDERIZAÇÃO PRINCIPAL: Mantém os wrappers de escopo globais ordenados de forma correta
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}