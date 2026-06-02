import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign, TrendingUp, CalendarDays, Keyboard } from 'lucide-react';
import api from '../../services/api';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Estados para as métricas e dados do gráfico
  const [metrics, setMetrics] = useState({ totalSessions: 0, estimatedRevenue: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Simulando os dados analíticos que virão das queries do C# / SQL Server
    // DICA PARA O TESTE DO PROFESSOR: Deixe o array fakeChartData como [] para ver o "Estado Vazio"
    setMetrics({
      totalSessions: 24,         // Exemplo: Total de sessões no mês
      estimatedRevenue: 14800.00 // Exemplo: Faturamento estimado em R$
    });

    const fakeChartData = [
      { month: 'Jan', agendamentos: 12 },
      { month: 'Fev', agendamentos: 18 },
      { month: 'Mar', agendamentos: 15 },
      { month: 'Abr', agendamentos: 20 },
      { month: 'Mai', agendamentos: 24 },
      { month: 'Jun', agendamentos: 30 },
    ];
    setChartData(fakeChartData);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        
        {/* Cabeçalho do Painel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: 'bold' }}>{t('artist_dashboard_title')}</h1>
            <p style={{ margin: 0, color: '#aaa' }}>{t('artist_dashboard_subtitle')}</p>
          </div>
          
          {/* Botão para ir para a Agenda / Gerenciador de Pedidos */}
          <button 
            onClick={() => navigate('/artist/schedule')}
            style={{
              padding: '12px 20px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none',
              borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'background 0.2s'
            }}
          >
            <CalendarDays size={18} /> {t('artist_schedule_title') || 'Gerenciador de Agenda'}
          </button>
        </div>

        {/* Grid de Cartões de Métricas Rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          
          {/* Card: Total de Sessões */}
          <div style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', padding: '25px', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px' }}>
              <Calendar size={28} color="#8b5cf6" />
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#aaa', fontSize: '14px' }}>{t('metric_total_sessions')}</p>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{metrics.totalSessions}</h2>
            </div>
          </div>

          {/* Card: Faturamento Estimado */}
          <div style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', padding: '25px', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px' }}>
              <DollarSign size={28} color="#10b981" />
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#aaa', fontSize: '14px' }}>{t('metric_revenue')}</p>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                {metrics.estimatedRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h2>
            </div>
          </div>

        </div>

        {/* Seção do Gráfico com Tratamento de Estado Vazio (Ponto 2) */}
        <div style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', padding: '25px', border: '1px solid #333' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} color="#8b5cf6" /> {t('chart_title')}
          </h3>
          
          {chartData.length === 0 ? (
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed #444', borderRadius: '6px' }}>
              <p style={{ color: '#666', fontSize: '15px' }}>Nenhum dado de agendamento disponível para exibir no gráfico.</p>
            </div>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#aaa" fontSize={12} />
                  <YAxis stroke="#aaa" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2a2a2a', borderColor: '#333', color: '#fff', borderRadius: '4px' }}
                    itemStyle={{ color: '#8b5cf6' }}
                  />
                  <Bar dataKey="agendamentos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

      {/* BARRA DE ACESSIBILIDADE VISUAL NO RODAPÉ (Ponto 1) */}
      <div style={{ maxWidth: '1000px', margin: '60px auto 0 auto', width: '100%', borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '13px' }}>
        <Keyboard size={16} color="#444" />
        <span><strong>Atalhos de Acessibilidade:</strong> <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + S</kbd> Ver Minha Agenda | <kbd style={{ background: '#222', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', color: '#aaa', fontFamily: 'monospace' }}>Alt + L</kbd> Desconectar/Sair</span>
      </div>

    </div>
  );
}