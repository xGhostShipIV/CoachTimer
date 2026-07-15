import { BackButton } from "@/components/timer-action-buttons";
import Concrete from "@/components/ui/ConcreteButton";
import { BTCStyles, Color, Stage } from "@/styles/BTCIntervalTimer";
import { useKeepAwake } from "expo-keep-awake";
import { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";
import NotificationContainer from "../Notifications/notification-container";
import { TimeText } from "../Timer/time-text";

interface StopwatchViewProps {
    onBack?: () => void;
}

export function StopwatchView({ onBack }: StopwatchViewProps) {
    useKeepAwake();
    
    const [isPaused, setIsPaused] = useState(true);
    const [resetSignal, setResetSignal] = useState(0);
    const notificationTickRef = useRef<(delta: number) => void>(() => { });

    const handleTick = useCallback((delta: number) => {
        notificationTickRef.current(delta);
    }, []);

    const togglePause = () => {
        setIsPaused((previous) => !previous);
    };

    const clearTimer = () => {
        setIsPaused(true);
        setResetSignal((previous) => previous + 1);
    };

    return (
        <View style={[BTCStyles.appScreen, { paddingHorizontal: 18 }]}>
            <View style={[BTCStyles.toolbar, { paddingLeft: 0 }]}>
                {onBack && <BackButton onPress={onBack} style={BTCStyles.toolBack} />}
            </View>

            <View style={{ paddingTop: 22 }}>
                <NotificationContainer
                    tickHandlerRef={notificationTickRef}
                    resetSignal={resetSignal}
                />
            </View>

            <View style={{ flex: 1, marginTop: 28, marginBottom: 28 }}>
                <Text style={[BTCStyles.heroLabel, { color: Stage.work.heroLabel, marginBottom: 8 }]}>ELAPSED TIME</Text>
                <View style={{ justifyContent: 'center', alignContent: 'center', flexGrow: 1 }}>
                    <TimeText
                        isPaused={isPaused}
                        showMilliseconds={true}
                        resetSignal={resetSignal}
                        onTick={handleTick}
                        style={[BTCStyles.hero, { color: Stage.work.hero, fontSize: 60 }]}
                    />
                </View>
            </View>


            <View style={{gap: 11, marginBottom: 18}}>
                <Concrete ledge={Color.orangeLedge} onPress={togglePause}>
                    <View style={BTCStyles.start}>
                        <Text style={BTCStyles.startText}>{isPaused ? "▸ START" : "‖ PAUSE"}</Text>
                    </View>
                </Concrete>

                <Concrete ledge={Color.navyLedge} onPress={clearTimer}>
                    <View style={[BTCStyles.stop, { backgroundColor: Stage.work.stopBg, borderColor: Stage.work.stopBorder }]}>
                        <Text style={[BTCStyles.stopGlyph, { color: Stage.work.stopText }]}>▪</Text>
                        <Text style={[BTCStyles.stopText, { color: Stage.work.stopText }]}>STOP / CLEAR</Text>
                    </View>
                </Concrete>
            </View>
        </View>
    );
}
