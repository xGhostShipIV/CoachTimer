import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Notification from './notification';
import { styles } from './notification-styles';
import { getSoundNames } from './sound-manager';

const DEFAULT_INTERVAL_SECONDS = '30';

export interface NotificationData {
    soundPath: string;
    intervalSeconds: number;
}

interface AddNotificationProps {
    onCreate: (notification: NotificationData) => void;
}

// Owns notification state, but returns it/passes it to whatever component needs it
// So we will want to accept a callback prop where we provide our state.
const NotificationContainer: React.FC<AddNotificationProps> = () => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [soundFiles, setSoundFiles] = useState<string[]>([]);

    useEffect(() => {
        setSoundFiles(getSoundNames());
    }, []);

    // Add a new notification
    const handlePromptAdd = () => {
        setNotifications((previous) => {
            const newNotification: NotificationData = {
                soundPath: soundFiles[0],
                intervalSeconds: parseInt(DEFAULT_INTERVAL_SECONDS, 10),
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
    }

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
