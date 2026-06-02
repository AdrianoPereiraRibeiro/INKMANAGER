import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Calendar, Check, X, ArrowLeft, CalendarCheck, Keyboard } from 'lucide-react';
import api from '../../services/api';

export default function Schedule() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Lista 1: Pedidos que aguardam aprovação
  const [pendingRequests, setPendingRequests] = useState([]);
  // Lista 2: Compromissos já aceitos pelo tatuador (A Agenda Real)
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);

  useEffect(() => {
    // Dados iniciais simulados (O que viria do C# / SQL Server)
    const fakePending = [
      { id: 201, clientName: 'Cesar Ribeiro', date: '2026-06-15', time: '14:00', description: 'Borboleta Fine Line no antebraço' },
      { id: 202, clientName: 'Amanda Souza', date: '2026-06-18', time: '16:30', description: 'Frase na costela: "Stay Strong"' }
    ];

    const fakeConfirmed = [
      { id: 190, clientName: 'Lucas Lima', date: '2026-06-05', time: '10:00', description: 'Fechamento de braço - Estilo Oriental (Sessão 3)' }
    ];

    setPendingRequests(fakePending);
    setConfirmedAppointments(fakeConfirmed);
  }, []);

  // Função disparada ao clicar no botão VERDE
  const handleAccept = async (id) => {
    try {
      // Quando conectar com a API do seu dupla: 
      // await api.put(`/appointments/${id}/accept`);
      
      // Localiza o item que foi aceito
      const acceptedItem = pendingRequests.find(req => req.id === id);
      
      if (acceptedItem) {
        // 1. Remove da lista de pendentes
        setPendingRequests(prev => prev.filter(req => req.id !== id));
        // 2. Joga para a lista de confirmados (Agenda) na mesma hora!
        setConfirmedAppointments(prev => [...prev, acceptedItem]);
      }

      alert(`Agendamento #${id} adicionado à sua agenda oficial!`);
    } catch (error) {
      console.error(error);
    }
  };

  // Função disparada ao clicar no botão VERMELHO
  const handleReject = async (id) => {
    try {
      // Quando conectar com a API: await api.put(`/appointments/${id}/reject`);
      setPendingRequests(prev => prev.filter(req => req.id !== id));
      alert(`Solicitação #${id} recusada.`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        
        {/* Voltar para o Dashboard (Ponto 4) */}
        <button 
          onClick={() => navigate('/artist/dashboard')}
          style={{ background: 'none', border: 'none', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
        >
          <ArrowLeft size={18} /> {t('button_back') || 'Voltar para o Dashboard'}
        </button>

        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 'bold' }}>{t('artist_schedule_title') || 'Gerenciador de Agenda'}</h1>
          <p style={{ margin: 0, color: '#aaa' }}>{t('artist_schedule_subtitle') || 'Controle seus horários e aprove novos pedidos de clientes.'}</p>
        </div>

        {/* ================= SEÇÃO 1: SOLICITAÇÕES PENDENTES ================= */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '20px', color: '#f59e0b', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} /> {t('pending_requests_title') || 'Novos Pedidos Aguardando Aprovação'} ({pendingRequests.length})
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {pendingRequests.length === 0 ? (
              <p style={{ color: '#aaa', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '6px', border: '1px dashed #444', fontSize: '14px', margin: 0 }}>
                Nenhum pedido pendente por aqui hoje.
              </p>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.id} style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', padding: '20px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#8b5cf6', marginBottom: '5px' }}>{req.clientName}</div>
                    <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '5px' }}>Data: {req.date} às {req.time}</div>
                    <div style={{ fontSize: '13px', color: '#aaa' }}>{req.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleReject(req.id)} style={{ padding: '10px 14px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <X size={14} /> {t('button_reject') || 'Recusar'}
                    </button>
                    <button onClick={() => handleAccept(req.id)} style={{ padding: '10px 14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> {t('button_accept') || 'Aceitar'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= SEÇÃO 2: AGENDA DE TRABALHO (CONFIRMADOS) ================= */}
        <div>
          <h2 style={{ fontSize: '20px', color: '#10b981', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarCheck size={20} /> {t('confirmed_appointments_title') || 'Sua Agenda / Próximas Sessões Confirmadas'} ({confirmedAppointments.length})
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {confirmedAppointments.length === 0 ? (
              <p style={{ color: '#aaa', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '6px', border: '1px dashed #444', fontSize: '14px', margin: 0 }}>
                Você não possui sessões confirmadas para os próximos dias.
              </p>
            ) : (
              confirmedAppointments.map((app) => (
                <div key={app.id} style={{ backgroundColor: '#1a2e26', borderRadius: '8px', padding: '20px', border: '1px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#10b981', marginBottom: '5px' }}>{app.clientName}</div>
                    <div style={{ fontSize: '13px', color: '#fff', marginBottom: '5px', fontWeight: '500' }}>Horário Marcado: {app.date} às {app.time}</div>
                    <div style={{ fontSize: '13px', color: '#ccc' }}>{app.description}</div>
                  </div>
                  <span style={{ fontSize: '12px', backgroundColor: '#10b981', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                    {t('status_confirmed') || 'Confirmado'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* BARRA DE ACESSIBILIDADE VISUAL NO RODAPÉ (Ponto 1) */}
      <div style={{ maxWidth: '900px', margin: '60px auto 0 auto', width: '100%', borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '13px' }}>
        <Keyboard size={16} color="#444" />
        <span><strong>Atalhos de Acessibilidade:</strong> <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + D</kbd> Ver Painel/Gráficos | <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + L</kbd> Desconectar/Sair</span>
      </div>

    </div>
  );
}