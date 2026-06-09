import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Calendar, DollarSign, TrendingUp, User, Keyboard, 
  CheckCircle, XCircle, Clock, FileText, Eye, DollarSign as DollarIcon
} from 'lucide-react';

export default function ArtistDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Estados do Painel
  const [metrics, setMetrics] = useState({ totalSessions: 0, estimatedRevenue: 0 });
  const [chartData, setChartData] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Estados para o Modal de Detalhes e Orçamento
  const [selectedApp, setSelectedApp] = useState(null);
  const [priceInput, setPriceInput] = useState('');

  useEffect(() => {
    // Dados alinhados com o layout das imagens de referência (image_44709d.png e image_445db9.png)
    setMetrics({ totalSessions: 24, estimatedRevenue: 14800.00 });

    setChartData([
      { month: 'Jan', agendamentos: 12 }, { month: 'Fev', agendamentos: 18 },
      { month: 'Mar', agendamentos: 15 }, { month: 'Abr', agendamentos: 20 },
      { month: 'Mai', agendamentos: 24 }, { month: 'Jun', agendamentos: 30 },
    ]);

    const fakeAppointments = [
      { 
        id: 101, 
        client: 'Cesar Ribeiro', 
        date: '2026-06-14', 
        time: '14:00', 
        status: 'Pending', 
        style: 'Fine Line',
        bodyPart: 'Antebraço Esquerdo',
        sizeCm: '15cm',
        description: 'Quero tatuar um ramo de oliveira com traços bem finos e sem sombreamento pesado. Levo uma foto de referência no dia.',
        price: 0
      },
      { 
        id: 102, 
        client: 'Amanda Costa', 
        date: '2026-06-14', 
        time: '16:30', 
        status: 'Confirmed', 
        style: 'Blackwork',
        bodyPart: 'Panturrilha',
        sizeCm: '20cm',
        description: 'Uma borboleta estilizada em pontilhismo com formas geométricas ao fundo.',
        price: 650.00 
      },
      { 
        id: 103, 
        client: 'Ricardo Mello', 
        date: '2026-06-15', 
        time: '10:00', 
        status: 'Pending', 
        style: 'Realismo',
        bodyPart: 'Fechamento de Costas',
        sizeCm: '40cm',
        description: 'Início do projeto de leão realista com texturas na parte superior das costas.',
        price: 0
      },
    ];
    setAppointments(fakeAppointments);
  }, []);

  const openDetailsModal = (app) => {
    setSelectedApp(app);
    setPriceInput(app.price > 0 ? app.price.toString() : '');
  };

  const handleAcceptWithPrice = (e) => {
    e.preventDefault();
    if (!priceInput || parseFloat(priceInput) <= 0) {
      alert('Por favor, defina um preço válido para a sessão.');
      return;
    }

    const finalPrice = parseFloat(priceInput);

    setAppointments(prev => prev.map(app => 
      app.id === selectedApp.id 
        ? { ...app, status: 'Confirmed', price: finalPrice } 
        : app
    ));

    alert(`Agendamento de ${selectedApp.client} confirmado com o valor de R$ ${finalPrice.toFixed(2)}!`);
    setSelectedApp(null);
  };

  const handleDecline = (id) => {
    if(window.confirm("Tem certeza que deseja recusar este agendamento?")) {
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: 'Declined' } : app));
      setSelectedApp(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: 'bold' }}>Painel do Tatuador</h1>
            <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Gestão de propostas, orçamentos e desempenho do estúdio</p>
          </div>
          <button 
            onClick={() => navigate('/artist/profile')}
            style={{ padding: '10px 18px', backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <User size={18} color="#8b5cf6" /> Meu Perfil
          </button>
        </div>

        {/* 1. CARDS DE MÉTRICAS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', padding: '20px', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '8px' }}><Calendar size={24} color="#8b5cf6" /></div>
            <div>
              <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Sessões no Mês</p>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{metrics.totalSessions}</h2>
            </div>
          </div>
          <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', padding: '20px', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '8px' }}><DollarSign size={24} color="#10b981" /></div>
            <div>
              <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Faturamento Estimado</p>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{metrics.estimatedRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
            </div>
          </div>
        </div>

        {/* 2. GRÁFICO EXPANDIDO (Tamanho máximo no topo) */}
        <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', padding: '25px', border: '1px solid #333' }}>
          <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} color="#8b5cf6" /> Agendamentos por Mês
          </h3>
          {/* Altura esticada para 320px para dar destaque à demanda */}
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="month" stroke="#666" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" fontSize={12} axisLine={false} tickLine={false} domain={[0, 32]} tickCount={5} />
                <Tooltip contentStyle={{ backgroundColor: '#2a2a2a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="agendamentos" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. LISTA DE ATENDIMENTOS ABAIXO (Em tamanho cheio e super detalhada) */}
        <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
          <div style={{ padding: '20px 25px', borderBottom: '1px solid #333' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="#8b5cf6" /> Pedidos e Agendamentos Recebidos
            </h3>
          </div>
          
          <div style={{ padding: '10px 15px' }}>
            {appointments.length === 0 ? (
              <p style={{ padding: '30px', color: '#666', textAlign: 'center' }}>Nenhum pedido recebido até o momento.</p>
            ) : (
              appointments.map(app => (
                <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 15px', borderBottom: '1px solid #262626' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 'bold' }}>{app.client}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px', fontSize: '13px', color: '#aaa' }}>
                      <span>{new Date(app.date).toLocaleDateString('pt-BR')} às {app.time}</span>
                      <span style={{ backgroundColor: '#262626', color: '#8b5cf6', padding: '3px 10px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px' }}>
                        {app.style} ({app.sizeCm})
                      </span>
                      {app.price > 0 && (
                        <span style={{ color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Orçamento: R$ {app.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {app.status === 'Pending' ? (
                      <button 
                        onClick={() => openDetailsModal(app)} 
                        style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#a78bfa'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
                      >
                        <Eye size={16} /> Analisar e Precificar
                      </button>
                    ) : app.status === 'Confirmed' ? (
                      <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '10px' }}>
                        <CheckCircle size={18} /> Confirmado
                      </span>
                    ) : (
                      <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '10px' }}>
                        <XCircle size={18} /> Recusado
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODAL DINÂMICO DE ANÁLISE DETALHADA E ENVIO DE PREÇO */}
        {selectedApp && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', width: '100%', maxWidth: '550px', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Análise do Pedido</h3>
                  <p style={{ margin: '4px 0 0 0', color: '#aaa', fontSize: '13px' }}>Solicitado por: <strong>{selectedApp.client}</strong></p>
                </div>
                <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '24px', cursor: 'pointer', lineHeight: '20px' }}>&times;</button>
              </div>

              {/* Informações estruturais coletadas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: '#121212', padding: '15px', borderRadius: '6px', border: '1px solid #2a2a2a' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '2px' }}>ESTILO SELECIONADO</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#8b5cf6' }}>{selectedApp.style}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '2px' }}>TAMANHO SOLICITADO</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedApp.sizeCm}</span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '2px' }}>LOCAL DO CORPO</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedApp.bodyPart}</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}><FileText size={14} /> Idéia/Descrição do Cliente:</span>
                <p style={{ margin: 0, fontSize: '14px', color: '#ccc', backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '6px', lineHeight: '1.4', fontStyle: 'italic' }}>"{selectedApp.description}"</p>
              </div>

              {/* Form de Retorno de Preço */}
              <form onSubmit={handleAcceptWithPrice} style={{ borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarIcon size={16} /> Definir Preço da Sessão (R$)
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
                    Aceitar e Enviar Preço
                  </button>
                  <button type="button" onClick={() => handleDecline(selectedApp.id)} style={{ padding: '12px', backgroundColor: '#2a2a2a', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                    Recusar Pedido
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* Rodapé de Acessibilidade */}
        <div style={{ borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '12px', marginBottom: '20px' }}>
          <Keyboard size={14} />
          <span><strong>Atalhos do Painel:</strong> <kbd style={{ background: '#222', padding: '2px 5px', borderRadius: '3px' }}>Alt + P</kbd> Perfil | <kbd style={{ background: '#222', padding: '2px 5px', borderRadius: '3px' }}>Alt + L</kbd> Sair</span>
        </div>

      </div>
    </div>
  );
}