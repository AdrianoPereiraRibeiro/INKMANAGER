import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Scissors, Maximize2, MapPin, AlignLeft, Send } from 'lucide-react';
import api from '../../services/api'; // Conectado à porta 7053

export default function AppointmentForm() {
  const { t } = useTranslation();
  const { artistId } = useParams(); // Pega o ID do artista pela URL da rota
  const navigate = useNavigate();

  // Estados do formulário
  const [artistName, setArtistName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [style, setStyle] = useState('Realismo');
  const [sizeCm, setSizeCm] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Busca detalhes do artista para exibir no cabeçalho do formulário
  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        if (artistId) {
          const res = await api.get(`/Artist/${artistId}`);
          setArtistName(res.data?.user?.name || res.data?.name || artistId);
        }
      } catch (err) {
        console.warn("Não foi possível carregar os detalhes do artista individual:", err);
        setArtistName(artistId || "Profissional");
      }
    };
    fetchArtistDetails();
  }, [artistId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações básicas antes do envio
    const clientId = localStorage.getItem('userId');
    if (!clientId) {
      alert("Você precisa estar logado como cliente para enviar uma solicitação.");
      navigate('/login');
      return;
    }

    if (!date || !time) {
      alert("Por favor, selecione uma data e um horário válidos.");
      return;
    }

    try {
      setSubmitting(true);

      // CORREÇÃO DA DATA: Garante a conversão do formato do input (YYYY-MM-DD) para ISO string aceita pelo C# DateTime
      const formattedDateTime = new Date(`${date}T${time}:00`).toISOString();

      // Montagem estrita do payload JSON esperado pelo back-end
      const payload = {
        clientId: parseInt(clientId, 10),                 // Garante tipo numérico inteiro
        artistId: parseInt(artistId || clientId, 10),      // Garante tipo numérico inteiro
        dateTime: formattedDateTime,                       // Formato correto ISO (Ex: "2027-10-29T18:30:00.000Z")
        style: style,
        sizeCm: sizeCm ? parseInt(sizeCm, 10) : 0,         // Garante envio como número puro pro banco
        bodyPart: bodyPart.trim(),
        notes: notes.trim(),
        status: 0                                          // 0 equivale ao status inicial "Pending" / "Requested" no enum
      };

      // Chamada POST para criação do registro
      await api.post('/Appointment', payload);

      alert("Solicitação enviada com sucesso! Aguarde a avaliação do tatuador.");
      navigate('/customer/dashboard'); // Redireciona de volta ao painel do cliente

    } catch (error) {
      console.error("Erro ao salvar agendamento no back-end:", error);
      
      // Detalha o erro 400 do ASP.NET (Validation Errors do ModelState) se houver
      if (error.response && error.response.data) {
        console.error("Detalhes das restrições do C#:", error.response.data);
        alert(`Erro 400: ${JSON.stringify(error.response.data.errors || error.response.data)}`);
      } else {
        alert("Não foi possível enviar a solicitação. Verifique os dados inseridos.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ maxWidth: '650px', width: '100%', backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        
        {/* Cabeçalho */}
        <div style={{ marginBottom: '25px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: 'bold' }}>Solicitar Agendamento</h1>
          <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
            Preencha os detalhes da sua sessão com o profissional <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{artistName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Linha 1: Data e Hora */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#8b5cf6" /> Data Pretendida
              </label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#8b5cf6" /> Horário
              </label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Linha 2: Estilo e Tamanho */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Scissors size={14} color="#8b5cf6" /> Estilo da Tautagem
              </label>
              <select 
                value={style} 
                onChange={(e) => setStyle(e.target.value)}
                style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
              >
                <option value="Realismo">Realismo</option>
                <option value="Blackwork">Blackwork</option>
                <option value="Fine Line">Fine Line</option>
                <option value="Traditional">Traditional / Old School</option>
                <option value="Anime / Geek">Anime / Geek</option>
                <option value="Livre">Outro / Livre</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Maximize2 size={14} color="#8b5cf6" /> Tamanho Estimado (cm)
              </label>
              <input 
                type="number" 
                placeholder="Ex: 15"
                min="1"
                value={sizeCm}
                onChange={(e) => setSizeCm(e.target.value)}
                required
                style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Linha 3: Local do Corpo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#8b5cf6" /> Local do Corpo
            </label>
            <input 
              type="text" 
              placeholder="Ex: Antebraço, Costas, Panturrilha..."
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
              required
              style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none' }}
            />
          </div>

          {/* Linha 4: Descrição da Ideia */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlignLeft size={14} color="#8b5cf6" /> Descrição da Ideia
            </label>
            <textarea 
              rows="4"
              placeholder="Descreva referências, elementos visuais e detalhes sobre o que quer tatuar..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical', lineHeight: '1.4' }}
            />
          </div>

          {/* Botão de Envio */}
          <button 
            type="submit" 
            disabled={submitting}
            style={{ marginTop: '10px', padding: '14px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'background 0.2s', opacity: submitting ? 0.7 : 1 }}
          >
            <Send size={16} /> {submitting ? "Enviando Solicitação..." : "Enviar Solicitação"}
          </button>

        </form>
      </div>
    </div>
  );
}