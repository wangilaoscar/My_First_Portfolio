import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
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
        <div className="ai-chat glass-card">
            <div className="chat-messages">
                {aiMessages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.type}`}>
                        <div className="message-content">
                            {msg.text}
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
                            className="btn btn-secondary btn-sm"
                            onClick={() => sendAIMessage(cmd)}
                        >
                            {cmd}
                        </button>
                    ))}
                </div>

                <form className="chat-input" onSubmit={handleSubmit}>
                    <button
                        type="button"
                        className={`btn-icon mic-btn ${isListening ? 'listening' : 'btn-secondary'}`}
                        onClick={handleListen}
                    >
                        {isListening ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
                    </button>
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" className="btn-icon btn-primary send-btn" disabled={!input.trim()}>
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChat;
