import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Clock, FileText, Ruler, Scissors, PersonStanding, Send } from 'lucide-react';

export default function AppointmentForm() {
  const { t } = useTranslation();
  const { artistId } = useParams();
  const navigate = useNavigate();

  // Estado do formulário com os novos campos detalhados que o tatuador precisa
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    style: 'Fine Line', // Valor padrão
    sizeCm: '',
    bodyPart: '',
    description: ''
  });

  const [artistName, setArtistName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simula a busca do nome do artista selecionado no catálogo
    const artistsMock = {
      1: 'Thiago Silva',
      2: 'Marina Fontes',
      3: 'Carlos "Old" Neto'
    };
    setArtistName(artistsMock[artistId] || 'Tatuador Selecionado');
  }, [artistId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // PRONTO PARA O C# / SQL SERVER:
      // Envia o payload completo com os detalhes da anatomia e tamanho
      // await api.post('/appointments', { artistId, ...formData });

      await new Promise(resolve => setTimeout(resolve, 800));
      alert('Solicitação de agendamento enviada! O tatuador irá analisar o desenho e retornará com o preço.');
      navigate('/client/appointments');
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        
        {/* Botão Voltar */}
        <button 
          onClick={() => navigate('/client/catalog')}
          style={{ background: 'none', border: 'none', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', padding: 0, fontSize: '14px' }}
        >
          <ArrowLeft size={16} /> Voltar para o Catálogo
        </button>

        {/* Título da Tela */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold' }}>Solicitar Horário</h1>
          <p style={{ margin: 0, color: '#aaa' }}>Você está enviando uma proposta de projeto para: <strong style={{ color: '#8b5cf6' }}>{artistName}</strong></p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Data e Hora */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} color="#8b5cf6" /> Data Pretendida
              </label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="#8b5cf6" /> Horário
              </label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} required style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '5px 0' }} />

          {/* NOVOS CAMPOS: Estilo e Tamanho */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Scissors size={16} color="#8b5cf6" /> Estilo Comercial
              </label>
              <select name="style" value={formData.style} onChange={handleChange} style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer' }}>
                <option value="Fine Line">Fine Line</option>
                <option value="Blackwork">Blackwork</option>
                <option value="Realismo">Realismo</option>
                <option value="Traditional / Old School">Traditional / Old School</option>
                <option value="Geométrico">Geométrico</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ruler size={16} color="#8b5cf6" /> Tamanho (ex: 15cm)
              </label>
              <input type="text" name="sizeCm" value={formData.sizeCm} onChange={handleChange} required placeholder="Ex: 15cm" style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            </div>
          </div>

          {/* NOVO CAMPO: Local do Corpo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PersonStanding size={16} color="#8b5cf6" /> Local do Corpo para a Tatuagem
            </label>
            <input type="text" name="bodyPart" value={formData.bodyPart} onChange={handleChange} required placeholder="Ex: Antebraço Esquerdo, Costelas, Panturrilha..." style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none' }} />
          </div>

          {/* NOVO CAMPO: Descrição da Ideia */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} color="#8b5cf6" /> Idéia / Descrição Detalhada do Desenho
            </label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" placeholder="Explique os detalhes do que deseja tatuar (elementos, traço, referências)..." style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'sans-serif', lineHeight: '1.4' }} />
          </div>

          {/* Botão de Envio */}
          <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '14px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}>
            <Send size={18} /> {loading ? 'Enviando Proposta...' : 'Enviar Pedido para Avaliação'}
          </button>

        </form>

      </div>
    </div>
  );
}