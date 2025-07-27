import { GRID_SIZE } from "../constants/balls";
import type { Ball, Grid, Position } from "../types/indes";

export function createEmptyGrid(): Grid {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));
}

export function placeRandomBall(gridData: Grid, ball: Ball): void {
  const empty: Position[] = [];
  gridData.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (!cell) empty.push([r, c]);
    });
  });
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  gridData[r][c] = ball;
}

export function isGridFull(grid: Grid): boolean {
  return grid.every((row) => row.every((cell) => cell !== null));
}

export function generateNextBalls(ballColors: Ball[]): Ball[] {
  return Array(3)
    .fill(null)
    .map(() => ballColors[Math.floor(Math.random() * ballColors.length)]);
}

export function checkMatches(grid: Grid): {
  newGrid: Grid;
  gainedPoints: number;
  powerup: boolean;
} {
  const directions = [
    [1, 0], // vertical
    [0, 1], // horizontal
    [1, 1], // diagonal right-down
    [1, -1], // diagonal left-down
  ];

  const toClear: Set<string> = new Set();
  const matches: Position[][] = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const current = grid[r][c];
      if (!current) continue;

      for (const [dr, dc] of directions) {
        const match: Position[] = [[r, c]];
        let nr = r + dr,
          nc = c + dc;

        while (
          nr >= 0 &&
          nr < GRID_SIZE &&
          nc >= 0 &&
          nc < GRID_SIZE &&
          grid[nr][nc]?.color === current.color
        ) {
          match.push([nr, nc]);
          nr += dr;
          nc += dc;
        }

        // Only add match if it's long enough and hasn't been counted already
        if (match.length >= 4) {
          const keySet = new Set(match.map(([mr, mc]) => `${mr},${mc}`));
          const isNewMatch = [...keySet].some((k) => !toClear.has(k));
          if (isNewMatch) {
            match.forEach(([mr, mc]) => toClear.add(`${mr},${mc}`));
            matches.push(match);
          }
        }
      }
    }
  }

  // Scoring
  let gainedPoints = 0;
  let powerup = false;

  for (const match of matches) {
    const length = match.length;
    if (length >= 7) {
      gainedPoints += 120;
      powerup = true;
    } else if (length === 6) {
      gainedPoints += 60;
      powerup = true;
    } else if (length === 5) {
      gainedPoints += 30;
    } else {
      gainedPoints += 10;
    }
  }

  const newGrid = grid.map((row, rIdx) =>
    row.map((cell, cIdx) => (toClear.has(`${rIdx},${cIdx}`) ? null : cell))
  );

  return { newGrid, gainedPoints, powerup };
}
