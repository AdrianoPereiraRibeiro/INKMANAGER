import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importando os arquivos de tradução JSON
import pt from './locales/pt.json';
import en from './locales/en.json';

i18n
  // Use o detector para capturar o idioma do navegador automaticamente (Critério Obrigatório!)
  .use(LanguageDetector)
  // Passa o i18n para o ecossistema do react-i18next
  .use(initReactI18next)
  // Inicializa o motor de tradução
  .init({
    resources: {
      pt: {
        translation: pt // Envelopa o JSON na chave 'translation' que o i18next busca por padrão
      },
      en: {
        translation: en // Envelopa o JSON na chave 'translation' que o i18next busca por padrão
      }
    },
    // Define o idioma padrão caso o navegador do usuário esteja em uma língua não mapeada (ex: Russo ou Francês)
    fallbackLng: 'pt',
    
    // Configurações do detector de idioma
    detection: {
      // Ordem de prioridade onde ele busca o idioma: 
      // 1º no local storage do navegador, 2º no cookie, 3º na configuração nativa do navegador (navigator)
      order: ['localStorage', 'cookie', 'navigator'],
      // Guarda a escolha/detecção automática no navegador para não precisar recalcular a cada clique
      caches: ['localStorage', 'cookie']
    },
    
    interpolation: {
      escapeValue: false // O React já faz a proteção contra ataques XSS por padrão
    }
  });

export default i18n;