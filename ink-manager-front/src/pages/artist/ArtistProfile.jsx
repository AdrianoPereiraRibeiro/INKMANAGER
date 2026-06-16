import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Award, FileText, Save, ArrowLeft, Keyboard, Eye, EyeOff, Clock } from 'lucide-react';
import api from '../../services/api'; // Utilizando a porta 7053 configurada

export default function ArtistProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Estado unificado com chaves do Front e propriedades do Back-end
  const [profileData, setProfileData] = useState({
    id: null, // Armazenará o ID do Tatuador obtido da API
    name: '',
    email: '',
    specialty: '',
    bio: '',
    portfolioLink: '',
    isActive: true,
    startWorkTime: '09:00',
    endWorkTime: '18:00',
    workDays: 'Segunda a Sexta',
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });

  // Nascer como true elimina a necessidade de chamar setLoading(true) síncronamente
  const [loading, setLoading] = useState(true);

  // BUSCA REAL DOS DADOS DO ARTISTA NO BANCO (READ do CRUD)
  useEffect(() => {
    const loggedInUserId = localStorage.getItem('userId');

    if (!loggedInUserId) {
      alert("Sessão expirada. Faça login novamente.");
      navigate('/');
      return;
    }

    const fetchArtistData = async () => {
      try {
        // Busca todos os tatuadores e filtra o que corresponde ao usuário logado
        const res = await api.get('/TattooArtist');
        const currentArtist = res.data.find(a => String(a.userId) === String(loggedInUserId));
        
        if (currentArtist) {
          setProfileData(prev => ({
            ...prev,
            id: currentArtist.id, // ID da tabela TattooArtists
            name: currentArtist.name,
            email: currentArtist.email,
            specialty: currentArtist.speciality || '',
            bio: currentArtist.bio || '',
            portfolioLink: currentArtist.portfolioLink || ''
          }));
        }
      } catch (err) {
        console.error("Erro ao carregar perfil do artista:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // SALVA AS ALTERAÇÕES NO BANCO DE DADOS (UPDATE do CRUD)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações locais mantidas
    if (profileData.password) {
      if (!profileData.currentPassword) {
        alert(t('artist_profile.alert_current_password_required'));
        return;
      }
      if (profileData.password !== profileData.confirmPassword) {
        alert(t('artist_profile.alert_passwords_dont_match'));
        return;
      }
    }

    setLoading(true);

    try {
      // Dispara o PUT para /api/TattooArtist/{id} com o DTO esperado pelo C#
      await api.put(`/TattooArtist/${profileData.id}`, {
        speciality: profileData.specialty, // Mapeado para o C# (Speciality)
        bio: profileData.bio,
        portfolioLink: profileData.portfolioLink
      });

      alert(t('artist_profile.alert_success'));
      
      setProfileData(prev => ({ ...prev, currentPassword: '', password: '', confirmPassword: '' }));
    } catch (error) {
      console.error("Erro ao salvar perfil no C#:", error);
      alert(t('artist_profile.alert_error'));
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
          <ArrowLeft size={16} /> {t('button_back')}
        </button>

        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 'bold' }}>{t('artist_profile.title')}</h1>
          <p style={{ margin: 0, color: '#aaa' }}>{t('artist_profile.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Nome (Somente leitura para integridade do User) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="#8b5cf6" /> {t('artist_profile.label_name')}
              </label>
              <input type="text" name="name" value={profileData.name} onChange={handleChange} disabled style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#888', outline: 'none', cursor: 'not-allowed' }} />
            </div>

            {/* Email (Somente leitura) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#8b5cf6" /> {t('artist_profile.label_email')}
              </label>
              <input type="email" name="email" value={profileData.email} onChange={handleChange} disabled style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#888', outline: 'none', cursor: 'not-allowed' }} />
            </div>
          </div>

          {/* Especialidade */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} color="#8b5cf6" /> {t('artist_profile.label_specialty')}
            </label>
            <input type="text" name="specialty" value={profileData.specialty} onChange={handleChange} placeholder={t('artist_profile.placeholder_specialty')} style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
          </div>

          {/* Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#8b5cf6" /> {t('artist_profile.label_bio')}
            </label>
            <textarea name="bio" value={profileData.bio} onChange={handleChange} rows="3" placeholder={t('artist_profile.placeholder_bio')} style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'sans-serif' }} />
          </div>

          {/* HORÁRIO DE TRABALHO / JORNADA */}
          <div style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '6px', border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#8b5cf6" /> {t('artist_profile.schedule_section_title')}
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#aaa' }}>{t('artist_profile.label_start_time')}</label>
                <input type="time" name="startWorkTime" value={profileData.startWorkTime} onChange={handleChange} required style={{ padding: '10px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#aaa' }}>{t('artist_profile.label_end_time')}</label>
                <input type="time" name="endWorkTime" value={profileData.endWorkTime} onChange={handleChange} required style={{ padding: '10px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#aaa' }}>{t('artist_profile.label_work_days')}</label>
                <select name="workDays" value={profileData.workDays} onChange={handleChange} style={{ padding: '10px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer' }}>
                  <option value="Segunda a Sexta">{t('artist_profile.days_option_1')}</option>
                  <option value="Segunda a Sábado">{t('artist_profile.days_option_2')}</option>
                  <option value="Terça a Sábado">{t('artist_profile.days_option_3')}</option>
                  <option value="Todos os dias">{t('artist_profile.days_option_4')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status de Ativação do Perfil (LINHA CORRIGIDA) */}
          <div style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '6px', border: '1px solid #444', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {profileData.isActive ? <Eye size={20} color="#10b981" /> : <EyeOff size={20} color="#ef4444" />}
              <div>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>
                  {t('artist_profile.status_title')}: {profileData.isActive ? t('artist_profile.status_active') : t('artist_profile.status_inactive')}
                </p>
                <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#aaa' }}>
                  {profileData.isActive ? t('artist_profile.status_desc_active') : t('artist_profile.status_desc_inactive')}
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
              <Lock size={16} color="#ef4444" /> {t('artist_profile.label_current_password')}
            </label>
            <input type="password" name="currentPassword" value={profileData.currentPassword} onChange={handleChange} placeholder={t('artist_profile.placeholder_current_password')} style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc' }}>{t('artist_profile.label_new_password')}</label>
              <input type="password" name="password" value={profileData.password} onChange={handleChange} placeholder={t('artist_profile.placeholder_optional')} style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc' }}>{t('artist_profile.label_confirm_password')}</label>
              <input type="password" name="confirmPassword" value={profileData.confirmPassword} onChange={handleChange} placeholder={t('artist_profile.placeholder_optional')} style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Save size={18} /> {loading ? t('artist_profile.button_saving') : t('artist_profile.button_save')}
          </button>
        </form>
      </div>

      <div style={{ maxWidth: '700px', margin: '40px auto 0 auto', width: '100%', borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '13px' }}>
        <Keyboard size={16} color="#444" />
        <span><strong>{t('artist_profile.shortcuts_title')}:</strong> <kbd style={{ background: '#222', padding: '3px 6px' }}>Alt + D</kbd> Dashboard | <kbd style={{ background: '#222', padding: '3px 6px' }}>Alt + P</kbd> Perfil</span>
      </div>
    </div>
  );
}