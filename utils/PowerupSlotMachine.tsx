import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getAllPowerups, applyPowerup, Powerup } from "../utils/powerups";

interface Props {
  grid: any;
  setGrid: (g: any) => void;
  setScore: (cb: (s: number) => number) => void;
  onFinish: () => void;
}

const PowerupSlotMachine: React.FC<Props> = ({
  grid,
  setGrid,
  setScore,
  onFinish,
}) => {
  const powerups = getAllPowerups();
  
  const [current, setCurrent] = useState<Powerup>(powerups[0]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % powerups.length;
      setCurrent(powerups[i]);
    }, 80); // Fast scroll

    const timeout = setTimeout(() => {
      clearInterval(interval);
      const selected =
        powerups[Math.floor(Math.random() * powerups.length)];
      setCurrent(selected);
      applyPowerup(selected, { grid, setGrid, setScore });

      // Finish after short delay to show result
      setTimeout(() => {
        onFinish();
      }, 1200);
    }, 1500); // Duration of spin

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const renderPowerup = () => {
    if (current.type === "points") {
      return <Text style={styles.text}>+{current.value} Points!</Text>;
    } else if (current.type === "clearColor") {
      return <Text style={styles.text}>Clear {current.color} Balls!</Text>;
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>🎰 Powerup Machine</Text>
        {renderPowerup()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 20,
    borderRadius: 16,
    borderColor: "gold",
    borderWidth: 2,
    zIndex: 999,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  title: {
    color: "gold",
    fontSize: 20,
    marginBottom: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});

export default PowerupSlotMachine;