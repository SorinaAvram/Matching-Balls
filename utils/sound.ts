import { Audio } from "expo-av";

let backgroundSound: Audio.Sound | null = null;

export async function playSound(
  filePath: any,
  volume: number = 1.0,
  isMuted: boolean = false
): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync(filePath);
    await sound.setVolumeAsync(isMuted ? 0 : volume);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status?.isLoaded && status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  } catch (error) {
    console.warn("Failed to play sound:", error);
  }
}

export async function playBackgroundMusic(filePath: any, isMuted: boolean = false) {
  try {
    if (backgroundSound) {
      await backgroundSound.unloadAsync();
    }
    const { sound } = await Audio.Sound.createAsync(filePath, {
      isLooping: true,
      volume: isMuted ? 0 : 0.3,
    });
    backgroundSound = sound;
    await sound.playAsync();
  } catch (error) {
    console.warn("Failed to load background music:", error);
  }
}

export function toggleMuteBackground(isMuted: boolean) {
  if (backgroundSound) {
    backgroundSound.setVolumeAsync(isMuted ? 0 : 0.2);
  }
}

export async function unloadSounds() {
  if (backgroundSound) {
    await backgroundSound.unloadAsync();
    backgroundSound = null;
  }
}