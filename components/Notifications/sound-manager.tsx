import { Asset } from "expo-asset";
import { AudioSource, useAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";

export const NOTIFICATION_URLS = [
    require("../../assets/sounds/four_double_beep.mp3"),
];

const soundMap: Record<string, AudioSource> = {};

export function getSoundNames(): string[] {
    return Object.keys(soundMap).map((key) => key.toString());
}

export function useSoundManager() {
    const [currentSound, setCurrentSound] = useState<string>("");
    const [currentAsset, setCurrentAsset] = useState<AudioSource>(null);

    NOTIFICATION_URLS.forEach((url, index) => {
        const asset = Asset.fromModule(url);
        const soundName = asset.name.replace(/\.[^/.]+$/, "");
        soundMap[soundName] = url;
    });
    
    const player = useAudioPlayer(currentAsset);

    useEffect(() => {
        if (currentAsset) {
            console.log("Playing asset:", currentAsset);
            player.seekTo(0);
            player.play();
        }
    }, [currentAsset]);

    // when currentSound changes we play the sound
    useEffect(() => {
        setCurrentAsset(soundMap[currentSound]);
        console.log("Current sound changed:", currentSound);
    }, [currentSound]);

    return setCurrentSound;
}