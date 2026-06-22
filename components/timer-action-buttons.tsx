import { TimeConfiguration } from "@/data/data-types";
import { listSavedConfigurations, saveConfiguration, SavedConfiguration } from "@/utils/configuration-storage";
import { ComponentProps, PropsWithChildren, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

type IconName = ComponentProps<typeof IconSymbol>["name"];

interface FloatingPromptButtonProps extends PropsWithChildren {
    icon: IconName;
    title: string;
    visible: boolean;
    onPress: () => void;
    onRequestClose: () => void;
}

// Shared chrome for a small icon button that opens a floating modal prompt:
// trigger -> Modal -> dim backdrop (tap to close) -> centered card -> title
// + caller-supplied body. Backs both SaveTimerButton and LoadTimerButton
// below, which differ only in their body content and open-state handling.
function FloatingPromptButton({ icon, title, visible, onPress, onRequestClose, children }: FloatingPromptButtonProps) {
    return (
        <>
            <Pressable style={styles.button} onPress={onPress} hitSlop={8}>
                <IconSymbol name={icon} size={18} color="#FFFFFF" />
            </Pressable>

            <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
                <KeyboardAvoidingView style={styles.keyboardAvoider} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <Pressable style={styles.backdrop} onPress={onRequestClose}>
                        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
                            <Text style={styles.title}>{title}</Text>
                            {children}
                        </Pressable>
                    </Pressable>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
}

interface SaveTimerButtonProps {
    configuration: TimeConfiguration;
    onSaved?: (name: string) => void;
}

// Small icon button that opens a floating name prompt for saving the
// current configuration, instead of taking up permanent space in the form.
export function SaveTimerButton({ configuration, onSaved }: SaveTimerButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");

    const close = () => {
        setIsOpen(false);
        setName("");
    };

    const handleSave = async () => {
        const trimmed = name.trim();
        if (!trimmed) return;

        await saveConfiguration(trimmed, configuration);
        onSaved?.(trimmed);
        close();
    };

    return (
        <FloatingPromptButton icon="square.and.arrow.down" title="Save Timer As" visible={isOpen} onPress={() => setIsOpen(true)} onRequestClose={close}>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Timer name"
                autoFocus
                onSubmitEditing={handleSave}
            />

            <View style={styles.actions}>
                <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={close}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
            </View>
        </FloatingPromptButton>
    );
}

interface LoadTimerButtonProps {
    onLoad: (entry: SavedConfiguration) => void;
}

// Small icon button that opens a floating list of saved configs to load,
// so loading a saved timer isn't only reachable from the home screen.
export function LoadTimerButton({ onLoad }: LoadTimerButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [saved, setSaved] = useState<SavedConfiguration[]>([]);

    const open = async () => {
        setSaved(await listSavedConfigurations());
        setIsOpen(true);
    };

    const handleLoad = (entry: SavedConfiguration) => {
        setIsOpen(false);
        onLoad(entry);
    };

    return (
        <FloatingPromptButton icon="list.bullet" title="Load Timer" visible={isOpen} onPress={open} onRequestClose={() => setIsOpen(false)}>
            {saved.length === 0 ? (
                <Text style={styles.emptyText}>No saved timers yet.</Text>
            ) : (
                <ScrollView style={styles.list}>
                    {saved.map((entry) => (
                        <Pressable key={entry.name} style={styles.row} onPress={() => handleLoad(entry)}>
                            <Text style={styles.rowText}>{entry.name}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            )}

            <Pressable style={[styles.actionButton, styles.cancelButton, styles.selfEnd]} onPress={() => setIsOpen(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
        </FloatingPromptButton>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
    },
    keyboardAvoider: {
        flex: 1,
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    card: {
        width: "100%",
        maxWidth: 360,
        maxHeight: "70%",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        gap: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1C1C1E",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
    },
    selfEnd: {
        alignSelf: "flex-end",
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    cancelButton: {
        backgroundColor: "#E0E0E0",
    },
    cancelButtonText: {
        color: "#333333",
        fontWeight: "700",
    },
    saveButton: {
        backgroundColor: "#1976D2",
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    emptyText: {
        fontSize: 14,
        color: "#666666",
    },
    list: {
        maxHeight: 280,
    },
    row: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        marginBottom: 8,
    },
    rowText: {
        fontSize: 16,
        color: "#000000",
    },
});
