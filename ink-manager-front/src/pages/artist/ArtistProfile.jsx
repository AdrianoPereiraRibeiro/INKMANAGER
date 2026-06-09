import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Award, FileText, Save, ArrowLeft, Keyboard, Eye, EyeOff, Clock } from 'lucide-react';
import api from '../../services/api'; // Ajuste o caminho se necessário

export default function ArtistProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Estado atualizado com Status de Ativação e Horários de Trabalho
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    specialty: '',
    bio: '',
    isActive: true,
    startWorkTime: '09:00', // Horário de início padrão
    endWorkTime: '18:00',   // Horário de término padrão
    workDays: 'Segunda a Sexta', // Dias de atendimento
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulando a busca dos dados do artista (C# / SQL Server) com a nova carga de horários
    const fakeArtistData = {
      name: 'Thiago Silva',
      email: 'thiago.tatto@email.com',
      specialty: 'Blackwork / Geométrico',
      bio: 'Especialista em linhas finas e pontilhismo com mais de 5 anos de estrada.',
      isActive: true,
      startWorkTime: '10:00', 
      endWorkTime: '19:00',
      workDays: 'Terça a Sábado',
      currentPassword: '',
      password: '',
      confirmPassword: ''
    };

    setProfileData(fakeArtistData);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação de segurança para troca de senha
    if (profileData.password) {
      if (!profileData.currentPassword) {
        alert('Por favor, informe sua senha atual para definir uma nova.');
        return;
      }
      if (profileData.password !== profileData.confirmPassword) {
        alert('A nova senha e a confirmação não coincidem!');
        return;
      }
    }

    setLoading(true);

    try {
      // PRONTO PARA O C#: Envia as atualizações, incluindo os novos campos de horário
      // await api.put('/artists/profile', profileData);

      await new Promise(resolve => setTimeout(resolve, 600));
      alert('Perfil profissional e horários atualizados com sucesso!');
      
      setProfileData(prev => ({ ...prev, currentPassword: '', password: '', confirmPassword: '' }));
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar perfil. Verifique sua senha atual.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
        
        <button 
          onClick={() => navigate('/artist/dashboard')}
          style={{ background: 'none', border: 'none', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', padding: 0, fontSize: '14px' }}
        >
          <ArrowLeft size={16} /> {t('button_back') || 'Voltar para o Dashboard'}
        </button>

        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 'bold' }}>Meu Perfil Profissional</h1>
          <p style={{ margin: 0, color: '#aaa' }}>Configure seus dados de exibição, visibilidade e sua jornada de trabalho.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Nome */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="#8b5cf6" /> Nome Artístico
              </label>
              <input type="text" name="name" value={profileData.name} onChange={handleChange} required style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#8b5cf6" /> E-mail Profissional
              </label>
              <input type="email" name="email" value={profileData.email} onChange={handleChange} required style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            </div>
          </div>

          {/* Especialidade */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} color="#8b5cf6" /> Suas Especialidades
            </label>
            <input type="text" name="specialty" value={profileData.specialty} onChange={handleChange} placeholder="Ex: Realismo, Fine Line, Blackwork..." style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
          </div>

          {/* Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#8b5cf6" /> Bio / Apresentação para Clientes
            </label>
            <textarea name="bio" value={profileData.bio} onChange={handleChange} rows="3" placeholder="Conte sua história e experiência..." style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'sans-serif' }} />
          </div>

          {/* NOVA SEÇÃO: Horário de Trabalho / Jornada */}
          <div style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '6px', border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#8b5cf6" /> Definição de Horário e Expediente
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#aaa' }}>Horário de Início</label>
                <input type="time" name="startWorkTime" value={profileData.startWorkTime} onChange={handleChange} required style={{ padding: '10px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#aaa' }}>Horário de Término</label>
                <input type="time" name="endWorkTime" value={profileData.endWorkTime} onChange={handleChange} required style={{ padding: '10px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#aaa' }}>Dias de Atendimento</label>
                <select name="workDays" value={profileData.workDays} onChange={handleChange} style={{ padding: '10px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer' }}>
                  <option value="Segunda a Sexta">Segunda a Sexta</option>
                  <option value="Segunda a Sábado">Segunda a Sábado</option>
                  <option value="Terça a Sábado">Terça a Sábado</option>
                  <option value="Todos os dias">Todos os dias (Inclusivo Domingo)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status de Ativação do Perfil */}
          <div style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '6px', border: '1px solid #444', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {profileData.isActive ? <Eye size={20} color="#10b981" /> : <EyeOff size={20} color="#ef4444" />}
              <div>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>Status do Perfil: {profileData.isActive ? 'Ativo' : 'Pausado/Inativo'}</p>
                <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#aaa' }}>
                  {profileData.isActive ? 'Você está visível no catálogo para os clientes.' : 'Oculto do catálogo para novos agendamentos.'}
                </p>
              </div>
            </div>
            
            <label style={{ position: 'relative', display: 'inline-block', width: '46px', height: '24px', cursor: 'pointer' }}>
              <input type="checkbox" name="isActive" checked={profileData.isActive} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: profileData.isActive ? '#10b981' : '#555', transition: '0.3s', borderRadius: '24px' }}>
                <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: profileData.isActive ? '24px' : '4px', bottom: '3px', backgroundColor: 'white', transition: '0.3s', borderRadius: '50%' }}></span>
              </span>
            </label>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '10px 0' }} />

          {/* Senhas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="#ef4444" /> Senha Atual (Obrigatória para alterar dados)
            </label>
            <input type="password" name="currentPassword" value={profileData.currentPassword} onChange={handleChange} placeholder="Confirme sua senha para salvar" style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc' }}>Nova Senha</label>
              <input type="password" name="password" value={profileData.password} onChange={handleChange} placeholder="Opcional" style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc' }}>Confirmar Nova Senha</label>
              <input type="password" name="confirmPassword" value={profileData.confirmPassword} onChange={handleChange} placeholder="Opcional" style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Save size={18} /> {loading ? 'Salvando...' : 'Salvar Alterações Profissionais'}
          </button>
        </form>
      </div>

      <div style={{ maxWidth: '700px', margin: '40px auto 0 auto', width: '100%', borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '13px' }}>
        <Keyboard size={16} color="#444" />
        <span><strong>Atalhos:</strong> <kbd style={{ background: '#222', padding: '3px 6px' }}>Alt + D</kbd> Dashboard | <kbd style={{ background: '#222', padding: '3px 6px' }}>Alt + S</kbd> Agenda</span>
      </div>
    </div>
  );
}