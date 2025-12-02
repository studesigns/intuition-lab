import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import VoPlayer from './pages/vo-player';
import Compliance from './pages/compliance';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vo-player" element={<VoPlayer />} />
        <Route path="/compliance" element={<Compliance />} />
      </Routes>
    </Router>
  );
}

export default App;
