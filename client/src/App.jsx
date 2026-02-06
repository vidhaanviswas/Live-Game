import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Solo from './pages/Solo';
import Local from './pages/Local';
import Online from './pages/Online';
import Play from './pages/Play';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solo" element={<Solo />} />
        <Route path="/local" element={<Local />} />
        <Route path="/online" element={<Online />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </div>
  );
}
