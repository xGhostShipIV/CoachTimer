import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Notification from './notification';
import { styles } from './notification-styles';
import { getSoundNames, useSoundManager } from './sound-manager';

const DEFAULT_INTERVAL_SECONDS = '30';

export interface NotificationData {
    soundPath: string;
    // stored as milliseconds
    intervalMs: number;
}

interface NotificationContainerProps {
    tickHandlerRef?: React.MutableRefObject<(delta: number) => void>;
    resetSignal?: number;
}

function soundNameFromPath(soundPath: string) {
    return soundPath.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '');
}

// Owns notification state, but returns it/passes it to whatever component needs it
// So we will want to accept a callback prop where we provide our state.
const NotificationContainer: React.FC<NotificationContainerProps> = ({ tickHandlerRef, resetSignal }) => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [soundFiles, setSoundFiles] = useState<string[]>([]);
    const notificationTimersRef = useRef<number[]>([]);
    const notificationsRef = useRef<NotificationData[]>([]);
    const lastResetSignalRef = useRef<number | undefined>(undefined);

    const notificationSet = useSoundManager();
    
    useEffect(() => {
        setSoundFiles(getSoundNames());
    }, []);

    useEffect(() => {
        notificationsRef.current = notifications;
        notificationTimersRef.current = notifications.map((_, index) => notificationTimersRef.current[index] ?? 0);
    }, [notifications]);

    useEffect(() => {
        if (resetSignal === undefined || resetSignal === lastResetSignalRef.current) {
            return;
        }

        notificationTimersRef.current = notificationsRef.current.map(() => 0);
        lastResetSignalRef.current = resetSignal;
    }, [resetSignal]);

    // Add a new notification
    const handlePromptAdd = () => {
        setNotifications((previous) => {
            const newNotification: NotificationData = {
                soundPath: soundFiles[0],
                intervalMs: parseInt(DEFAULT_INTERVAL_SECONDS, 10) * 1000,
            };
            return [...previous, newNotification];
        })
    };

    const handleRemove = (index: number) => {
        setNotifications((previous) => {
            const newNotifications = [...previous];
            newNotifications.splice(index, 1);
            return newNotifications;
        });
    }

    const handleUpdate = (index: number, updatedData: NotificationData) => {
        setNotifications((previous) => {
            const newNotifications = [...previous];
            newNotifications[index] = updatedData;
            return newNotifications;
        });
    };

    useEffect(() => {
        if (!tickHandlerRef) {
            return;
        }

        tickHandlerRef.current = (delta: number) => {
            if (delta <= 0 || notifications.length === 0) {
                return;
            }

            let bestNotificationIndex: number | null = null;
            let bestIntervalSeconds = 0;

            notificationTimersRef.current = notificationTimersRef.current.map((elapsed, index) => {
                const notification = notifications[index];
                const nextElapsed = elapsed + delta;
                const intervalMillis = notification.intervalMs;

                if (intervalMillis <= 0) {
                    return nextElapsed;
                }

                if (nextElapsed >= intervalMillis) {
                    const intervalSeconds = Math.round((notification.intervalMs ?? 0) / 1000);
                    if (intervalSeconds > bestIntervalSeconds) {
                        bestIntervalSeconds = intervalSeconds;
                        bestNotificationIndex = index;
                    }
                    // Prevent the bleeding of milliseconds since the values will
                    // almost never properly align
                    return nextElapsed - intervalMillis;
                }

                return nextElapsed;
            });

            if (bestNotificationIndex !== null) {
                const soundName = soundNameFromPath(notifications[bestNotificationIndex].soundPath);
                if (soundName) {
                    console.log('playing sound');
                    notificationSet(soundName);
                }
            }
        };
    }, [notifications, notificationSet, tickHandlerRef]);

    return (
        <View style={[styles.container, styles.emptyContainer]}>
            {notifications.map((notification, index) => (
                <Notification key={index} index={index} data={notification} onRemove={handleRemove} onUpdate={handleUpdate} />
            ))}

            <TouchableOpacity style={styles.promptButton} onPress={handlePromptAdd}>
                <Text style={styles.promptButtonText}>Add a notification</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NotificationContainer;
