import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileDown, ArrowLeft, CheckCircle2, Clock, XCircle, Keyboard } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import api from '../../services/api'; 

const pdfStyles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  title: { fontSize: 24, marginBottom: 10, color: '#1a1a1a', fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginBottom: 25, color: '#666666' },
  section: { marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 4 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#8b5cf6' },
  text: { fontSize: 11, color: '#333333', lineHeight: 1.6, marginBottom: 4 }
});

// COMPONENTE DO PDF CORRIGIDO COM FALLBACKS DE TEXTO
const CareGuidelinesPDF = ({ appointment, t }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.title}>{t('appointments.pdf_title', 'Instruções Pós-Tatuagem')}</Text>
      <Text style={pdfStyles.subtitle}>{t('appointments.pdf_studio_brand', 'InkManager Studio')}</Text>
      
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{t('appointments.pdf_section_details', 'Detalhes do Agendamento')}</Text>
        <Text style={pdfStyles.text}>{t('appointments.pdf_artist', 'Artista:')} {appointment.artistName}</Text>
        <Text style={pdfStyles.text}>
          {t('appointments.pdf_date', 'Data: {{date}} às {{time}}', { date: appointment.date, time: appointment.time })}
        </Text>
        <Text style={pdfStyles.text}>{t('appointments.pdf_specification', 'Especificações:')} {appointment.description}</Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{t('appointments.pdf_section_guidelines', 'Cuidados Recomendados')}</Text>
        <Text style={pdfStyles.text}>{t('appointments.pdf_guideline_1', '1. Mantenha o plástico filme protetor pelas primeiras 2 a 3 horas.')}</Text>
        <Text style={pdfStyles.text}>{t('appointments.pdf_guideline_2', '2. Lave a região delicadamente com água fria e sabonete neutro.')}</Text>
        <Text style={pdfStyles.text}>{t('appointments.pdf_guideline_3', '3. Aplique uma camada fina da pomada recomendada 3 vezes ao dia.')}</Text>
        <Text style={pdfStyles.text}>{t('appointments.pdf_guideline_4', '4. Não coce, não arranque as casquinhas e evite exposição direta ao sol.')}</Text>
      </View>
    </Page>
  </Document>
);

export default function MyAppointments() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentLang = i18n.language === 'en' ? 'en-US' : 'pt-BR';

  useEffect(() => {
    const fetchClientAppointments = async () => {
      const loggedInUserId = localStorage.getItem('userId');
      if (!loggedInUserId) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);

        // 1. Busca os Agendamentos diretamente pelo ID do Cliente Logado
        const appointmentRes = await api.get(`Appointment/client/${loggedInUserId}`);
        const appointmentData = appointmentRes.data || [];

        // 2. Busca a lista de Tatuadores para resolver o ID do artista para Nome
        const artistRes = await api.get('TattooArtist');
        const artistData = artistRes.data || [];

        // 3. Mapeia os dados aplicando as travas de tratamento textual e correção de propriedades do C#
        const formatted = appointmentData.map(app => {
          // Tenta encontrar por artistId, tattooArtistId ou objeto aninhado vindo do back-end
          const targetArtistId = app.artistId || app.tattooArtistId || app.artist?.id;
          const artistMatch = artistData.find(a => String(a.id) === String(targetArtistId));
          
          const artistName = artistMatch?.name || artistMatch?.fullName || artistMatch?.user?.name || app.artist?.name || t('appointments.unknown_artist', 'Artista do Estúdio');

          // Tratamento seguro para extrair Data e Hora da string unificada 'dateTime' do C#
          let displayDate = '';
          let displayTime = '00:00';
          
          if (app.dateTime) {
            const parts = app.dateTime.split('T');
            displayDate = parts[0]; // YYYY-MM-DD
            if (parts[1]) displayTime = parts[1].substring(0, 5); // HH:mm
          } else if (app.date) {
            displayDate = app.date.substring(0, 10);
            if (app.time) displayTime = app.time.substring(0, 5);
          }

          // Formata a data de forma amigável para exibição local (DD/MM/YYYY)
          let finalDateStr = displayDate;
          if (displayDate) {
            finalDateStr = new Date(`${displayDate}T00:00:00`).toLocaleDateString(currentLang);
          }

          // Normalização do Status (Mapeia tanto string quanto os Enums numéricos do C#)
          let normalizedStatus = 'Pending';
          const rawStatus = app.status !== undefined && app.status !== null ? app.status.toString().trim() : '';

          if (rawStatus === '1' || rawStatus.toLowerCase() === 'confirmed' || rawStatus.toLowerCase() === 'confirmado') {
            normalizedStatus = 'Confirmed';
          } else if (rawStatus === '2' || rawStatus.toLowerCase() === 'declined' || rawStatus.toLowerCase() === 'recusado' || rawStatus.toLowerCase() === 'canceled') {
            normalizedStatus = 'Declined';
          }

          return {
            id: app.id,
            artistName: artistName,
            date: finalDateStr,
            time: displayTime,
            description: app.notes || app.description || `${app.style || 'Estilo Livre'} — ${app.bodyPart || 'Local não definido'}`,
            status: normalizedStatus
          };
        });

        setAppointments(formatted);
      } catch (error) {
        console.error("Erro ao carregar dados do banco de dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientAppointments();
  }, [navigate, t, currentLang]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}><CheckCircle2 size={16} /> {t('appointments.status_confirmed', 'Confirmado')}</span>;
      case 'Pending':
        return <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b', fontSize: '14px', fontWeight: 'bold' }}><Clock size={16} /> {t('appointments.status_pending', 'Em Análise')}</span>;
      default:
        return <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontSize: '14px', fontWeight: 'bold' }}><XCircle size={16} /> {t('appointments.status_canceled', 'Recusado')}</span>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        
        <button 
          onClick={() => navigate('/client/catalog')}
          style={{ background: 'none', border: 'none', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
        >
          <ArrowLeft size={18} /> {t('appointments.btn_back', 'Voltar ao Catálogo')}
        </button>

        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold' }}>{t('appointments.title', 'Minhas Solicitações de Agendamento')}</h1>
          <p style={{ margin: 0, color: '#aaa' }}>{t('appointments.subtitle', 'Acompanhe o status dos seus pedidos e orientações pós-tatuagem.')}</p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#aaa', padding: '30px' }}>Carregando seus agendamentos...</p>
        ) : appointments.length === 0 ? (
          <div style={{ padding: '50px 20px', textAlign: 'center', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px dashed #444', margin: '20px 0' }}>
            <Calendar size={40} color="#666" style={{ marginBottom: '15px' }} />
            <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '20px' }}>
              {t('appointments.empty_state_text', 'Você ainda não possui solicitações enviadas.')}
            </p>
            <button 
              onClick={() => navigate('/client/catalog')}
              style={{ padding: '12px 24px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {t('appointments.btn_choose_artist', 'Escolher um Profissional')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {appointments.map((app) => (
              <div key={app.id} style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', padding: '24px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#8b5cf6', fontWeight: 'bold' }}>{app.artistName}</h3>
                  <p style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#8b5cf6" /> {app.date} às {app.time}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>{app.description}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                  {getStatusBadge(app.status)}

                  {app.status === 'Confirmed' && (
                    <PDFDownloadLink
                      document={<CareGuidelinesPDF appointment={app} t={t} />}
                      fileName={`orientacoes_inkmanager_${app.id}.pdf`}
                      style={{
                        textDecoration: 'none', padding: '10px 16px', backgroundColor: '#8b5cf6', color: '#fff',
                        borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
                      }}
                    >
                      {({ loading }) => (loading ? '...' : <><FileDown size={16} /> {t('appointments.btn_download_pdf', 'Instruções Pós-Tattoo (PDF)')}</>)}
                    </PDFDownloadLink>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: '800px', margin: '60px auto 0 auto', width: '100%', borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '13px' }}>
        <Keyboard size={16} color="#444" />
        <span>
          <strong>{t('appointments.shortcuts_title', 'Atalhos')}:</strong> <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + C</kbd> {t('appointments.shortcut_catalog', 'Catálogo')} | <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + L</kbd> {t('appointments.shortcut_logout', 'Sair')}
        </span>
      </div>

    </div>
  );
}