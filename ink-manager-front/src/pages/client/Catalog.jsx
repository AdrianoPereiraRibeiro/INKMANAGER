import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; 
import { Users, Calendar, ArrowRight, User, Keyboard, Clock } from 'lucide-react';

export default function Catalog() {
  const { t } = useTranslation();
  const navigate = useNavigate(); 
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    // Simulando os dados vindos do C# / SQL Server com o status ativo e os horários incluídos
    const fakeArtists = [
      { 
        id: 1, 
        name: 'Thiago Silva', 
        specialty: 'Blackwork / Geométrico', 
        bio: t('catalog.artist_1_bio'), 
        isActive: true,
        startWorkTime: '10:00',
        endWorkTime: '19:00',
        workDays: 'tues_to_sat'
      },
      { 
        id: 2, 
        name: 'Marina Fontes', 
        specialty: 'Realismo / Colorido', 
        bio: t('catalog.artist_2_bio'), 
        isActive: true,
        startWorkTime: '09:00',
        endWorkTime: '18:00',
        workDays: 'mon_to_fri'
      },
      { 
        id: 3, 
        name: 'Carlos "Old" Neto', 
        specialty: 'Traditional / Old School', 
        bio: t('catalog.artist_3_bio'), 
        isActive: false, // Inativo: Não vai aparecer na tela do cliente
        startWorkTime: '09:00',
        endWorkTime: '17:00',
        workDays: 'mon_to_fri'
      }
    ];

    // FILTRO: Garante que apenas os profissionais com 'isActive: true' fiquem visíveis
    const activeArtists = fakeArtists.filter(artist => artist.isActive === true);
    setArtists(activeArtists);
  }, [t]);

  const handleSelectArtist = (artistId) => {
    navigate(`/client/schedule/${artistId}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: 'bold' }}>{t('catalog.title')}</h1>
            <p style={{ margin: 0, color: '#aaa' }}>{t('catalog.subtitle')}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={() => navigate('/client/profile')}
              style={{ padding: '12px 20px', backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#3a3a3a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2a2a2a'}
            >
              <User size={16} color="#8b5cf6" /> {t('catalog.btn_profile')}
            </button>

            <button 
              onClick={() => navigate('/client/appointments')}
              style={{ padding: '12px 20px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#a78bfa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
            >
              {t('catalog.btn_my_appointments')} <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Estado Vazio */}
        {artists.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px dashed #444', margin: '20px 0' }}>
            <Users size={40} color="#666" style={{ marginBottom: '15px' }} />
            <p style={{ color: '#aaa', fontSize: '16px', margin: 0 }}>{t('catalog.empty_state')}</p>
          </div>
        ) : (
          /* Grid dos Cards dos Tatuadores Ativos */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
            {artists.map((artist) => (
              <div key={artist.id} style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', padding: '25px', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#2a2a2a', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Users size={22} color="#8b5cf6" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{artist.name}</h3>
                      <span style={{ fontSize: '13px', color: '#8b5cf6', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                        {t('catalog.specialty_label')}: {artist.specialty}
                      </span>
                      
                      {/* Horário de Trabalho Internacionalizado */}
                      <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                        <Clock size={13} /> 
                        {t(`catalog.days.${artist.workDays}`)} ({t('catalog.hours_template', { start: artist.startWorkTime, end: artist.endWorkTime })})
                      </span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#aaa', lineHeight: '1.5' }}>{artist.bio}</p>
                </div>

                <button 
                  onClick={() => handleSelectArtist(artist.id)}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
                >
                  <Calendar size={16} /> {t('catalog.btn_schedule')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rodapé de Acessibilidade */}
      <div style={{ maxWidth: '1000px', margin: '60px auto 0 auto', width: '100%', borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '13px' }}>
        <Keyboard size={16} color="#444" />
        <span>
          <strong>{t('catalog.shortcuts_title')}:</strong> <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + P</kbd> {t('catalog.shortcut_profile')} | <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + A</kbd> {t('catalog.shortcut_appointments')} | <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + L</kbd> {t('catalog.shortcut_logout')}
        </span>
      </div>

    </div>
  );
}