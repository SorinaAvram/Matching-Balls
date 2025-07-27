import { checkMatches } from "../utils/grid";
import type { Ball, Grid } from "../types/indes";
import { GRID_SIZE } from "../constants/balls";

// Dummy ball with the same color for matching
const redBall: Ball = {
  color: "red",
  image: 0 as unknown as any, // mock image reference
};

// Helper to create an empty grid
const createEmptyGrid = (): Grid =>
  Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));

describe("checkMatches", () => {
  it("should return 10 points for 4-ball match", () => {
    const grid = createEmptyGrid();
    grid[0][0] = redBall;
    grid[0][1] = redBall;
    grid[0][2] = redBall;
    grid[0][3] = redBall;

    const { gainedPoints, powerup } = checkMatches(grid);
    expect(gainedPoints).toBe(10);
    expect(powerup).toBe(false);
  });

  it("should return 30 points for 5-ball match", () => {
    const grid = createEmptyGrid();
    grid[1][0] = redBall;
    grid[1][1] = redBall;
    grid[1][2] = redBall;
    grid[1][3] = redBall;
    grid[1][4] = redBall;

    const { gainedPoints, powerup } = checkMatches(grid);
    expect(gainedPoints).toBe(30);
    expect(powerup).toBe(false);
  });

  it("should return 60 points and powerup for 6-ball match", () => {
    const grid = createEmptyGrid();
    grid[2][0] = redBall;
    grid[2][1] = redBall;
    grid[2][2] = redBall;
    grid[2][3] = redBall;
    grid[2][4] = redBall;
    grid[2][5] = redBall;

    const { gainedPoints, powerup } = checkMatches(grid);
    expect(gainedPoints).toBe(60);
    expect(powerup).toBe(true);
  });

  it("should return 120 points and powerup for 7-ball match", () => {
    const grid = createEmptyGrid();
    grid[3][0] = redBall;
    grid[3][1] = redBall;
    grid[3][2] = redBall;
    grid[3][3] = redBall;
    grid[3][4] = redBall;
    grid[3][5] = redBall;
    grid[3][6] = redBall;

    const { gainedPoints, powerup } = checkMatches(grid);
    expect(gainedPoints).toBe(120);
    expect(powerup).toBe(true);
  });

  it("should clear matched balls from the grid", () => {
    const grid = createEmptyGrid();
    grid[4][0] = redBall;
    grid[4][1] = redBall;
    grid[4][2] = redBall;
    grid[4][3] = redBall;

    const { newGrid } = checkMatches(grid);
    expect(newGrid[4][0]).toBeNull();
    expect(newGrid[4][1]).toBeNull();
    expect(newGrid[4][2]).toBeNull();
    expect(newGrid[4][3]).toBeNull();
  });
});
