// Single sound+interval notification editor for the stopwatch: every
// `intervalMs` of elapsed time, plays `soundPath` (unless set to "None").
import { TimeWheelPicker } from '@/components/ui/time-wheel-picker';
import { WheelPicker } from '@/components/ui/wheel-picker';
import { BTCStyles } from '@/styles/BTCIntervalTimer';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { getSoundNames, useSoundManager } from './sound-manager';

const NONE_OPTION = 'None';
const DEFAULT_INTERVAL_MS = 30000;

function formatSoundLabel(name: string) {
    return name.toUpperCase().replace(/[_-]/g, ' ');
}

interface NotificationContainerProps {
    tickHandlerRef?: React.MutableRefObject<(delta: number) => void>;
    resetSignal?: number;
}

export default function NotificationContainer({ tickHandlerRef, resetSignal }: NotificationContainerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [soundFiles, setSoundFiles] = useState<string[]>([]);
    const [soundPath, setSoundPath] = useState(NONE_OPTION);
    const [intervalMs, setIntervalMs] = useState(DEFAULT_INTERVAL_MS);
    const elapsedRef = useRef(0);
    const lastResetSignalRef = useRef(resetSignal);

    const playSound = useSoundManager();

    useEffect(() => {
        setSoundFiles(getSoundNames());
    }, []);

    useEffect(() => {
        if (resetSignal === undefined || resetSignal === lastResetSignalRef.current) {
            return;
        }

        elapsedRef.current = 0;
        lastResetSignalRef.current = resetSignal;
    }, [resetSignal]);

    useEffect(() => {
        if (!tickHandlerRef) {
            return;
        }

        tickHandlerRef.current = (delta: number) => {
            if (delta <= 0 || soundPath === NONE_OPTION || intervalMs <= 0) {
                return;
            }

            const nextElapsed = elapsedRef.current + delta;
            if (nextElapsed >= intervalMs) {
                // Prevent the bleeding of milliseconds since the values will
                // almost never properly align.
                elapsedRef.current = nextElapsed - intervalMs;
                playSound(soundPath);
            } else {
                elapsedRef.current = nextElapsed;
            }
        };
    }, [soundPath, intervalMs, playSound, tickHandlerRef]);

    const soundOptions = [NONE_OPTION, ...soundFiles];

    return (
        <View>
            <Pressable style={BTCStyles.disclosureHeader} onPress={() => setIsOpen((value) => !value)}>
                <Text style={BTCStyles.disclosureBullet}>{isOpen ? '▾' : '▸'}</Text>
                <Text style={BTCStyles.disclosureTitle}>{'Sound Options'.toUpperCase()}</Text>
            </Pressable>

            {isOpen && (
                <View style={BTCStyles.disclosureCard}>
                    <Row label="Play Sound">
                        <WheelPicker
                            options={soundOptions}
                            value={soundPath}
                            onChange={setSoundPath}
                            formatOption={formatSoundLabel}
                            renderTrigger={({ displayValue, open }) => <Chip displayValue={displayValue} onPress={open} />}
                        />
                    </Row>

                    <Row label="Every" last>
                        <TimeWheelPicker
                            label="Notify every"
                            valueMs={intervalMs}
                            onChange={setIntervalMs}
                            renderTrigger={({ displayValue, open }) => <Chip displayValue={displayValue} onPress={open} />}
                        />
                    </Row>
                </View>
            )}
        </View>
    );
}

function Row({ label, last, children }: { label: string; last?: boolean; children: React.ReactNode }) {
    return (
        <View style={[BTCStyles.disclosureRow, last && BTCStyles.disclosureRowLast]}>
            <Text style={BTCStyles.disclosureRowLabel}>{label}</Text>
            {children}
        </View>
    );
}

function Chip({ displayValue, onPress }: { displayValue: string; onPress: () => void }) {
    return (
        <Pressable style={BTCStyles.disclosureChip} onPress={onPress}>
            <Text style={BTCStyles.disclosureChipText} numberOfLines={1}>{displayValue}</Text>
        </Pressable>
    );
}
