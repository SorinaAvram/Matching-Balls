import { Grid } from "../types/indes"; // or wherever your types are


export type Powerup =
  | { type: "points"; value: number }
  | { type: "clearColor"; color: string };

const POWERUPS: Powerup[] = [
  { type: "points", value: 100 },
  { type: "clearColor", color: "red" }, // etc.
];

export function getRandomPowerup(): Powerup {
  return POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
}

export function clearBallsByColor(grid: Grid, color: string): Grid {
  return grid.map((row) =>
    row.map((cell) => (cell?.color === color ? null : cell))
  );
}

export function getAllPowerups(): Powerup[] {
  return POWERUPS;
}

export function applyPowerup(
  reward: Powerup,
  {
    grid,
    setGrid,
    setScore,
  }: {
    grid: Grid;
    setGrid: (grid: Grid) => void;
    setScore: (updater: (prev: number) => number) => void;
  }
): void {
  if (reward.type === "points") {
    setScore((prev) => prev + reward.value);
  } else if (reward.type === "clearColor") {
    setGrid(clearBallsByColor(grid, reward.color));
  }
}