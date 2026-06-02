import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, FileText, ArrowLeft, Keyboard } from 'lucide-react';
import api from '../../services/api';

export default function AppointmentForm() {
  const { t } = useTranslation();
  const { artistId } = useParams(); // Pega o ID do tatuador que veio pela URL da rota
  const navigate = useNavigate();

  // Estados dos campos do formulário
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Nomes estáticos temporários baseados no ID escolhido para simular a tela
  const artistName = artistId === '1' ? 'Thiago Silva' : artistId === '2' ? 'Marina Fontes' : 'Carlos "Old" Neto';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const appointmentData = {
      artistId: parseInt(artistId),
      date: date,
      time: time,
      description: description,
      status: 'Pending' // Começa pendente para o tatuador aprovar
    };

    try {
      /* ======================================================================
        INTEGRAÇÃO COM O C# (VALIDAÇÃO DO BANCO):
        Quando o back-end estiver pronto, essa chamada vai bater na validação 
        do seu dupla. Se o C# responder com erro de conflito de horário, 
        cairá direto no catch.
        
        await api.post('/appointments', appointmentData);
        ======================================================================
      */

      // Simulação de resposta bem-sucedida do servidor
      await new Promise(resolve => setTimeout(resolve, 800));
      
      alert('Solicitação enviada com sucesso! Aguarde a aprovação do tatuador.');
      
      // Envia o cliente para a tela de listagem de agendamentos dele
      navigate('/client/appointments');

    } catch (error) {
      console.error(error);
      // Se o back-end em C# rejeitar por horário ocupado, você exibe o alerta:
      alert('Este horário já está ocupado por outra sessão deste tatuador. Escolha outra data/hora.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        
        {/* PONTO 4: Botão de Voltar para o Catálogo coerente e internacionalizado */}
        <button 
          onClick={() => navigate('/client/catalog')}
          style={{ 
            background: 'none', border: 'none', color: '#aaa', display: 'flex', 
            alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', padding: 0 
          }}
        >
          <ArrowLeft size={18} /> {t('button_back') || 'Voltar'}
        </button>

        {/* Cabeçalho */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '26px' }}>{t('form_title')}</h1>
          <p style={{ margin: 0, color: '#aaa' }}>{t('form_subtitle')} <strong style={{ color: '#8b5cf6' }}>{artistName}</strong></p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ 
          background: '#1e1e1e', padding: '30px', borderRadius: '8px', 
          border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '20px' 
        }}>
          
          {/* Campo Data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CalendarDays size={16} color="#8b5cf6" /> {t('form_date')}
            </label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required 
              style={{ padding: '12px', borderRadius: '4px', border: '1px solid #333', background: '#2a2a2a', color: '#fff', outline: 'none' }} 
            />
          </div>

          {/* Campo Horário */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#8b5cf6" /> {t('form_time')}
            </label>
            <input 
              type="time" 
              value={time} 
              onChange={e => setTime(e.target.value)} 
              required 
              style={{ padding: '12px', borderRadius: '4px', border: '1px solid #333', background: '#2a2a2a', color: '#fff', outline: 'none' }} 
            />
          </div>

          {/* Campo Descrição da Ideia */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} color="#8b5cf6" /> {t('form_description')}
            </label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required 
              rows="4"
              placeholder={t('form_placeholder')}
              style={{ 
                padding: '12px', borderRadius: '4px', border: '1px solid #333', 
                background: '#2a2a2a', color: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'sans-serif' 
              }} 
            />
          </div>

          {/* Botão de Envio */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '14px', borderRadius: '4px', border: 'none', 
              background: loading ? '#5b21b6' : '#8b5cf6', color: '#fff', 
              fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? '...' : t('button_send_request')}
          </button>

        </form>
      </div>

      {/* PONTO 1: BARRA DE ACESSIBILIDADE VISUAL NO RODAPÉ */}
      <div style={{ maxWidth: '500px', margin: '40px auto 0 auto', width: '100%', borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '13px' }}>
        <Keyboard size={16} color="#444" />
        <span><strong>Atalhos:</strong> <kbd style={{ background: '#222', padding: '2px 5px', borderRadius: '4px', border: '1px solid #444', color: '#aaa' }}>Alt + C</kbd> Catálogo | <kbd style={{ background: '#222', padding: '2px 5px', borderRadius: '4px', border: '1px solid #444', color: '#aaa' }}>Alt + A</kbd> Agendamentos</span>
      </div>

    </div>
  );
}