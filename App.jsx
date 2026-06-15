import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importa a configuração de internacionalização para o app inteiro
import './i18n'; 

// Importa o hook customizado de atalhos de teclado (Acessibilidade - Critério 1)
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

// Importa as telas públicas e do cliente totalmente prontas e integradas à API C#
import Login from './pages/Login';
import Register from './pages/Register'; 
import Catalog from './pages/client/Catalog';
import AppointmentForm from './pages/client/AppointmentForm';
import MyAppointments from './pages/client/MyAppointments';
import ClientProfile from './pages/client/Profile'; 

// Importa as telas do tatuador totalmente prontas e integradas à API C#
import ArtistDashboard from './pages/artist/Dashboard';
import ArtistProfile from './pages/artist/ArtistProfile'; // Mantido apenas o Perfil e o Dashboard integrado

// Guarda de Rotas para proteger o sistema contra acessos indevidos (Segurança do app)
function ProtectedRoute({ children, allowedRole }) {
  const { userRole } = useAuth();

  // Se o usuário não tiver uma Role activa no contexto, força o redirecionamento ao Login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota exigir uma regra de acesso e o usuário não possuir, devolve-o para sua home respectiva
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={userRole === 'Artist' ? '/artist/dashboard' : '/client/catalog'} replace />;
  }

  return children;
}

// COMPONENTE AUXILIAR: Criado especificamente para rodar com segurança DENTRO do BrowserRouter
function AppContent() {
  const { userRole } = useAuth();

  // O hook roda com o contexto do Router perfeitamente carregado na memória para escutar os atalhos globais
  useKeyboardShortcuts();

  return (
    <Routes>
      {/* Rotas Públicas - Intercepta se o usuário já estiver logado no sistema */}
      <Route path="/login" element={!userRole ? <Login /> : <Navigate to={userRole === 'Artist' ? '/artist/dashboard' : '/client/catalog'} replace />} />
      <Route path="/register" element={!userRole ? <Register /> : <Navigate to={userRole === 'Artist' ? '/artist/dashboard' : '/client/catalog'} replace />} />

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
      <Route path="/client/profile" element={
        <ProtectedRoute allowedRole="Client">
          <ClientProfile />
        </ProtectedRoute>
      } />

      {/* Rotas Privadas do TATUADOR */}
      <Route path="/artist/dashboard" element={
        <ProtectedRoute allowedRole="Artist">
          <ArtistDashboard />
        </ProtectedRoute>
      } />
      <Route path="/artist/profile" element={
        <ProtectedRoute allowedRole="Artist">
          <ArtistProfile />
        </ProtectedRoute>
      } />

      {/* Rota de Fallback para links quebrados ou não mapeados */}
      <Route path="/" element={<Navigate to="/login" replace />} />
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