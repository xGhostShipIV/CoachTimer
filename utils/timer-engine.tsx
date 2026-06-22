import React from "react";

export function setTimerCallback(frameRef: React.RefObject<number | null>, prevTimeRef: React.RefObject<number | null>, onFrame: (delta: number) => void) {
    const tick = (now: number) => {
        if (prevTimeRef.current == null) {
            prevTimeRef.current = now;
        } else {
            const delta = now - prevTimeRef.current;
            prevTimeRef.current = now;
            onFrame(delta);
        }
        frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
        if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }
        prevTimeRef.current = null;
    };
}