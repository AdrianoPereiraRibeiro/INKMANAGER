import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Save, ArrowLeft, Keyboard } from 'lucide-react';
import api from '../../services/api'; // Ajuste o caminho se necessário

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Estado atualizado com a senha atual inclusa
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '', // Campo para confirmar a senha antiga
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulando a busca dos dados atuais do cliente (C#)
    const fakeUserData = {
      name: 'Cesar Ribeiro',
      email: 'cesar.ribeiro@email.com',
      currentPassword: '', 
      password: '', 
      confirmPassword: ''
    };

    setProfileData(fakeUserData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se o usuário digitou algo no campo de nova senha...
    if (profileData.password) {
      // 1. Obriga a digitação da senha atual
      if (!profileData.currentPassword) {
        alert('Por favor, informe sua senha atual para poder criar uma nova.');
        return;
      }
      
      // 2. Confere se a nova senha e a confirmação batem
      if (profileData.password !== profileData.confirmPassword) {
        alert('A nova senha e a confirmação não coincidem! Por favor, verifique.');
        return;
      }
    }

    setLoading(true);

    try {
      // PRONTO PARA O C#: Quando conectar com o banco do seu dupla
      // No back-end, o C# vai checar se a 'currentPassword' bate com o hash salvo no SQL Server
      // await api.put('/clients/profile', profileData);

      await new Promise(resolve => setTimeout(resolve, 600));

      alert('Perfil atualizado com sucesso!');
      
      // Limpa os campos de senha por segurança após o sucesso
      setProfileData(prev => ({ ...prev, currentPassword: '', password: '', confirmPassword: '' }));

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao salvar as alterações. Verifique se digitou a senha atual correta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        
        {/* Botão Voltar para o Catálogo */}
        <button 
          onClick={() => navigate('/client/catalog')}
          style={{ background: 'none', border: 'none', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', padding: 0, fontSize: '14px' }}
        >
          <ArrowLeft size={16} /> {t('button_back') || 'Voltar para o Catálogo'}
        </button>

        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 'bold' }}>Meu Perfil</h1>
          <p style={{ margin: 0, color: '#aaa' }}>Gerencie suas informações cadastrais e credenciais de segurança.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Campo Nome */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#8b5cf6" /> Nome Completo
            </label>
            <input 
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              required
              style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          {/* Campo Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#8b5cf6" /> E-mail da Conta
            </label>
            <input 
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              required
              style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '10px 0' }} />

          {/* Campo Senha Atual (Confirmação da antiga) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="#ef4444" /> Senha Atual
            </label>
            <input 
              type="password"
              name="currentPassword"
              value={profileData.currentPassword}
              onChange={handleChange}
              placeholder="Digite sua senha atual para fazer alterações"
              style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          {/* Campo Nova Senha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="#8b5cf6" /> Nova Senha
            </label>
            <input 
              type="password"
              name="password"
              value={profileData.password}
              onChange={handleChange}
              placeholder="Digite a nova senha (opcional)"
              style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          {/* Campo Confirmar Nova Senha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="#8b5cf6" /> Confirmar Nova Senha
            </label>
            <input 
              type="password"
              name="confirmPassword"
              value={profileData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme a sua nova senha"
              style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          {/* Botão Salvar Alterações */}
          <button 
            type="submit"
            disabled={loading}
            style={{ marginTop: '10px', padding: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
          >
            <Save size={18} />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>

        </form>
      </div>

      {/* BARRA DE ACESSIBILIDADE NO RODAPÉ */}
      <div style={{ maxWidth: '600px', margin: '40px auto 0 auto', width: '100%', borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '13px' }}>
        <Keyboard size={16} color="#444" />
        <span><strong>Atalhos:</strong> <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + C</kbd> Ver Tatuadores | <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + A</kbd> Meus Agendamentos</span>
      </div>

    </div>
  );
}