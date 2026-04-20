export interface Point {
  x: number;
  y: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
}

export type GameStatus = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";
