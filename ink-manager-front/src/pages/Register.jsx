import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importando o contexto de autenticação
import { User, Mail, Lock, Users, ArrowLeft } from 'lucide-react';
import api from '../services/api'; // Conexão com o C# configurada no Axios (Porta 7053)

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth(); // Função global para definir o perfil e efetuar o login direto

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Client' // Valor padrão
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples de preenchimento
    if (!formData.name || !formData.email || !formData.password) {
      alert(t('register.alert_validation') || 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);

      // REQUISIÇÃO REAL PARA O BACK-END C# / SQL SERVER
      const response = await api.post('/Auth/register', formData);
      
      // Captura o token e id do usuário se fornecidos no cadastro, ou faz fallback se necessário
      const { token, userId } = response.data;

      if (token) {
        localStorage.setItem('@InkManager:token', token);
      }
      if (userId) {
        localStorage.setItem('userId', String(userId));
      }

      alert(t('register.alert_success') || 'Cadastro realizado com sucesso!');

      // 1. Efetua o login automático no estado global usando o perfil (role) escolhido
      login(formData.role);

      // 2. Redireciona direto para a tela inicial do tipo de perfil correspondente
      if (formData.role === 'Artist') {
        navigate('/artist/dashboard');
      } else {
        navigate('/client/catalog');
      }

    } catch (error) {
      console.error('Erro ao cadastrar no banco de dados:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert(t('register.alert_error') || 'Erro ao realizar o cadastro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#1e1e1e', width: '100%', maxWidth: '450px', padding: '40px', borderRadius: '8px', border: '1px solid #333', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
        
        {/* Botão Voltar */}
        <button 
          onClick={() => navigate('/login')}
          style={{ background: 'none', border: 'none', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', padding: 0, fontSize: '14px' }}
        >
          <ArrowLeft size={16} /> {t('register.btn_back')}
        </button>

        <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold', textAlign: 'center' }}>
          {t('register.title')}
        </h2>
        <p style={{ margin: '0 0 30px 0', color: '#aaa', fontSize: '14px', textAlign: 'center' }}>
          {t('register.subtitle')}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Campo Nome */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#8b5cf6" /> {t('register.label_name')}
            </label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder={t('register.placeholder_name')}
              style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          {/* Campo Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#8b5cf6" /> {t('register.label_email')}
            </label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="email@email.com"
              style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          {/* Campo Senha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="#8b5cf6" /> {t('register.label_password')}
            </label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="••••••••"
              style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          {/* Tipo de Perfil (Role) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#8b5cf6" /> {t('register.label_profile_type')}
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '15px', outline: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <option value="Client">{t('register.role_client')}</option>
              <option value="Artist">{t('register.role_artist')}</option>
            </select>
          </div>

          {/* Botão de Submeter */}
          <button 
            type="submit"
            disabled={loading}
            style={{ 
              marginTop: '10px', 
              padding: '14px', 
              backgroundColor: loading ? '#5b21b6' : '#8b5cf6', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold', 
              fontSize: '16px', 
              transition: 'background 0.2s' 
            }}
          >
            {loading ? '...' : t('register.btn_submit')}
          </button>

        </form>
      </div>
    </div>
  );
}