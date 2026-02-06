import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getSocket } from '../socket/socket';

export default function Online() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const socket = getSocket();

  const handleCreateRoom = () => {
    setError('');
    setCreating(true);
    socket.emit('create-room', playerName || 'Host', (res) => {
      setCreating(false);
      if (res?.error) {
        setError(res.error);
        return;
      }
      const inviteLink = `${window.location.origin}/play?room=${res.roomId}`;
      navigate(`/play?room=${res.roomId}`, { state: { room: res.room, inviteLink, isHost: true } });
    });
  };

  const handleJoinRoom = (e) => {
    e?.preventDefault();
    setError('');
    let id = roomIdInput.trim();
    try {
      if (id.startsWith('http')) {
        const url = new URL(id);
        id = url.searchParams.get('room') || id;
      }
    } catch (_) { }
    if (!id) {
      setError('Enter a room ID or use an invite link.');
      return;
    }
    setJoining(true);
    socket.emit('join-room', { roomId: id.trim(), playerName: playerName || 'Guest' }, (res) => {
      setJoining(false);
      if (res?.error) {
        setError(res.error);
        return;
      }
      navigate('/play', { state: { room: res.room, isHost: false } });
    });
  };

  const handleRandomMatch = () => {
    setError('');
    setJoining(true);
    socket.emit('join-random', playerName || 'Guest', (res) => {
      setJoining(false);
      if (res?.error) {
        setError(res.error);
        return;
      }
      navigate('/play', { state: { room: res.room, waiting: res.waiting } });
    });
  };

  return (
    <div className="min-h-screen p-6 font-display flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <Link to="/" className="text-slate-400 hover:text-white text-sm">← Home</Link>
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Online Multiplayer</h2>
        <p className="text-slate-400 text-sm mb-6">
          Create a room and share the link, or join a random match.
        </p>

        <div className="mb-4">
          <label className="block text-slate-400 text-sm mb-1">Your name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Guest"
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={handleCreateRoom}
            disabled={creating}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold transition"
          >
            {creating ? 'Creating…' : 'Create room & get invite link'}
          </button>
          <button
            type="button"
            onClick={handleRandomMatch}
            disabled={joining}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold transition"
          >
            {joining ? 'Finding match…' : 'Play random match'}
          </button>
        </div>

        <form onSubmit={handleJoinRoom} className="space-y-2">
          <label className="block text-slate-400 text-sm">Join with room ID or invite link</label>
          <input
            type="text"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            placeholder="Paste room ID or full URL"
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={joining}
            className="w-full py-2 rounded-xl bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white font-medium transition"
          >
            Join room
          </button>
        </form>

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
