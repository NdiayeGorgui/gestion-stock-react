import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const isVoiceModeRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  const chatWindowRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialisation reconnaissance vocale
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setUserMessage(transcript);
        isVoiceModeRef.current = true;
        setIsVoiceMode(true);
        sendMessage(transcript, true);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    chatWindowRef.current?.scrollTo(0, chatWindowRef.current.scrollHeight);
  }, [messages, isLoading]);

  // Nettoyage Markdown
  const stripMarkdown = (text) =>
    text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/#+\s?(.*)/g, '$1')
      .replace(/> (.*)/g, '$1')
      .replace(/[-*+]\s+/g, '')
      .replace(/`/g, '')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/\r?\n|\r/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

  // Synthèse vocale
  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(stripMarkdown(text));
    utter.lang = 'fr-FR';
    utter.rate = 1;
    utter.pitch = 1;

    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => {
      setIsSpeaking(false);
      console.warn('Erreur lors de la synthèse vocale.');
    };

    const assignVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const frVoice =
        voices.find((v) => v.lang === 'fr-FR') ||
        voices.find((v) => v.lang?.startsWith('fr'));
      if (frVoice) utter.voice = frVoice;
      window.speechSynthesis.speak(utter);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      const handler = () => {
        assignVoiceAndSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
      window.speechSynthesis.onvoiceschanged = handler;
    } else {
      assignVoiceAndSpeak();
    }
  };

  // Envoi message avec streaming
  const sendMessage = async (textParam, voice = false) => {
    const text = (textParam ?? userMessage).trim();
    if (!text) return;

    const updated = [...messages, { from: 'user', text }];
    setMessages(updated);
    setUserMessage('');
    setIsLoading(true);

    const botMessage = { from: 'bot', text: '' };
    setMessages((prev) => [...prev, botMessage]);

    try {
      const response = await fetch(
        `http://localhost:8866/api/v1/chat?query=${encodeURIComponent(text)}`
      );
      if (!response.body) throw new Error('Pas de streaming disponible');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botReply = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        botReply += chunk;

        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { from: 'bot', text: botReply };
          return newMsgs;
        });
      }

      if ((voice || isVoiceModeRef.current) && botReply.trim()) {
        speak(botReply);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = '⚠️ Erreur lors de l’appel au serveur.';
      setMessages((prev) => [...prev, { from: 'bot', text: errorMsg }]);
      if (voice || isVoiceModeRef.current) speak(errorMsg);
    } finally {
      setIsLoading(false);
      isVoiceModeRef.current = false;
      setIsVoiceMode(false);
    }
  };

  const startVoiceInput = () => {
    if (recognitionRef.current) {
      isVoiceModeRef.current = true;
      setIsVoiceMode(true);
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert('🎙️ La reconnaissance vocale n’est pas supportée par votre navigateur.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <i className="material-icons me-2">{t('Chat')}</i>
        </div>
        <div className="card-body">
          <div
            className="chat-window mb-3 border rounded p-3 bg-light"
            style={{ height: '300px', overflowY: 'auto' }}
            ref={chatWindowRef}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 text-${msg.from === 'user' ? 'end' : 'start'}`}>
                <span className={`badge bg-${msg.from === 'user' ? 'primary' : 'secondary'}`}>
                  {msg.from === 'user' ? t('Me') : t('Bot')}
                </span>
                <div className={`mt-1 p-2 rounded ${msg.from === 'user' ? 'bg-primary text-white' : 'bg-white border'}`}>
                  {msg.from === 'bot' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}

            {/* ✅ Effet "Bot typing..." inséré dans la conversation */}
            {isLoading && (
              <div className="mb-2 text-start">
                <span className="badge bg-secondary"></span>
                <div className="mt-1 p-2 rounded bg-light border typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="d-flex align-items-center"
          >
            <input
              type="text"
              className="form-control me-2"
              placeholder={t('Message')}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary me-2">
              <i className="material-icons">{t('send')}</i>
            </button>
            <button
              type="button"
              className="btn btn-outline-danger me-2"
              onClick={startVoiceInput}
              disabled={isListening}
              title="Parler"
            >
              <i className="material-icons">{isListening ? 'mic_off' : 'mic'}</i>
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => window.speechSynthesis.cancel()}
              disabled={!isSpeaking}
              title="Couper la voix"
            >
              <i className="material-icons">{t('volume_off')}</i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
