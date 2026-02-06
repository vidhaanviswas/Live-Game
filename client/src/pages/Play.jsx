import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getSocket } from '../socket/socket';
import Board from '../components/Board';
import ScorePanel from '../components/ScorePanel';
import TurnIndicator from '../components/TurnIndicator';
import EndGameModal from '../components/EndGameModal';
import { GAME_CONFIG } from '../gameLogic/config';

export default function Play() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const roomIdFromUrl = searchParams.get('room');
  const locationState = location.state;
  const [inviteLink, setInviteLink] = useState(locationState?.inviteLink || '');
  const [waiting, setWaiting] = useState(!!locationState?.waiting);
  const [joiningRoom, setJoiningRoom] = useState(!!(roomIdFromUrl && !locationState?.room));
  const [leftPlayerId, setLeftPlayerId] = useState(null);

  const {
    mode,
    roomId,
    room,
    deck,
    flippedIndices,
    scores,
    currentPlayerIndex,
    playerNames,
    myPlayerIndex,
    gameOver,
    connected,
    initOnline,
    syncFromRoom,
    setFlippedIndices,
    setConnected,
    reset,
  } = useGameStore();

  const socket = getSocket();
  const canFlip = useMemo(() => {
    if (mode !== 'online' || gameOver) return false;
    if (deck.length && myPlayerIndex !== null && room?.currentTurnPlayerIndex !== myPlayerIndex) return false;
    return flippedIndices.length < 2;
  }, [mode, gameOver, deck.length, myPlayerIndex, room?.currentTurnPlayerIndex, flippedIndices.length]);

  useEffect(() => {
    setConnected(socket.connected);
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [setConnected, socket]);

  useEffect(() => {
    if (locationState?.room) {
      initOnline(locationState.room, locationState.isHost ? 0 : 1);
      setInviteLink(locationState.inviteLink || '');
      setWaiting(!!locationState.waiting);
      setJoiningRoom(false);
      return;
    }

    if (!roomIdFromUrl) {
      if (!roomId) navigate('/online');
      return;
    }

    if (!roomId || roomId !== roomIdFromUrl) {
      setJoiningRoom(true);
      const joinRoom = () => {
        socket.emit('join-room', { roomId: roomIdFromUrl, playerName: 'Guest' }, (res) => {
          setJoiningRoom(false);
          if (res?.error) {
            navigate('/online');
            return;
          }
          initOnline(res.room, 1);
        });
      };

      if (socket.connected) {
        joinRoom();
      } else {
        socket.once('connect', joinRoom);
      }
    }
  }, [roomIdFromUrl, locationState, roomId, socket, initOnline, navigate]);

  useEffect(() => {
    socket.on('room-update', (updatedRoom) => {
      syncFromRoom(updatedRoom);
      if (updatedRoom.players?.length >= 2) setWaiting(false);
    });
    socket.on('game-started', (updatedRoom) => {
      syncFromRoom(updatedRoom);
      setWaiting(false);
    });
    socket.on('game-state', ({ room: updatedRoom, match, flipBack, gameOver: over }) => {
      syncFromRoom(updatedRoom);
      if (flipBack?.length) {
        setFlippedIndices(flipBack);
        setTimeout(() => setFlippedIndices([]), GAME_CONFIG.flipDelay);
      }
    });
    socket.on('player-left', ({ room: updatedRoom, leftPlayerId: id }) => {
      setLeftPlayerId(id);
      syncFromRoom(updatedRoom);
    });
    return () => {
      socket.off('room-update');
      socket.off('game-started');
      socket.off('game-state');
      socket.off('player-left');
    };
  }, [syncFromRoom, setFlippedIndices]);

  const handleFlip = (cardIndex) => {
    if (mode !== 'online' || !roomId || myPlayerIndex === null) return;
    socket.emit('flip-card', { roomId, cardIndex }, (res) => {
      if (res?.error) return;
      syncFromRoom(res.room);
      if (res.flipBack?.length) {
        setFlippedIndices(res.flipBack);
        setTimeout(() => setFlippedIndices([]), GAME_CONFIG.flipDelay);
      }
    });
  };

  const winnerIndex = room?.status === 'finished' && scores?.length
    ? (room?.winnerByDisconnect
      ? room.players?.findIndex((p) => p.id === room.winnerByDisconnect)
      : (() => {
        const maxScore = Math.max(...scores);
        const winnersCount = scores.filter((s) => s === maxScore).length;
        return winnersCount === 1 ? scores.indexOf(maxScore) : -1; // -1 for tie
      })())
    : null;
  const winnerName = winnerIndex != null && winnerIndex !== -1 ? playerNames[winnerIndex] : null;
  const message = gameOver
    ? (room?.winnerByDisconnect ? 'Opponent left. You win!' : leftPlayerId ? 'Opponent disconnected.' : winnerIndex === -1 ? "It's a tie!" : winnerName ? `${winnerName} wins!` : 'Game over.')
    : '';

  if (!deck.length && !waiting && !joiningRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-slate-400">Preparing room…</p>
      </div>
    );
  }

  if (joiningRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-slate-400">Joining room…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 font-display">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <Link to="/" className="text-slate-400 hover:text-white text-sm">← Home</Link>
          <span className={`text-xs ${connected ? 'text-emerald-400' : 'text-red-400'}`}>
            {connected ? '● Connected' : '○ Disconnected'}
          </span>
        </div>

        {waiting && (
          <div className="text-center py-8 rounded-xl bg-slate-800/80 border border-slate-600 mb-4">
            <p className="text-amber-400 font-medium">Waiting for opponent…</p>
            <p className="text-slate-400 text-sm mt-2">Share the link or wait for a random match.</p>
          </div>
        )}

        {inviteLink && (
          <div className="mb-4 p-3 rounded-xl bg-slate-800/80 border border-slate-600">
            <p className="text-slate-400 text-xs mb-1">Invite link</p>
            <p className="text-violet-300 text-sm break-all select-all">{inviteLink}</p>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(inviteLink)}
              className="mt-2 text-xs text-violet-400 hover:text-violet-300"
            >
              Copy link
            </button>
          </div>
        )}

        <h2 className="text-xl font-semibold text-center text-slate-200 mb-2">Online Match</h2>
        <TurnIndicator currentPlayerIndex={currentPlayerIndex} playerNames={playerNames} />
        <ScorePanel
          playerNames={playerNames}
          scores={scores}
          currentPlayerIndex={currentPlayerIndex}
          mode="online"
        />
        <Board
          deck={deck}
          flippedIndices={flippedIndices}
          canFlip={canFlip}
          onFlip={handleFlip}
        />
        <EndGameModal
          open={gameOver}
          title="Game Over"
          message={message}
          winnerName={winnerName}
          scores={scores}
          onClose={() => { reset(); navigate('/online'); }}
          onPlayAgain={() => { reset(); navigate('/online'); }}
        />
      </div>
    </div>
  );
}
