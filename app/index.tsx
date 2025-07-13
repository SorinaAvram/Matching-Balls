import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import {
  GameHeader,
  GameOverModal,
  TutorialOverlay,
} from "../hooks/gameBoardUi";
import PowerupSlotMachine from "../utils/PowerupSlotMachine";
import {
  createEmptyGrid,
  generateNextBalls,
  placeRandomBall,
  isGridFull,
  checkMatches,
} from "../utils/grid";
import { findPath, findClosestPathToBlocked } from "../utils/pathfinding";
import {
  playSound,
  playBackgroundMusic,
  toggleMuteBackground,
  unloadSounds,
} from "../utils/sound";
import { ballColors, matchSound } from "../constants/balls";
import { useJumpAnimation } from "../utils/useJumpAnimation";
import type { Ball, Position } from "../types/indes";
import { CELL_SIZE } from "../constants/balls";

const GameScreen: React.FC = () => {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [selected, setSelected] = useState<Position | null>(null);
  const [nextBalls, setNextBalls] = useState(generateNextBalls(ballColors));
  const [isMuted, setIsMuted] = useState(false);
  const [showSlot, setShowSlot] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [gameOverVisible, setGameOverVisible] = useState(false);

  const movingBall = useRef<Ball | null>(null);
  const [animationPath, setAnimationPath] = useState<Position[] | null>(null);
  const [animatedPos] = useState(new Animated.ValueXY());
  const jumpAnim = useJumpAnimation(selected);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
    });

    loadBestScore();
    startGame();

    return () => {
      unloadSounds();
    };
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      AsyncStorage.setItem("bestScore", score.toString());
    }
  }, [score]);

  const loadBestScore = async () => {
    const stored = await AsyncStorage.getItem("bestScore");
    if (stored) setBestScore(parseInt(stored, 10));
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      toggleMuteBackground(next);
      return next;
    });
  };

  const startGame = () => {
    const newGrid = createEmptyGrid();
    for (let i = 0; i < 3; i++) {
      placeRandomBall(newGrid, ballColors[Math.floor(Math.random() * ballColors.length)]);
    }
    setGrid(newGrid);
    setScore(0);
    setNextBalls(generateNextBalls(ballColors));
    setGameOverVisible(false);
    playBackgroundMusic(require("../assets/sounds/background.mp3"), isMuted);
  };

  const animateBall = (path: Position[], callback: () => void) => {
    if (path.length < 2) return;

    let index = 0;
    const nextStep = () => {
      if (index < path.length - 1) {
        const [r, c] = path[++index];
        Animated.timing(animatedPos, {
          toValue: { x: c * CELL_SIZE, y: r * CELL_SIZE },
          duration: 100,
          useNativeDriver: false,
        }).start(nextStep);
      } else {
        callback();
      }
    };

    const [startR, startC] = path[0];
    animatedPos.setValue({ x: startC * CELL_SIZE, y: startR * CELL_SIZE });
    nextStep();
  };

  const onCellPress = (r: number, c: number) => {
    const cell = grid[r][c];

    if (cell) {
      // Select or deselect the ball
      setSelected((prev) =>
        prev?.[0] === r && prev?.[1] === c ? null : [r, c]
      );
    } else if (selected) {
      const [sr, sc] = selected;
      const ball = grid[sr][sc];
      if (!ball) return;

      const path = findPath(grid, selected, [r, c]);
      const newGrid = grid.map((row) => [...row]);

      const completeMove = (finalR: number, finalC: number) => {
        newGrid[finalR][finalC] = ball;
        const { newGrid: clearedGrid, gainedPoints, powerup } = checkMatches(newGrid);

        if (gainedPoints > 0) {
          playSound(matchSound, 0.05);
          setGrid(clearedGrid);
          setScore((s) => s + gainedPoints);
          if (powerup) {
            setShowSlot(true);
          }
        } else {
          nextBalls.forEach((ball) => placeRandomBall(newGrid, ball));
          setGrid(newGrid);

          const afterPlacement = checkMatches(newGrid);
          if (afterPlacement.gainedPoints > 0) {
            setGrid(afterPlacement.newGrid);
            setScore((s) => s + afterPlacement.gainedPoints);
            if (afterPlacement.powerup) {
              setShowSlot(true);
            }
          }
        }

        if (isGridFull(newGrid)) {
          setGameOverVisible(true);
        }

        setSelected(null);
        movingBall.current = null;
        setAnimationPath(null);
        setNextBalls(generateNextBalls(ballColors));
      };

      if (path) {
        movingBall.current = ball;
        newGrid[sr][sc] = null;
        setGrid(newGrid);
        setAnimationPath(path);
        animateBall(path, () => completeMove(r, c));
      } else {
        const fallback = findClosestPathToBlocked(grid, selected, [r, c]);
        if (fallback && fallback.length > 1) {
          movingBall.current = ball;
          newGrid[sr][sc] = null;
          setGrid(newGrid);
          setAnimationPath(fallback);
          animateBall(fallback, () => {
            const [fr, fc] = fallback[fallback.length - 1];
            completeMove(fr, fc);
            Alert.alert("Blocked", "Couldn't reach destination. Stopped early.");
          });
        } else {
          Alert.alert("Invalid move", "You can't move through other balls.");
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GameHeader
        score={score}
        bestScore={bestScore}
        isMuted={isMuted}
        toggleMute={toggleMute}
        startGame={startGame}
      />

      {showSlot && (
        <PowerupSlotMachine
          grid={grid}
          setGrid={setGrid}
          setScore={setScore}
          onFinish={() => setShowSlot(false)}
        />
      )}

      <View style={styles.grid}>
        {grid.map((row, rIdx) => (
          <View key={rIdx} style={styles.row}>
            {row.map((cell, cIdx) => {
              const isAnimating =
                animationPath?.[0]?.[0] === rIdx &&
                animationPath?.[0]?.[1] === cIdx;
              const isSelected =
                selected?.[0] === rIdx && selected?.[1] === cIdx;
              return (
                <TouchableOpacity
                  key={cIdx}
                  onPress={() => onCellPress(rIdx, cIdx)}
                  style={[styles.cell, isSelected && styles.selectedCell]}
                >
                  {cell &&
                    !isAnimating &&
                    (isSelected ? (
                      <Animated.View
                        style={{ transform: [{ translateY: jumpAnim }] }}
                      >
                        <Image source={cell.image} style={styles.ballImage} />
                      </Animated.View>
                    ) : (
                      <Image source={cell.image} style={styles.ballImage} />
                    ))}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {animationPath && movingBall.current && (
          <Animated.Image
            source={movingBall.current.image}
            style={[
              styles.ballImage,
              styles.animatedBall,
              animatedPos.getLayout(),
            ]}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.tutorialButton}
        onPress={() => setShowTutorial(true)}
      >
        <Text style={styles.tutorialButtonText}>Tutorial</Text>
      </TouchableOpacity>

      <TutorialOverlay
        visible={showTutorial}
        handleCloseTutorial={() => setShowTutorial(false)}
      />
      <GameOverModal visible={gameOverVisible} onRestart={startGame} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  grid: { marginTop: 10 },
  row: { flexDirection: "row" },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCell: {
    borderColor: "gold",
    borderWidth: 2,
  },
  ballImage: { width: 42, height: 42 },
  animatedBall: {
    position: "absolute",
    zIndex: 1,
  },
  tutorialButton: {
    padding: 10,
    backgroundColor: "#6A5ACD",
    marginTop: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  tutorialButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default GameScreen;
