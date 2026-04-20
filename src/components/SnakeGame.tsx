import { useState, useEffect, useRef, useCallback } from "react";
import { Point, GameStatus } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, RefreshCcw, Pause, Play } from "lucide-react";

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>("IDLE");
  const [speed, setSpeed] = useState(BASE_SPEED);

  const gameLoopRef = useRef<number>(0);
  const directionRef = useRef<Point>(INITIAL_DIRECTION);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setSpeed(BASE_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
    setStatus("PLAYING");
  };

  const gameOver = () => {
    setStatus("GAME_OVER");
    if (score > highScore) setHighScore(score);
  };

  const moveSnake = useCallback(() => {
    setSnake((prev) => {
      const head = prev[0];
      const nextHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Collision with walls
      if (
        nextHead.x < 0 ||
        nextHead.x >= GRID_SIZE ||
        nextHead.y < 0 ||
        nextHead.y >= GRID_SIZE
      ) {
        gameOver();
        return prev;
      }

      // Collision with self
      if (prev.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)) {
        gameOver();
        return prev;
      }

      const newSnake = [nextHead, ...prev];

      // Eating food
      if (nextHead.x === food.x && nextHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        setSpeed((prevSpeed) => Math.max(80, prevSpeed - 2));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, score, highScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 };
          break;
        case " ":
          if (status === "PLAYING") setStatus("PAUSED");
          else if (status === "PAUSED") setStatus("PLAYING");
          else if (status === "IDLE" || status === "GAME_OVER") resetGame();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [status]);

  useEffect(() => {
    if (status !== "PLAYING") return;

    const loop = (time: number) => {
      if (time - lastUpdateRef.current > speed) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [status, speed, moveSnake]);

  return (
    <div className="relative flex flex-col items-center gap-6 p-4">
      {/* Game Header */}
      <div className="flex w-full justify-between items-center bg-[#111] p-4 rounded-xl border border-white/10">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-white/40">Score</span>
          <span className="text-2xl font-mono text-neon-cyan glow-cyan">{score.toString().padStart(4, "0")}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest text-white/40">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-neon-yellow" />
            <span className="text-2xl font-mono text-neon-magenta glow-magenta">{highScore.toString().padStart(4, "0")}</span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative aspect-square w-full max-w-[400px] bg-[#0A0A0A] border-4 border-white/5 rounded-2xl overflow-hidden shadow-2xl"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid pointer-events-none opacity-5" style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white" />
          ))}
        </div>

        {/* Snake segments */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ 
              gridColumnStart: segment.x + 1, 
              gridRowStart: segment.y + 1,
            }}
            className={`
              ${i === 0 ? "bg-neon-cyan shadow-[0_0_15px_#00f3ff] z-10 rounded-sm" : "bg-neon-cyan/60 rounded-full scale-90"}
            `}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            scale: [1, 1.2, 1],
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-neon-magenta shadow-[0_0_15px_#ff00ff] rounded-full scale-75"
        />

        {/* Overlays */}
        <AnimatePresence>
          {status !== "PLAYING" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              {status === "IDLE" && (
                <div className="flex flex-col items-center gap-4">
                  <h2 className="text-4xl font-bold tracking-tighter glow-cyan">SNAKE NEON</h2>
                  <p className="text-white/60 mb-4 uppercase tracking-[0.2em] text-xs">Press Space to Start</p>
                  <button 
                    onClick={resetGame}
                    className="p-4 rounded-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all group"
                  >
                    <Play className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}
              {status === "PAUSED" && (
                <div className="flex flex-col items-center gap-4">
                  <h2 className="text-4xl font-bold tracking-tighter text-white/80">PAUSED</h2>
                  <button 
                    onClick={() => setStatus("PLAYING")}
                    className="p-4 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-all"
                  >
                    <Play className="w-8 h-8 fill-current" />
                  </button>
                </div>
              )}
              {status === "GAME_OVER" && (
                <div className="flex flex-col items-center gap-4">
                  <h2 className="text-4xl font-bold tracking-tighter text-neon-magenta glow-magenta text-center">
                    GAME OVER
                  </h2>
                  <div className="text-center">
                    <p className="text-white/60 uppercase tracking-widest text-xs">Final Score</p>
                    <p className="text-3xl font-mono text-neon-cyan">{score}</p>
                  </div>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-neon-magenta/20 border border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black transition-all mt-4"
                  >
                    <RefreshCcw className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest">Try Again</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Help */}
      <div className="grid grid-cols-2 gap-4 w-full text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono">
        <div className="bg-white/5 p-2 rounded-lg border border-white/5 flex flex-col items-center">
          <span>ARROWS</span>
          <span>TO MOVE</span>
        </div>
        <div className="bg-white/5 p-2 rounded-lg border border-white/5 flex flex-col items-center">
          <span>SPACE</span>
          <span>TO START/PAUSE</span>
        </div>
      </div>
    </div>
  );
}
