import { BTCStyles, Color, SegmentTone } from "@/styles/BTCIntervalTimer";
import { formatMinutesSeconds } from "@/utils/time-utils";
import { StyleSheet, Text, View } from "react-native";

interface IntervalBlockProps {
    number: number;
    onRemainingMs: number;
    onTotalMs: number;
    offRemainingMs: number;
    offTotalMs: number;
    // Which segment is currently live; null when nothing is running yet
    // (e.g. previewing the next round's first interval during round rest).
    activePhase: "on" | "off" | null;
    // True for intervals still queued behind the current one — renders both
    // segments in the dimmer pending tone instead of their normal idle tone.
    isPending?: boolean;
}

// The two-tone stacked ON/OFF card for the interval currently in play. The
// segment matching `activePhase` reads big and vivid (white for ON, orange
// for OFF) with a progress fill; the other segment dims to its idle tone.
// The OFF segment is omitted entirely when its total is 0 (no rest).
export default function IntervalBlock({ number, onRemainingMs, onTotalMs, offRemainingMs, offTotalMs, activePhase, isPending }: IntervalBlockProps) {
    const onDone = activePhase !== null && onRemainingMs <= 0;
    const onProgress = onTotalMs > 0 ? 1 - onRemainingMs / onTotalMs : 0;
    const offProgress = offTotalMs > 0 ? 1 - offRemainingMs / offTotalMs : 0;

    return (
        <View style={BTCStyles.block}>
            <Segment
                label={`INTERVAL ${number} · ON`}
                timeMs={onRemainingMs}
                isActive={activePhase === "on"}
                tag={onDone ? "✓ DONE" : undefined}
                progress={activePhase === "on" ? onProgress : undefined}
                progressFillColor={Color.orange}
                activeBg={SegmentTone.onActiveBg}
                activeText={SegmentTone.onActiveText}
                idleBg={isPending ? SegmentTone.pendingBg : SegmentTone.onIdleBg}
                idleText={isPending ? SegmentTone.pendingText : SegmentTone.onIdleText}
            />

            {offTotalMs > 0 && (
                <Segment
                    label={`INTERVAL ${number} · OFF`}
                    timeMs={offRemainingMs}
                    isActive={activePhase === "off"}
                    progress={activePhase === "off" ? offProgress : undefined}
                    progressFillColor="#FFFFFF"
                    activeBg={SegmentTone.offActiveBg}
                    activeText={SegmentTone.offActiveText}
                    idleBg={isPending ? SegmentTone.pendingBg : SegmentTone.offIdleBg}
                    idleText={isPending ? SegmentTone.pendingText : SegmentTone.offIdleText}
                />
            )}
        </View>
    );
}

interface SegmentProps {
    label: string;
    timeMs: number;
    isActive: boolean;
    tag?: string;
    progress?: number;
    progressFillColor: string;
    activeBg: string;
    activeText: string;
    idleBg: string;
    idleText: string;
}

function Segment({ label, timeMs, isActive, tag, progress, progressFillColor, activeBg, activeText, idleBg, idleText }: SegmentProps) {
    const textColor = isActive ? activeText : idleText;

    return (
        <View style={[styles.segment, { backgroundColor: isActive ? activeBg : idleBg, paddingVertical: isActive ? 20 : 12 }]}>
            <View style={BTCStyles.segRow}>
                <Text style={[BTCStyles.segLabel, { color: textColor }]}>{label}</Text>
                {tag && <Text style={[BTCStyles.segTag, { color: SegmentTone.idleTag }]}>{tag}</Text>}
            </View>

            <Text style={[BTCStyles.segTime, { color: textColor, fontSize: isActive ? 42 : 24 }]}>
                {formatMinutesSeconds(timeMs)}
            </Text>

            {isActive && progress !== undefined && (
                <View style={BTCStyles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, progress * 100))}%`, backgroundColor: progressFillColor }]} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    segment: {
        paddingHorizontal: 18,
    },
    progressFill: {
        height: "100%",
    },
});
