import Header from '../components/layout/Header';
import AIChat from '../components/common/AIChat';
import { Mic, Music, Home, Sparkles } from 'lucide-react';
import './AIAssistant.css';

const AIAssistant = () => {
    const features = [
        {
            icon: <Mic className="text-primary" />,
            title: "Voice Control",
            description: "Natural language commands for zero-touch management."
        },
        {
            icon: <Music className="text-secondary" />,
            title: "Music & Media",
            description: "Seamless playback across all your smart speakers."
        },
        {
            icon: <Home className="text-accent" />,
            title: "Scenarios",
            description: "Complex automation triggered by simple phrases."
        }
    ];

    return (
        <div className="ai-assistant-page">
            <Header
                title="AI Assistant"
                subtitle="Your hub's neural core for automated living"
                actions={<div className="ai-status"><span className="status-dot pulsing"></span> Online</div>}
            />

            <div className="ai-layout">
                <div className="ai-main">
                    <AIChat />
                </div>

                <aside className="ai-sidebar">
                    <div className="sidebar-section glass-card">
                        <h3>Capabilities</h3>
                        <div className="feature-grid">
                            {features.map((f, i) => (
                                <div key={i} className="feature-item">
                                    <div className="feature-icon-wrapper">
                                        {f.icon}
                                    </div>
                                    <div className="feature-info">
                                        <h4>{f.title}</h4>
                                        <p>{f.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-section glass-card promo-card">
                        <Sparkles className="promo-icon" />
                        <h4>Pro Tip</h4>
                        <p>Try saying "Set the mood for a movie" to trigger Lighting and TV simultaneously.</p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AIAssistant;
