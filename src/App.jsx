import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import VoPlayer from './pages/vo-player';
import Compliance from './pages/compliance';
import VisualVault from './pages/visual-vault';
import VisualVaultAdmin from './pages/visual-vault-admin';
import InactivityWarning from './components/InactivityWarning';
import VersionCheck from './components/VersionCheck';
import { VoiceProvider } from './context/VoiceContext';
import { VideoProvider } from './context/VideoContext';
import './App.css';

function App() {
  return (
    <VoiceProvider>
      <VideoProvider>
        <InactivityWarning />
        <VersionCheck />
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vo-player" element={<VoPlayer />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/visual-vault" element={<VisualVault />} />
            <Route path="/visual-vault/admin" element={<VisualVaultAdmin />} />
          </Routes>
        </Router>
      </VideoProvider>
    </VoiceProvider>
  );
}

export default App;
