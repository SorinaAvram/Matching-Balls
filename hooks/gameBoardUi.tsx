import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import allowedMoveImage from "../assets/images/allowed_move.png";
import invalidMoveImage from "../assets/images/invalid_move.png";

export interface GameHeaderProps {
  score: number;
  bestScore: number;
  isMuted: boolean;
  toggleMute: () => void;
  startGame: () => void;
}
export interface GameOverModalProps {
  visible: boolean;
  onRestart: () => void;
}

export interface TutorialOverlayProps {
  visible: boolean;
  handleCloseTutorial: () => void;
}

export const GameHeader = ({
  score,
  bestScore,
  isMuted,
  toggleMute,
  startGame,
}: GameHeaderProps) => (
  <>
    <TouchableOpacity style={styles.button} onPress={startGame}>
      <Text style={styles.buttonText}>New Game</Text>
    </TouchableOpacity>
    <View style={styles.muteIconWrapper}>
      <TouchableOpacity onPress={toggleMute}>
        <Ionicons
          name={isMuted ? "volume-mute" : "volume-high"}
          size={32}
          color="#888"
        />
      </TouchableOpacity>
    </View>
    <View style={styles.headerRow}>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.bestScore}>Best: {bestScore}</Text>
    </View>
  </>
);

export const GameOverModal = ({ visible, onRestart }: GameOverModalProps) =>
  visible ? (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.modalText}>Game Over</Text>
        <Text style={styles.modalSubtext}>No more moves left.</Text>
        <TouchableOpacity style={styles.modalButton} onPress={onRestart}>
          <Text style={styles.modalButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : null;

export const TutorialOverlay = ({
  visible,
  handleCloseTutorial,
}: TutorialOverlayProps) =>

  visible ? (
    <View style={styles.tutorialOverlay}>
      <View style={styles.tutorialContent}>
        <Text style={styles.tutorialTitle}>Allowed Moves</Text>
        <Text style={styles.tutorialText}>
          Match at least 4 balls of the same color either vertically,
          horizontally or on diagonal, to clear them from the board
        </Text>
        
        <View style={styles.tutorialImageContainer}>
          <Image source={allowedMoveImage} style={styles.tutorialImage} />
        </View>

        <Text style={styles.tutorialTitle}>Invalid Moves</Text>
        <Text style={styles.tutorialText}>
          If the path is blocked by another ball, you cannot perform the move
        </Text>
        <View style={styles.tutorialImageContainer}>
          <Image source={invalidMoveImage} style={styles.tutorialImage} />
        </View>

        <Text style={styles.tutorialTitle}>Scoring</Text>
        <Text style={styles.tutorialText}>
          Points are awarded for each successful match: 10 points for a match of
          4 balls, 30 for a match of 5 and 50 for a match of 6. You will also
          get a surprise reward when matching 6 balls.
        </Text>

        <Text style={styles.tutorialTitle}>Game Over</Text>
        <Text style={styles.tutorialText}>
          When you run out of moves, the game is over.
        </Text>
      </View>

      <TouchableOpacity onPress={handleCloseTutorial}>
        <Text style={{ fontSize: 32, color: "white" }}>▼</Text>
      </TouchableOpacity>
    </View>
  ) : null;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  muteIconWrapper: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#2196F3",
    borderRadius: 8,
    marginTop: 30,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  score: { fontSize: 24 },
  bestScore: { fontSize: 24, fontWeight: "bold", color: "green" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modal: {
    backgroundColor: "transparent",
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  modalSubtext: {
    fontSize: 16,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  tutorialOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFE5B4",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  tutorialContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  tutorialText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginVertical: 4,
  },
  tutorialImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  tutorialImage: {
    width: 150,
    height: 150,
    marginVertical: 4,
    resizeMode: "contain",
  },
});
