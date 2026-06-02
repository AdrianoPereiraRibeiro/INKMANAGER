import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileDown, ArrowLeft, CheckCircle2, Clock, XCircle, Keyboard } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import api from '../../services/api';

// --- ESTILIZAÇÃO DO DOCUMENTO PDF (Exigência de Relatório) ---
const pdfStyles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  title: { fontSize: 24, marginBottom: 10, color: '#1a1a1a', fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginBottom: 25, color: '#666666' },
  section: { marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 4 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#8b5cf6' },
  text: { fontSize: 11, color: '#333333', lineHeight: 1.6, marginBottom: 4 }
});

// --- COMPONENTE DO ARQUIVO PDF EM SI ---
const CareGuidelinesPDF = ({ appointment }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.title}>Termo de Cuidados Pós-Tatuagem</Text>
      <Text style={pdfStyles.subtitle}>InkManager - Gerenciamento de Estúdios de Tatuagem</Text>
      
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Detalhes da Sessão</Text>
        <Text style={pdfStyles.text}>Profissional: {appointment.artistName}</Text>
        <Text style={pdfStyles.text}>Data do Atendimento: {appointment.date} às {appointment.time}</Text>
        <Text style={pdfStyles.text}>Especificação: {appointment.description}</Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Orientações Importantes para Cicatrização</Text>
        <Text style={pdfStyles.text}>1. Mantenha o filme plástico protetor pelo tempo recomendado pelo profissional.</Text>
        <Text style={pdfStyles.text}>2. Lave a região cuidadosamente com sabonete neutro ou antisséptico 2 a 3 vezes ao dia.</Text>
        <Text style={pdfStyles.text}>3. Aplique uma camada fina da pomada reconstrutora recomendada.</Text>
        <Text style={pdfStyles.text}>4. NÃO remova casquinhas, não coce e evite exposição direta ao sol, piscina ou mar nos primeiros 15 dias.</Text>
      </View>
    </Page>
  </Document>
);

// --- COMPONENTE PRINCIPAL DA TELA ---
export default function MyAppointments() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Dados simulados do SQL Server via C#
    // TESTE DE ESTADO VAZIO: Deixe o array como [] abaixo para simular que o cliente não tem agendamentos ainda.
    const fakeAppointments = [
      { id: 101, artistName: 'Thiago Silva', date: '2026-06-15', time: '14:00', description: 'Borboleta Fine Line no antebraço', status: 'Confirmed' },
      { id: 102, artistName: 'Marina Fontes', date: '2026-06-22', time: '09:30', description: 'Leão realista na panturrilha', status: 'Pending' }
    ];
    setAppointments(fakeAppointments);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontSize: '14px' }}><CheckCircle2 size={16} /> {t('status_confirmed')}</span>;
      case 'Pending':
        return <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b', fontSize: '14px' }}><Clock size={16} /> {t('status_pending')}</span>;
      default:
        return <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontSize: '14px' }}><XCircle size={16} /> {t('status_canceled')}</span>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        
        {/* PONTO 4: Rota de fuga limpa e internacionalizada */}
        <button 
          onClick={() => navigate('/client/catalog')}
          style={{ background: 'none', border: 'none', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
        >
          <ArrowLeft size={18} /> {t('button_back') || 'Voltar ao Catálogo'}
        </button>

        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>{t('client_appointments_title')}</h1>
          <p style={{ margin: 0, color: '#aaa' }}>{t('client_appointments_subtitle')}</p>
        </div>

        {/* PONTO 2: TRATAMENTO DE ESTADO VAZIO */}
        {appointments.length === 0 ? (
          <div style={{ padding: '50px 20px', textAlign: 'center', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px dashed #444', margin: '20px 0' }}>
            <Calendar size={40} color="#666" style={{ marginBottom: '15px' }} />
            <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '20px' }}>
              Você ainda não possui solicitações de agendamento feitas.
            </p>
            <button 
              onClick={() => navigate('/client/catalog')}
              style={{ padding: '12px 24px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Escolher um Tatuador Agora
            </button>
          </div>
        ) : (
          /* Lista de Agendamentos (Só renderiza se o array tiver dados de fato) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {appointments.map((app) => (
              <div key={app.id} style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', padding: '24px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#8b5cf6' }}>{app.artistName}</h3>
                  <p style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> {app.date} às {app.time}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>{app.description}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                  {getStatusBadge(app.status)}

                  {/* Exigência do Professor: Só emite PDF se estiver Confirmado */}
                  {app.status === 'Confirmed' && (
                    <PDFDownloadLink
                      document={<CareGuidelinesPDF appointment={app} />}
                      fileName={`orientacoes_inkmanager_${app.id}.pdf`}
                      style={{
                        textDecoration: 'none', padding: '10px 16px', backgroundColor: '#8b5cf6', color: '#fff',
                        borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
                      }}
                    >
                      {({ loading }) => (loading ? '...' : <><FileDown size={16} /> {t('button_download_pdf')}</>)}
                    </PDFDownloadLink>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PONTO 1: BARRA DE ACESSIBILIDADE VISUAL NO RODAPÉ */}
      <div style={{ maxWidth: '800px', margin: '60px auto 0 auto', width: '100%', borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '13px' }}>
        <Keyboard size={16} color="#444" />
        <span><strong>Atalhos de Acessibilidade:</strong> <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + C</kbd> Voltar ao Catálogo | <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + L</kbd> Desconectar</span>
      </div>

    </div>
  );
}