import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import api from '../services/api'; // Conexão pronta com o C#

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth(); // Função global para definir o perfil logado
  const navigate = useNavigate(); // Direcionador de páginas

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Client'); // Padrão inicial: Cliente
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      /* ======================================================================
        INTEGRAÇÃO COM O BACK-END (C#):
        Quando o seu dupla criar o endpoint de login, basta tirar as barras '//'
        das linhas abaixo para testar a requisição real no SQL Server:
        
        const response = await api.post('/auth/login', { email, password, role });
        const { token } = response.data;
        localStorage.setItem('@InkManager:token', token);
        ======================================================================
      */

      // Simulação de delay de rede para ficar profissional com o loading
      await new Promise(resolve => setTimeout(resolve, 800));

      // 1. Define o papel do usuário no estado global do React
      login(role);

      // 2. Redireciona o usuário para o Dashboard correto com base na escolha
      if (role === 'Artist') {
        navigate('/artist/dashboard');
      } else {
        navigate('/client/catalog');
      }

    } catch (error) {
      console.error(error);
      alert('Erro ao efetuar login. Verifique suas credenciais.');
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
          {t('title')}
        </h2>
        <p style={{ fontSize: '14px', color: '#aaa', textAlign: 'center', marginBottom: '10px' }}>
          {t('welcome')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '14px', color: '#ccc' }}>{t('email')}</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            placeholder="seuemail@exemplo.com"
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '14px', color: '#ccc' }}>{t('password')}</label>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '14px', color: '#ccc' }}>{t('profile_type')}</label>
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
            <option value="Client">{t('client')}</option>
            <option value="Artist">{t('artist')}</option>
          </select>
        </div>

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
          {loading ? '...' : t('button_login')}
        </button>

        {/* LINK / BOTAO PARA TELA DE CADASTRO */}
        <div style={{ textTransform: 'none', textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#aaa' }}>
          Não tem uma conta?{' '}
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
            {t('button_register')}
          </span>
        </div>

      </form>
    </div>
  );
}