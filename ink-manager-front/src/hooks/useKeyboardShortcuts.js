import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Verifica se a tecla ALT está pressionada
      if (event.altKey) {
        const key = event.key.toLowerCase();

        switch (key) {
          case 'l':
            event.preventDefault();
            
            // 1. Limpa os dados de sessão do localStorage para deslogar de verdade
            localStorage.removeItem('userRole');
            localStorage.removeItem('token'); // Remove o token caso seu app use para autenticação
            
            // 2. Dá o feedback visual para o usuário (Ponto 3 do checklist)
            alert('Sessão encerrada com sucesso!');
            
            // 3. Força o redirecionamento limpando o estado de memória do React
            window.location.href = '/login';
            break;

          case 'c':
            event.preventDefault();
            navigate('/client/catalog');
            break;

          case 'a':
            event.preventDefault();
            navigate('/client/appointments');
            break;

          case 'd':
            event.preventDefault();
            navigate('/artist/dashboard');
            break;

          case 's':
            event.preventDefault();
            navigate('/artist/schedule');
            break;

          default:
            break;
        }
      }
    };

    // Adiciona o ouvinte de evento no navegador
    window.addEventListener('keydown', handleKeyDown);

    // Limpa o ouvinte quando o componente desmanchar (evita vazamento de memória)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
}