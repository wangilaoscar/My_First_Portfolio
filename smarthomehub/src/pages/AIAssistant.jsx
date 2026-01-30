import Header from '../components/layout/Header';
import AIChat from '../components/common/AIChat';
import './AIAssistant.css';

const AIAssistant = () => {
    return (
        <div className="ai-assistant-page">
            <Header
                title="AI Assistant"
                subtitle="Control your devices with voice and text commands"
            />

            <div className="ai-container glass-card">
                <AIChat />
            </div>

            <div className="ai-features">
                <div className="feature-card glass-card">
                    <div className="feature-icon">🎤</div>
                    <h4>Voice Control</h4>
                    <p>Use voice commands to control your devices hands-free</p>
                </div>
                <div className="feature-card glass-card">
                    <div className="feature-icon">🎵</div>
                    <h4>Music Playback</h4>
                    <p>Search and play music on your connected speakers</p>
                </div>
                <div className="feature-card glass-card">
                    <div className="feature-icon">🏠</div>
                    <h4>Welcome Home</h4>
                    <p>Automated greeting with custom sounds when you arrive</p>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
