import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { NotificationData } from "./notification-container";
import { styles } from "./notification-styles";
import { getSoundNames } from "./sound-manager";

const DEFAULT_INTERVAL_SECONDS = '30';

// Will need:
export default function Notification({ index, data, onRemove, onUpdate }: { index: number, data: NotificationData, onRemove: (index: number) => void, onUpdate: (index: number, updatedData: NotificationData) => void }) {
    const [soundFiles, setSoundFiles] = useState<string[]>([]);

    useEffect(() => {
        setSoundFiles(getSoundNames());
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={[styles.fieldGroup, styles.soundGroup]}>
                    <Text style={styles.label}>Sound</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={data.soundPath}
                            onValueChange={(value, valueIndex) => {
                                onUpdate(index, { ...data, soundPath: value });
                            }}
                            style={styles.picker}
                        >
                            {soundFiles.map(file => (
                                <Picker.Item label={file} value={file} key={file} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={[styles.fieldGroup, styles.intervalGroup]}>
                    <TextInput
                        style={styles.input}
                        value={data.intervalSeconds.toString()}
                        onChangeText={(text) => {
                            const intervalSeconds = parseInt(text, 10);
                            if (!isNaN(intervalSeconds)) {
                                onUpdate(index, { ...data, intervalSeconds });
                            }
                        }}
                        placeholder={DEFAULT_INTERVAL_SECONDS}
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity
                    style={{
                        backgroundColor: "red",
                        borderRadius: 16,
                        width: 32,
                        height: 32,
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 8,
                    }}
                    onPress={() => onRemove(index)}
                >
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>×</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}