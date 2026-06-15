import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Clock, FileText, Ruler, Scissors, PersonStanding, Send } from 'lucide-react';
import api from '../../services/api'; 

export default function AppointmentForm() {
  const { t } = useTranslation();
  const { artistId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    style: 'Fine Line', 
    sizeCm: '',
    bodyPart: '',
    description: ''
  });

  const [artistName, setArtistName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const res = await api.get('TattooArtist');
        const foundArtist = res.data.find(a => String(a.id) === String(artistId));
        
        if (foundArtist) {
          setArtistName(foundArtist.name || foundArtist.fullName || foundArtist.user?.name || t('appointment_form.default_artist', 'Tatuador'));
        } else {
          setArtistName(t('appointment_form.default_artist', 'Tatuador'));
        }
      } catch (error) {
        console.error("Erro ao buscar dados do artista no formulário:", error);
        setArtistName(t('appointment_form.default_artist', 'Tatuador'));
      }
    };

    if (artistId) {
      fetchArtistData();
    }
  }, [artistId, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // No seu sistema, o userId da sessão é usado diretamente como identificador numérico
  const loggedInUserId = localStorage.getItem('userId');
  if (!loggedInUserId) {
    alert("Sessão expirada. Por favor, faça login novamente.");
    navigate('/');
    return;
  }

  try {
    // 1. Une os inputs de data (formData.date) e horário (formData.time) no padrão DateTime aceito pelo C#
    const combinedDateTime = new Date(`${formData.date}T${formData.time}:00`).toISOString();

    // 2. Limpa e converte o tamanho para um número inteiro simples
    const cleanSize = parseInt(String(formData.sizeCm).replace(/[^0-9]/g, ''), 10) || 10;

    // 3. ADAPTAÇÃO CRÍTICA: Payload montado exatamente igual à classe 'Appointment' do C#
    const appointmentPayload = {
      clientId: parseInt(loggedInUserId, 10), 
      artistId: parseInt(artistId, 10),       // Corrigido: C# espera 'ArtistId' e não 'tattooArtistId'
      dateTime: combinedDateTime,              // Corrigido: C# espera 'DateTime' unificado e não separado
      style: formData.style,
      bodyPart: formData.bodyPart,
      sizeCm: cleanSize, 
      notes: formData.description,             // Corrigido: C# espera 'Notes' e não 'description'
      estimatedPrice: 0                        // Corrigido: C# espera 'EstimatedPrice' e não 'price'
    };

    // Envia a requisição POST para a API
    await api.post('Appointment', appointmentPayload);

    alert(t('appointment_form.alert_success', 'Agendamento solicitado com sucesso!'));
    navigate('/client/appointments');

  } catch (error) {
    console.error("Erro ao salvar agendamento no back-end:", error);
    
    // Se a API retornar a mensagem de conflito de horário configurada no seu C#
    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message);
    } else {
      alert(t('appointment_form.alert_error', 'Falha ao processar o agendamento no servidor.'));
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        
        <button 
          type="button"
          onClick={() => navigate('/client/catalog')}
          style={{ background: 'none', border: 'none', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', padding: 0, fontSize: '14px' }}
        >
          <ArrowLeft size={16} /> {t('appointment_form.btn_back', 'Voltar ao Catálogo')}
        </button>

        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold' }}>{t('appointment_form.title', 'Solicitar Agendamento')}</h1>
          <p style={{ margin: 0, color: '#aaa' }}>
            {t('appointment_form.subtitle', 'Preencha os detalhes da sua sessão com o profissional')} <strong style={{ color: '#8b5cf6' }}>{artistName}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} color="#8b5cf6" /> {t('appointment_form.label_date', 'Data Pretendida')}
              </label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="#8b5cf6" /> {t('appointment_form.label_time', 'Horário')}
              </label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} required style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '5px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Scissors size={16} color="#8b5cf6" /> {t('appointment_form.label_style', 'Estilo da Tatuagem')}
              </label>
              <select name="style" value={formData.style} onChange={handleChange} style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer' }}>
                <option value="Fine Line">{t('appointment_form.style_fineline', 'Fine Line')}</option>
                <option value="Blackwork">{t('appointment_form.style_blackwork', 'Blackwork')}</option>
                <option value="Realismo">{t('appointment_form.style_realism', 'Realismo')}</option>
                <option value="Traditional / Old School">{t('appointment_form.style_traditional', 'Traditional / Old School')}</option>
                <option value="Geométrico">{t('appointment_form.style_geometric', 'Geométrico')}</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ruler size={16} color="#8b5cf6" /> {t('appointment_form.label_size', 'Tamanho Estimado (cm)')}
              </label>
              <input type="number" min="1" name="sizeCm" value={formData.sizeCm} onChange={handleChange} required placeholder={t('appointment_form.placeholder_size', 'Ex: 15')} style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PersonStanding size={16} color="#8b5cf6" /> {t('appointment_form.label_body_part', 'Local do Corpo')}
            </label>
            <input type="text" name="bodyPart" value={formData.bodyPart} onChange={handleChange} required placeholder={t('appointment_form.placeholder_body_part', 'Ex: Antebraço')} style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} color="#8b5cf6" /> {t('appointment_form.label_description', 'Descrição da Ideia')}
            </label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" placeholder={t('appointment_form.placeholder_description', 'Conte detalhes sobre o desenho que deseja...')} style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'sans-serif', lineHeight: '1.4' }} />
          </div>

          <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '14px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}>
            <Send size={18} /> {loading ? t('appointment_form.btn_sending', 'Enviando...') : t('appointment_form.btn_submit', 'Enviar Solicitação')}
          </button>

        </form>

      </div>
    </div>
  );
}