import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, User, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { startListening } from '../../services/VoiceService';
import './AIChat.css';

const AIChat = () => {
    const { aiMessages, sendAIMessage } = useApp();
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [aiMessages]);

    const handleListen = () => {
        if (isListening) return;
        setIsListening(true);
        startListening(
            (transcript) => {
                setInput(transcript);
                sendAIMessage(transcript);
                setIsListening(false);
            },
            () => setIsListening(false)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            sendAIMessage(input);
            setInput('');
        }
    };

    const quickCommands = [
        'Turn on all lights',
        'Is the TV on?',
        'Set temperature to 22°C',
        'Help'
    ];

    return (
        <div className="ai-chat-container glass-card">
            <div className="messages-container">
                {aiMessages.length === 0 && (
                    <div className="empty-chat">
                        <Sparkles size={48} className="text-primary opacity-20 mb-md" />
                        <p>How can I help you manage your home today?</p>
                    </div>
                )}
                {aiMessages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.type === 'user' ? 'user-message' : 'ai-message'}`}>
                        <div className="message-avatar">
                            {msg.type === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        <div className="message-bubble">
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-footer">
                <div className="quick-commands">
                    {quickCommands.map((cmd) => (
                        <button
                            key={cmd}
                            className="quick-cmd-btn"
                            onClick={() => sendAIMessage(cmd)}
                        >
                            {cmd}
                        </button>
                    ))}
                </div>

                <form className="chat-input-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type a command..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="button"
                            className={`btn-icon mic-btn ${isListening ? 'listening' : ''}`}
                            onClick={handleListen}
                        >
                            {isListening ? <MicOff size={18} className="animate-pulse" /> : <Mic size={18} />}
                        </button>
                    </div>
                    <button type="submit" className="btn-icon btn-primary send-btn" disabled={!input.trim()}>
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChat;
