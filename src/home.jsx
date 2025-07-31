import { useState, useEffect, useCallback } from "react";
import default_img from "./assets/default.png";
import clicked_img from "./assets/clicked.png";
import result_img from "./assets/result.png";
import { TbClockHour3 } from "react-icons/tb";
import { GiTrophyCup } from "react-icons/gi";
import { BsArrowRepeat } from "react-icons/bs";
import { RiTwitterXFill } from "react-icons/ri";

const GAME_DURATION = 30;
const CLICK_ANIMATION_DURATION = 200;

const FAKE_LEADERBOARD = [
  { name: "bonk_master69", score: 432 },
  { name: "satoshidog", score: 388 },
  { name: "elonclicker", score: 365 },
  { name: "dogewhisperer", score: 342 },
  { name: "bonkzilla", score: 318 },
  { name: "clickdoge", score: 295 },
  { name: "memegod420", score: 271 },
  { name: "wowsuchclick", score: 248 },
];

export function App() {
  const [gameState, setGameState] = useState("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isClicking, setIsClicking] = useState(false);
  const [leaderboard, setLeaderboard] = useState(FAKE_LEADERBOARD);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    let interval;

    if (gameState === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === "finished" && score > 0) {
      const newLeaderboard = [...FAKE_LEADERBOARD, { name: "you", score }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      setLeaderboard(newLeaderboard);
    }
  }, [gameState, score]);

  useEffect(() => {
    if (isClicking) {
      const timeout = setTimeout(() => {
        setIsClicking(false);
      }, CLICK_ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [isClicking]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setLeaderboard(FAKE_LEADERBOARD);
  };

  const playAgain = () => {
    setGameState("idle");
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsClicking(false);
  };

  const createParticles = (x, y) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      );
    }, 1000);
  };

  const handleBonk = useCallback(
    (event) => {
      if (gameState !== "playing") return;

      setScore((prev) => prev + 1);
      setIsClicking(true);

      // Create particle effect
      const rect = event.currentTarget.getBoundingClientRect();
      createParticles(event.clientX - rect.left, event.clientY - rect.top);

      // Modern bonk sound
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          100,
          audioContext.currentTime + 0.15
        );

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.15
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
      } catch (error) {
        // Ignore audio errors
      }
    },
    [gameState]
  );

  const getCurrentImage = () => {
    if (gameState === "finished") return result_img;
    if (isClicking) return clicked_img;
    return default_img;
  };

  return (
    <div className="w-[100dvw] min-h-screen relative overflow-hidden">
      <button className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:bg-gray-700 transition-colors duration-300">
        <RiTwitterXFill /> Follow Us
      </button>
      {/* Dark Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,30,50,0.4),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(50,30,60,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(30,50,60,0.3),transparent_50%)]"></div>
      </div>

      {/* Dark Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-32 h-32 rounded-full bg-gradient-to-r from-slate-700/10 to-gray-600/10 blur-xl animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Dark Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-amber-500 rounded-full animate-ping pointer-events-none z-50"
          style={{
            left: particle.x,
            top: particle.y,
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto max-w-7xl p-6">
        {/* Dark Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent mb-4 tracking-tight">
              DOGE BONKER
            </h1>
            <div className="flex items-center justify-center gap-4 text-2xl">
              <span className="animate-bounce">🐕</span>
              <span className="text-gray-300 font-light">
                Much bonk! Very click! Wow!
              </span>
              <span className="animate-bounce delay-100">🏏</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-8">
            <div className="relative">
              {/* Dark Glassmorphism Game Card */}
              <div className="backdrop-blur-xl bg-black/30 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                {/* Dark Modern Game Stats */}
                {gameState !== "idle" && (
                  <div className="flex justify-between items-center mb-8">
                    <div className="group">
                      <div className="backdrop-blur-md bg-gradient-to-r from-amber-600/80 to-orange-700/80 text-white px-8 py-4 rounded-2xl font-black text-3xl border border-gray-600/30 shadow-lg transform group-hover:scale-105 transition-all duration-300">
                        <div className="text-sm font-normal opacity-70">
                          BONKS
                        </div>
                        <div className="text-4xl">
                          {score.toString().padStart(3, "0")}
                        </div>
                      </div>
                    </div>
                    <div className="group">
                      <div className="backdrop-blur-md bg-gradient-to-r from-red-700/80 to-red-800/80 text-white px-8 py-4 rounded-2xl font-black text-3xl border border-gray-600/30 shadow-lg transform group-hover:scale-105 transition-all duration-300">
                        <div className="text-sm font-normal opacity-70">
                          TIME
                        </div>
                        <div className="text-4xl">{timeLeft}s</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Game Image with Dark Effects */}
                <div className="flex justify-center mb-8 relative">
                  <div
                    className={`relative cursor-pointer transition-all duration-200 ${
                      gameState === "playing"
                        ? "hover:scale-110 active:scale-95 hover:rotate-1"
                        : ""
                    } ${isClicking ? "animate-pulse scale-110" : ""}`}
                    onClick={handleBonk}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600/30 to-orange-700/30 rounded-3xl blur-2xl transform scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={getCurrentImage() || "/placeholder.svg"}
                      alt="Doge Bonker Game"
                      className="relative max-w-full h-auto max-h-96 drop-shadow-2xl rounded-2xl"
                    />
                    {gameState === "playing" && (
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>

                {/* Dark Modern Game Controls */}
                <div className="text-center">
                  {gameState === "idle" && (
                    <button
                      onClick={startGame}
                      className="group relative overflow-hidden bg-gradient-to-r from-emerald-700 to-green-800 hover:from-emerald-600 hover:to-green-700 text-white text-2xl px-16 py-8 rounded-2xl font-black border-0 shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center gap-4">
                        <span className="text-3xl animate-bounce">🚀</span>
                        START GAME
                        <span className="text-3xl animate-bounce delay-100">
                          🚀
                        </span>
                      </div>
                    </button>
                  )}

                  {gameState === "playing" && (
                    <div className="backdrop-blur-md bg-black/20 rounded-2xl p-6 border border-gray-600/30">
                      <div className="text-gray-200 text-2xl font-bold flex items-center justify-center gap-3">
                        <span className="animate-pulse">💥</span>
                        Click the doge to BONK!
                        <span className="animate-pulse delay-100">💥</span>
                      </div>
                    </div>
                  )}

                  {gameState === "finished" && (
                    <div className="space-y-6">
                      <div className="backdrop-blur-md bg-gradient-to-r from-amber-700/80 to-orange-800/80 text-white p-8 rounded-3xl border border-gray-600/30 shadow-2xl">
                        <h2 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
                          <span className="animate-bounce">
                            <TbClockHour3 />
                          </span>
                          {"Time's up!"}
                          <span className="animate-bounce delay-100">
                            <TbClockHour3 />
                          </span>
                        </h2>
                        <p className="text-3xl mb-4">
                          You bonked{" "}
                          <span className="font-black text-red-300 text-4xl">
                            {score}
                          </span>{" "}
                          times!
                        </p>
                        {score >= 100 && (
                          <p className="text-xl font-bold text-yellow-300 animate-pulse">
                            🎉 WOW! Such clicking! Much impressive! 🎉
                          </p>
                        )}
                        {score >= 200 && (
                          <p className="text-xl font-bold text-red-300 animate-bounce">
                            🔥 BONK MASTER ACHIEVED! 🔥
                          </p>
                        )}
                      </div>
                      <button
                        onClick={playAgain}
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 text-white text-2xl px-16 py-8 rounded-2xl font-black border-0 shadow-2xl transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-4">
                          <span className="text-3xl animate-spin text-blue-300">
                            <BsArrowRepeat />
                          </span>
                          PLAY AGAIN
                          <span className="text-3xl animate-spin delay-100 text-blue-300">
                            <BsArrowRepeat />
                          </span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dark Modern Leaderboard */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="backdrop-blur-xl bg-black/50 rounded-3xl p-6 border border-gray-700/40 shadow-2xl">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
                    GLOBAL BONKERS
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-bounce text-yellow-400">
                      <GiTrophyCup />
                    </span>
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent flex-1"></div>
                    <span className="animate-bounce delay-100 text-yellow-400">
                      <GiTrophyCup />
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {leaderboard.map((player, index) => (
                    <div
                      key={`${player.name}-${player.score}`}
                      className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-105 ${
                        player.name === "you"
                          ? "bg-gradient-to-r from-amber-800/30 to-orange-900/30 border border-amber-600/40 shadow-lg shadow-amber-600/10"
                          : "bg-gradient-to-r from-gray-800/30 to-slate-800/30 border border-gray-600/30 hover:border-gray-500/50"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                              index === 0
                                ? "bg-amber-600 text-white"
                                : index === 1
                                ? "bg-gray-500 text-white"
                                : index === 2
                                ? "bg-orange-700 text-white"
                                : "bg-gray-700/50 text-gray-300"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span
                            className={`font-bold ${
                              player.name === "you"
                                ? "text-amber-400"
                                : "text-gray-300"
                            }`}
                          >
                            {player.name}
                          </span>
                        </div>
                        <div
                          className={`text-xl font-black ${
                            player.name === "you"
                              ? "text-amber-400"
                              : "text-orange-400"
                          }`}
                        >
                          {player.score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 text-gray-500 text-sm font-mono">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    SYSTEM ONLINE
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dark Modern Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 text-gray-500 text-lg">
            <span className="animate-pulse">💖</span>
            Made with love and many bonks
            <span className="animate-pulse delay-100">💖</span>
          </div>
        </div>
      </div>
    </div>
  );
}
