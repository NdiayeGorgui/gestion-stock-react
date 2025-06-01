import React, { useState, useEffect, useRef } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isListening, setIsListening] = useState(false);

  const chatWindowRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setUserMessage(transcript);
        sendMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    chatWindowRef.current?.scrollTo(0, chatWindowRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = (text = userMessage.trim()) => {
    if (!text) return;
    const newMessages = [...messages, { from: 'user', text }];
    setMessages(newMessages);
    setUserMessage('');

    setTimeout(() => {
      setMessages([...newMessages, { from: 'bot', text: `Tu as dit : "${text}".` }]);
    }, 700);
  };

  const startVoiceInput = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert("Reconnaissance vocale non supportée");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <i className="material-icons me-2">smart_toy</i> Chat Bot
        </div>
        <div className="card-body">
          {/* Zone des messages */}
          <div
            className="chat-window mb-3 border rounded p-3 bg-light"
            style={{ height: '300px', overflowY: 'auto' }}
            ref={chatWindowRef}
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 text-${msg.from === 'user' ? 'end' : 'start'}`}>
                <span className={`badge bg-${msg.from === 'user' ? 'primary' : 'secondary'}`}>
                  {msg.from === 'user' ? 'Moi' : 'Bot'}
                </span>
                <div className={`mt-1 p-2 rounded ${msg.from === 'user' ? 'bg-primary text-white' : 'bg-white border'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Entrée message + boutons */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="d-flex align-items-center"
          >
            <input
              type="text"
              className="form-control me-2"
              placeholder="Write your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary me-2">
              <i className="material-icons">send</i>
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={startVoiceInput} disabled={isListening}>
              <i className="material-icons">{isListening ? 'mic_off' : 'mic'}</i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
