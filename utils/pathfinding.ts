import type { Grid, Position } from "../types/indes";
import { GRID_SIZE } from "../constants/balls";

export function findPath(grid: Grid, from: Position, to: Position): Position[] | null {
  const visited = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(false));
  const prev: (Position | null)[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));
  const queue: Position[] = [from];
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  visited[from[0]][from[1]] = true;
  while (queue.length) {
    const [r, c] = queue.shift()!;
    if (r === to[0] && c === to[1]) {
      const path: Position[] = [];
      let cur: Position | null = to;
      while (cur) {
        path.unshift(cur);
        cur = prev[cur[0]][cur[1]];
      }
      return path;
    }
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (
        nr >= 0 &&
        nr < GRID_SIZE &&
        nc >= 0 &&
        nc < GRID_SIZE &&
        !visited[nr][nc] &&
        !grid[nr][nc]
      ) {
        visited[nr][nc] = true;
        prev[nr][nc] = [r, c];
        queue.push([nr, nc]);
      }
    }
  }
  return null;
}

export function findClosestPathToBlocked(grid: Grid, start: Position, target: Position): Position[] | null {
  const visited = Array.from({ length: grid.length }, () =>
    Array(grid.length).fill(false)
  );
  const queue: { pos: Position; path: Position[] }[] = [
    { pos: start, path: [start] },
  ];
  visited[start[0]][start[1]] = true;
  let bestPath: Position[] | null = null;
  let bestDistance = Infinity;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  while (queue.length) {
    const { pos, path } = queue.shift()!;
    const [r, c] = pos;
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < grid.length &&
        nc >= 0 &&
        nc < grid.length &&
        !visited[nr][nc]
      ) {
        visited[nr][nc] = true;
        const newPos: Position = [nr, nc];
        const newPath = [...path, newPos];
        const isAdjacentToTarget =
          Math.abs(nr - target[0]) + Math.abs(nc - target[1]) === 1;
        if (!grid[nr][nc]) {
          queue.push({ pos: newPos, path: newPath });
          if (isAdjacentToTarget) {
            const distToTarget =
              Math.abs(nr - target[0]) + Math.abs(nc - target[1]);
            if (distToTarget < bestDistance) {
              bestDistance = distToTarget;
              bestPath = newPath;
            }
          }
        }
      }
    }
  }
  return bestPath;
}