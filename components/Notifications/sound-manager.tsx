import { Asset } from "expo-asset";
import { AudioSource, useAudioPlayer } from "expo-audio";
import { useCallback, useEffect, useState } from "react";

export const NOTIFICATION_URLS = [
    require("../../assets/sounds/four_double_beep.mp3"),
    require("../../assets/sounds/three-bell.mp3")
];

const soundMap: Record<string, AudioSource> = {};

export function getSoundNames(): string[] {
    return Object.keys(soundMap).map((key) => key.toString());
}

export function useSoundManager() {
    const [currentSound, setCurrentSound] = useState<string>("");
    const [currentAsset, setCurrentAsset] = useState<AudioSource>(null);
    const [playCount, setPlayCount] = useState(0);

    useEffect(() => {
        NOTIFICATION_URLS.forEach((url) => {
            const asset = Asset.fromModule(url);
            const soundName = asset.name.replace(/\.[^/.]+$/, "");
            soundMap[soundName] = url;
        });
    }, []);
    
    const player = useAudioPlayer(currentAsset);

    useEffect(() => {
        if (!currentSound) {
            return;
        }

        setCurrentAsset(soundMap[currentSound] ?? null);
    }, [currentSound, playCount]);

    useEffect(() => {
        if (!currentAsset) {
            return;
        }

        player.seekTo(0);
        player.play();
    }, [currentAsset, playCount]);

    return useCallback((soundName: string) => {
        setCurrentSound(soundName);
        setPlayCount((count) => count + 1);
    }, []);
}