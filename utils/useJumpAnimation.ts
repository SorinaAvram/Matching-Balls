import { useRef, useEffect } from "react";
import { Animated } from "react-native";
import type { Position } from "../types/indes";

export function useJumpAnimation(selected: Position | null) {
  const jumpAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Stop any running animation
    if (animationRef.current) {
      animationRef.current.stop();
      jumpAnim.setValue(0);
      animationRef.current = null;
    }

    if (selected !== null) {
      // Start a new loop
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(jumpAnim, {
            toValue: -10,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(jumpAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
      animationRef.current = loop;
      loop.start();
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        jumpAnim.setValue(0);
        animationRef.current = null;
      }
    };
  }, [selected]);

  return jumpAnim;
}
