import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Calendar, DollarSign, TrendingUp, User, Keyboard, LogOut,
  CheckCircle, XCircle, Clock, FileText, Eye, DollarSign as DollarIcon
} from 'lucide-react';
import api from '../../services/api'; // Conectado à porta 7053
import { useAuth } from '../../context/AuthContext'; 

export default function ArtistDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const { logout } = useAuth(); 

  // Estados do Painel abastecidos pela API
  const [metrics, setMetrics] = useState({ totalSessions: 0, estimatedRevenue: 0 });
  const [chartData, setChartData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  const [currentArtistId, setCurrentArtistId] = useState(null);
  const [loading, setLoading] = useState(true); 

  // Estado para o Filtro de Ano do Gráfico
  const [selectedYear, setSelectedYear] = useState(2026);

  // Estados para o Modal de Detalhes e Orçamento
  const [selectedApp, setSelectedApp] = useState(null);
  const [priceInput, setPriceInput] = useState('');

  // Localidade para formaturamento de moeda
  const currentLang = i18n.language === 'en' ? 'en-US' : 'pt-BR';
  const currentCurrency = i18n.language === 'en' ? 'USD' : 'BRL';

  // CARGA DE DADOS DO BANCO (READ)
  const loadDashboardData = async () => {
    const loggedInUserId = localStorage.getItem('userId');
    if (!loggedInUserId) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);

      // 1. Resolve a relação na tabela de Tatuadores
      const artistListRes = await api.get('TattooArtist');
      const artistsData = artistListRes.data || [];
      
      const myArtistProfile = artistsData.find(a => String(a.userId) === String(loggedInUserId));
      const artistIdForQuery = myArtistProfile ? myArtistProfile.id : loggedInUserId;
      
      setCurrentArtistId(artistIdForQuery);

      // 2. Busca os agendamentos associados ao ID real de Tatuador
      const appRes = await api.get(`/Appointment/artist/${artistIdForQuery}`);
      const artistApps = appRes.data || [];

      const formattedApps = artistApps.map(app => {
        let normalizedStatus = 'Pending';
        const rawStatus = app.status !== undefined && app.status !== null ? app.status.toString().trim() : '';

        // Ajustado de acordo com o AppointmentStatus do seu C#
        if (rawStatus === '1' || rawStatus.toLowerCase() === 'requested' || rawStatus.toLowerCase() === 'pending') {
          normalizedStatus = 'Pending';
        } else if (rawStatus === '2' || rawStatus.toLowerCase() === 'confirmed') {
          normalizedStatus = 'Confirmed';
        } else if (rawStatus === '3' || rawStatus.toLowerCase() === 'canceled' || rawStatus.toLowerCase() === 'declined') {
          normalizedStatus = 'Declined';
        }

        // TRATAMENTO LITERAL DA DATA/HORA PARA BANIR O FUSO HORÁRIO
        const rawDateTimeStr = app.dateTime ? String(app.dateTime) : '';
        let finalDate = '';
        let finalTime = '00:00';

        if (rawDateTimeStr.includes('T')) {
          const parts = rawDateTimeStr.split('T');
          finalDate = parts[0]; 
          finalTime = parts[1]?.substring(0, 5) || '00:00';
        } else if (rawDateTimeStr.includes(' ')) {
          const parts = rawDateTimeStr.split(' ');
          finalDate = parts[0];
          finalTime = parts[1]?.substring(0, 5) || '00:00';
        }

        return {
          id: app.id,
          client: app.client?.user?.name || app.client?.name || 'Cliente do Estúdio',
          date: finalDate,
          time: finalTime,
          status: normalizedStatus, 
          style: app.style || 'Livre',
          bodyPart: app.bodyPart || 'A definir',
          sizeCm: app.sizeCm || 'N/A',
          description: app.notes || '',
          price: app.estimatedPrice || 0,
          clientId: app.clientId,
          artistId: app.artistId
        };
      });

      setAppointments(formattedApps);

      const confirmedSessions = formattedApps.filter(a => a.status === 'Confirmed');
      const totalRevenue = confirmedSessions.reduce((sum, a) => sum + a.price, 0);

      setMetrics({
        totalSessions: formattedApps.length,
        estimatedRevenue: totalRevenue
      });

      // PROCESSAMENTO DO GRÁFICO FILTRADO POR ANO (SEM NEW DATE CONVERTENDO FUSO)
      const monthsMap = [
        t('months.jan', 'Jan'), t('months.feb', 'Fev'), t('months.mar', 'Mar'), 
        t('months.apr', 'Abr'), t('months.may', 'Mai'), t('months.jun', 'Jun'),
        t('months.jul', 'Jul'), t('months.aug', 'Ago'), t('months.sep', 'Set'),
        t('months.oct', 'Out'), t('months.nov', 'Nov'), t('months.dec', 'Dez')
      ];

      const countsByMonth = Array(12).fill(0);
      
      formattedApps.forEach(app => {
        if (app.date) {
          const dateParts = app.date.split('-'); // [YYYY, MM, DD]
          if (dateParts.length === 3) {
            const appYear = parseInt(dateParts[0], 10);
            const appMonth = parseInt(dateParts[1], 10) - 1; // Meses no JS são base 0
            
            if (appYear === selectedYear) {
              countsByMonth[appMonth]++;
            }
          }
        }
      });

      const generatedChart = monthsMap.map((monthName, index) => ({
        month: monthName,
        agendamentos: countsByMonth[index]
      })); 

      setChartData(generatedChart);

    } catch (error) {
      console.error("Erro ao carregar dados do painel do artista:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, selectedYear]);

  const handleSystemLogout = () => {
    if (window.confirm(t('artist_dashboard.confirm_logout', 'Deseja realmente sair do sistema?'))) {
      logout(); 
      navigate('/login'); 
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleSystemLogout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openDetailsModal = (app) => {
    setSelectedApp(app);
    setPriceInput(app.price > 0 ? app.price.toString() : '');
  };

  // APROVAR AGENDAMENTO CORRIGIDO
  const handleAcceptWithPrice = async (e) => {
    e.preventDefault();
    if (!priceInput || parseFloat(priceInput) <= 0) {
      alert(t('artist_dashboard.alert_invalid_price', 'Insira um valor válido para o orçamento.'));
      return;
    }

    const finalPrice = parseFloat(priceInput);

    try {
      setLoading(true);
      
      // Montagem da string mantendo o padrão textual estrito
      const localDateTime = `${selectedApp.date}T${selectedApp.time}:00`;

      // 1. Atualiza primeiro os dados financeiros do orçamento (Body)
      await api.put(`/Appointment/${selectedApp.id}`, {
        dateTime: localDateTime,
        estimatedPrice: finalPrice,
        notes: selectedApp.description
      });

      // 2. Altera o status para confirmado enviando o número correspondente (2 = Confirmed)
      await api.put(`/Appointment/${selectedApp.id}/status?status=2`);

      alert(t('artist_dashboard.alert_confirmed_success', 'Agendamento confirmado com sucesso!'));
      setSelectedApp(null);
      loadDashboardData(); 
    } catch (error) {
      console.error("Erro ao confirmar agendamento no back-end:", error);
      const apiMessage = error.response?.data?.message || "Erro de comunicação.";
      alert(`Erro ao salvar confirmação. Detalhe: ${apiMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // RECUSAR AGENDAMENTO
  const handleDecline = async (id) => {
    if (!window.confirm(t('artist_dashboard.confirm_decline', 'Deseja recusar esta solicitação?'))) {
      return;
    }

    try {
      setLoading(true);

      // Altera o status para cancelado enviando o número correspondente (3 = Canceled)
      await api.put(`/Appointment/${id}/status?status=3`);

      alert(t('artist_dashboard.alert_declined_success', 'Solicitação recusada com sucesso!'));
      setSelectedApp(null);
      loadDashboardData(); 
    } catch (error) {
      console.error("Erro ao recusar agendamento no back-end:", error);
      const apiMessage = error.response?.data?.message || "Erro de comunicação.";
      alert(`Não foi possível recusar o pedido. Detalhe: ${apiMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar de renderização local para evitar o bug do objeto Date do JavaScript
  const formatLocalDateString = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // Retorna DD/MM/YYYY puramente via string
    }
    return dateStr;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: 'bold' }}>
              {t('artist_dashboard.title', 'Painel do Tatuador')} {currentArtistId ? `#${currentArtistId}` : ''}
            </h1>
            <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>{t('artist_dashboard.subtitle', 'Gerencie seus pedidos de tatuagem e faturamento')}</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => navigate('/artist/profile')}
              style={{ padding: '10px 18px', backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <User size={18} color="#8b5cf6" /> {t('artist_dashboard.btn_profile', 'Meu Perfil')}
            </button>
            
            <button 
              onClick={handleSystemLogout}
              style={{ padding: '10px 18px', backgroundColor: '#1a1a1a', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
            >
              <LogOut size={18} /> {t('artist_dashboard.btn_logout', 'Sair')}
            </button>
          </div>
        </div>

        {/* CARDS DE MÉTRICAS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', padding: '20px', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '8px' }}><Calendar size={24} color="#8b5cf6" /></div>
            <div>
              <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>{t('artist_dashboard.metric_sessions', 'Total de Solicitações')}</p>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{metrics.totalSessions}</h2>
            </div>
          </div>
          <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', padding: '20px', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '8px' }}><DollarSign size={24} color="#10b981" /></div>
            <div>
              <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>{t('artist_dashboard.metric_revenue', 'Faturamento Confirmado')}</p>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                {metrics.estimatedRevenue.toLocaleString(currentLang, { style: 'currency', currency: currentCurrency })}
              </h2>
            </div>
          </div>
        </div>

        {/* GRÁFICO */}
        <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', padding: '25px', border: '1px solid #333', opacity: loading ? 0.6 : 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={20} color="#8b5cf6" /> {t('artist_dashboard.chart_title', 'Evolução Mensal de Atendimentos')}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="year-select" style={{ fontSize: '13px', color: '#aaa' }}>{t('artist_dashboard.year_label', 'Ano:')}</label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={{ backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
              </select>
            </div>
          </div>

          <div style={{ width: '100%', height: 320, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="month" stroke="#666" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" fontSize={12} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#2a2a2a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="agendamentos" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LISTA DE ATENDIMENTOS */}
        <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
          <div style={{ padding: '20px 25px', borderBottom: '1px solid #333' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="#8b5cf6" /> {t('artist_dashboard.list_title', 'Pedidos Recebidos')}
            </h3>
          </div>
          
          <div style={{ padding: '10px 15px' }}>
            {loading ? (
              <p style={{ padding: '30px', color: '#aaa', textAlign: 'center' }}>Carregando dados da sua agenda...</p>
            ) : appointments.length === 0 ? (
              <p style={{ padding: '30px', color: '#666', textAlign: 'center' }}>{t('artist_dashboard.no_appointments', 'Nenhuma solicitação encontrada na sua agenda.')}</p>
            ) : (
              [...appointments].sort((a, b) => (a.status === 'Pending' ? -1 : b.status === 'Pending' ? 1 : 0)).map(app => (
                <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 15px', borderBottom: '1px solid #262626' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 'bold' }}>{app.client}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px', fontSize: '13px', color: '#aaa' }}>
                      <span>{formatLocalDateString(app.date)} {t('artist_dashboard.at', 'às')} {app.time}</span>
                      <span style={{ backgroundColor: '#262626', color: '#8b5cf6', padding: '3px 10px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px' }}>
                        {app.style} ({app.sizeCm}cm)
                      </span>
                      {app.price > 0 && app.status === 'Confirmed' && (
                        <span style={{ color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {t('artist_dashboard.budget_label', 'Orçamento')}: {app.price.toLocaleString(currentLang, { style: 'currency', currency: currentCurrency })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {app.status === 'Pending' ? (
                      <button 
                        onClick={() => openDetailsModal(app)} 
                        style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <Eye size={16} /> {t('artist_dashboard.btn_analyze', 'Avaliar Idéia')}
                      </button>
                    ) : app.status === 'Confirmed' ? (
                      <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '10px' }}>
                        <CheckCircle size={18} /> {t('artist_dashboard.status_confirmed', 'Confirmado')}
                      </span>
                    ) : (
                      <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '10px' }}>
                        <XCircle size={18} /> {t('artist_dashboard.status_declined', 'Recusado')}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODAL DE ANÁLISE */}
        {selectedApp && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', width: '100%', maxWidth: '550px', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{t('artist_dashboard.modal_title', 'Detalhes da Solicitação')}</h3>
                  <p style={{ margin: '4px 0 0 0', color: '#aaa', fontSize: '13px' }}>
                    {t('artist_dashboard.modal_requested_by', 'Enviado por:') } <strong>{selectedApp.client}</strong>
                  </p>
                </div>
                <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '24px', cursor: 'pointer', lineHeight: '20px' }}>&times;</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: '#121212', padding: '15px', borderRadius: '6px', border: '1px solid #2a2a2a' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '2px' }}>{t('artist_dashboard.modal_style', 'Estilo')}</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#8b5cf6' }}>{selectedApp.style}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '2px' }}>{t('artist_dashboard.modal_size', 'Tamanho')}</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedApp.sizeCm} cm</span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '2px' }}>{t('artist_dashboard.modal_body_part', 'Localização do Corpo')}</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedApp.bodyPart}</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <FileText size={14} /> {t('artist_dashboard.modal_description_label', 'Conceito da Tatuagem')}
                </span>
                <p style={{ margin: 0, fontSize: '14px', color: '#ccc', backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '6px', lineHeight: '1.4', fontStyle: 'italic' }}>
                  "{selectedApp.description || 'Nenhuma nota adicional informada.'}"
                </p>
              </div>

              <form onSubmit={handleAcceptWithPrice} style={{ borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarIcon size={16} /> {t('artist_dashboard.modal_price_label', 'Definir Preço Cobrado')}
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="1"
                    placeholder="Ex: 450.00"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    required
                    style={{ padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '16px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" style={{ padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                    {t('artist_dashboard.modal_btn_accept', 'Aprovar e Enviar Valor')}
                  </button>
                  <button type="button" onClick={() => handleDecline(selectedApp.id)} style={{ padding: '12px', backgroundColor: '#2a2a2a', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                    {t('artist_dashboard.modal_btn_decline', 'Recusar Pedido')}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* Rodapé */}
        <div style={{ borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '12px', marginBottom: '20px' }}>
          <Keyboard size={14} />
          <span>
            <strong>{t('artist_dashboard.footer_shortcuts', 'Atalhos de Teclado')}:</strong> <kbd style={{ background: '#222', padding: '2px 5px', borderRadius: '3px' }}>Alt + P</kbd> {t('artist_dashboard.footer_profile', 'Perfil')} | <kbd style={{ background: '#222', padding: '2px 5px', borderRadius: '3px' }}>Alt + L</kbd> <span onClick={handleSystemLogout} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{t('artist_dashboard.footer_logout', 'Sair')}</span>
          </span>
        </div>

      </div>
    </div>
  );
}