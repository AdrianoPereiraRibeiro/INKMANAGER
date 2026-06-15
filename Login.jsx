import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import api from '../services/api'; // Conexão pronta com o C# (Porta 7053)

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth(); // Função global para definir o perfil logado no contexto
  const navigate = useNavigate(); // Direcionador de páginas

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Client'); // Padrão inicial: Cliente
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        email: email.trim(),
        password: password,
        role: role
      };

      const response = await api.post('/Auth/login', payload);
      
      // Captura o token e as propriedades retornadas pela API corrigida em camelCase ou PascalCase
      const token = response.data.token || response.data.Token;
      const userId = response.data.userId || response.data.UserId;
      
      // SOLUÇÃO DE TOLERÂNCIA: Captura o clientId se o C# o retornar explicitamente no login
      const clientId = response.data.clientId || response.data.ClientId || response.data.client?.id;
      
      // AJUSTE CRÍTICO: Captura a Role REAL retornada pelo C# (vinda do banco)
      const backendRole = response.data.role || response.data.Role; 
      
      if (!token) {
        throw new Error("A API autenticou, mas não retornou um Token JWT válido.");
      }

      // Salva os dados de autenticação nas variáveis de persistência local
      localStorage.setItem('@InkManager:token', token);
      
      if (userId) {
        localStorage.setItem('userId', String(userId));
      }
      
      // Se a API trouxe o ID do cliente separado, salva-o. Caso contrário, mantém o userId como fallback
      if (clientId) {
        localStorage.setItem('clientId', String(clientId));
      } else if (userId) {
        localStorage.setItem('clientId', String(userId));
      }

      // Configura o token nas requisições do Axios imediatamente para evitar problemas de autenticação
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 1. Define o papel REAL do usuário no estado global do React
      login(backendRole);

      // 2. Redireciona o usuário para o Dashboard correto baseado no retorno real da API
      if (backendRole === 'Artist') {
        navigate('/artist/dashboard');
      } else {
        navigate('/client/catalog');
      }

    } catch (error) {
      console.error('Erro detalhado da requisição:', error);
      
      if (error.response) {
        console.error('Dados de erro do C#:', JSON.stringify(error.response.data));
        console.error('Status retornado do C#:', error.response.status);
        
        if (error.response.status === 401) {
          alert('Credenciais incorretas ou usuário não cadastrado no banco do estúdio.');
        } else {
          alert(`Erro na API (${error.response.status}): ${JSON.stringify(error.response.data)}`);
        }
      } else if (error.request) {
        alert('Sem resposta do servidor C#. Verifique se a API está rodando na porta 7053.');
      } else {
        alert('Erro ao configurar requisição de login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      fontFamily: 'sans-serif', 
      backgroundColor: '#121212', 
      color: '#fff' 
    }}>
      <form onSubmit={handleSubmit} style={{ 
        padding: '40px', 
        background: '#1e1e1e', 
        borderRadius: '8px', 
        width: '320px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px',
        border: '1px solid #333',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
      }}>
        <h2 style={{ margin: 0, textAlign: 'center', color: '#fff', fontSize: '26px', fontWeight: 'bold' }}>
          {t('login.title', 'Entrar')}
        </h2>
        <p style={{ fontSize: '14px', color: '#aaa', textAlign: 'center', marginBottom: '10px' }}>
          {t('login.welcome', 'Seja bem-vindo ao InkManager')}
        </p>

        {/* Campo E-mail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '14px', color: '#ccc' }}>{t('login.email', 'E-mail')}</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            placeholder="email@email.com"
            style={{ 
              padding: '12px', 
              borderRadius: '4px', 
              border: '1px solid #333', 
              background: '#2a2a2a', 
              color: '#fff',
              outline: 'none'
            }} 
          />
        </div>

        {/* Campo Senha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '14px', color: '#ccc' }}>{t('login.password', 'Senha')}</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            placeholder="••••••••"
            style={{ 
              padding: '12px', 
              borderRadius: '4px', 
              border: '1px solid #333', 
              background: '#2a2a2a', 
              color: '#fff',
              outline: 'none'
            }} 
          />
        </div>

        {/* Tipo de Perfil */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '14px', color: '#ccc' }}>{t('login.profile_type', 'Tipo de Perfil')}</label>
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)} 
            style={{ 
              padding: '12px', 
              borderRadius: '4px', 
              border: '1px solid #333', 
              background: '#2a2a2a', 
              color: '#fff',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="Client">{t('login.role_client', 'Cliente')}</option>
            <option value="Artist">{t('login.role_artist', 'Tatuador')}</option>
          </select>
        </div>

        {/* Botão Entrar */}
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '14px', 
            borderRadius: '4px', 
            border: 'none', 
            background: loading ? '#5b21b6' : '#8b5cf6', 
            color: '#fff', 
            fontWeight: 'bold', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            marginTop: '15px',
            transition: 'background 0.2s',
          }}
        >
          <LogIn size={18} /> 
          {loading ? '...' : t('login.button_login', 'Entrar')}
        </button>

        {/* Redirecionamento para Registro */}
        <div style={{ textTransform: 'none', textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#aaa' }}>
          {t('login.no_account', 'Não tem uma conta?')}{' '}
          <span 
            onClick={() => navigate('/register')} 
            style={{ 
              color: '#8b5cf6', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              textDecoration: 'underline',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#a78bfa'}
            onMouseLeave={(e) => e.target.style.color = '#8b5cf6'}
          >
            {t('login.button_register', 'Cadastre-se')}
          </span>
        </div>

      </form>
    </div>
  );
}