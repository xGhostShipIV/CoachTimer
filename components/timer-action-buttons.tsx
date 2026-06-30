import { TimeConfiguration } from "@/data/data-types";
import { Color, Font, SETUP } from "@/styles/BTCIntervalTimer";
import { listSavedConfigurations, saveConfiguration, SavedConfiguration } from "@/utils/configuration-storage";
import { ComponentProps, PropsWithChildren, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

type IconName = ComponentProps<typeof IconSymbol>["name"];

interface IconButtonProps {
    icon?: IconName;
    // Renders a text chip instead of the icon glyph when provided.
    label?: string;
    onPress?: () => void;
    size?: number;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

// Small circular translucent icon button (or, when `label` is given, a text
// chip instead) — the shared visual atom behind BackButton and the trigger
// for each FloatingPromptButton below.
function IconButton({ icon, label, onPress, size = 18, style, textStyle }: IconButtonProps) {
    return (
        <Pressable style={[styles.button, style]} onPress={onPress} hitSlop={8}>
            {label ? (
                <Text style={[styles.buttonLabel, textStyle]}>{label}</Text>
            ) : (
                icon && <IconSymbol name={icon} size={size} color="#FFFFFF" />
            )}
        </Pressable>
    );
}

interface BackButtonProps {
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

export function BackButton({ onPress, style }: BackButtonProps) {
    return <IconButton icon="chevron.left" size={20} onPress={onPress} style={style} />;
}

interface FloatingPromptButtonProps extends PropsWithChildren {
    icon?: IconName;
    label?: string;
    title: string;
    visible: boolean;
    onPress: () => void;
    onRequestClose: () => void;
    triggerStyle?: StyleProp<ViewStyle>;
    triggerTextStyle?: StyleProp<TextStyle>;
}

// Shared chrome for a small button that opens a floating modal prompt:
// trigger -> Modal -> dim backdrop (tap to close) -> centered card -> title
// + caller-supplied body. Backs both SaveTimerButton and LoadTimerButton
// below, which differ only in their body content and open-state handling.
function FloatingPromptButton({ icon, label, title, visible, onPress, onRequestClose, triggerStyle, triggerTextStyle, children }: FloatingPromptButtonProps) {
    return (
        <>
            <IconButton icon={icon} label={label} onPress={onPress} style={triggerStyle} textStyle={triggerTextStyle} />

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
    triggerStyle?: StyleProp<ViewStyle>;
    triggerTextStyle?: StyleProp<TextStyle>;
}

// Small button that opens a floating name prompt for saving the current
// configuration, instead of taking up permanent space in the form.
export function SaveTimerButton({ configuration, onSaved, triggerStyle, triggerTextStyle }: SaveTimerButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    // Set to the trimmed name once we've detected it collides with an
    // existing saved timer, so the prompt can switch to an overwrite
    // confirmation step instead of saving immediately.
    const [pendingOverwriteName, setPendingOverwriteName] = useState<string | null>(null);

    const close = () => {
        setIsOpen(false);
        setName("");
        setPendingOverwriteName(null);
    };

    const doSave = async (trimmed: string) => {
        await saveConfiguration(trimmed, configuration);
        onSaved?.(trimmed);
        close();
    };

    const handleSave = async () => {
        const trimmed = name.trim();
        if (!trimmed) return;

        const existing = await listSavedConfigurations();
        if (existing.some((entry) => entry.name === trimmed)) {
            setPendingOverwriteName(trimmed);
            return;
        }

        await doSave(trimmed);
    };

    return (
        <FloatingPromptButton
            icon="square.and.arrow.down"
            label="SAVE"
            title={pendingOverwriteName ? "Overwrite Timer?" : "Save Timer As"}
            visible={isOpen}
            onPress={() => setIsOpen(true)}
            onRequestClose={close}
            triggerStyle={triggerStyle}
            triggerTextStyle={triggerTextStyle}
        >
            {pendingOverwriteName ? (
                <>
                    <Text style={styles.bodyText}>{`A timer named "${pendingOverwriteName}" already exists. Overwrite it?`}</Text>

                    <View style={styles.actions}>
                        <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={() => setPendingOverwriteName(null)}>
                            <Text style={styles.cancelButtonText}>Keep Editing</Text>
                        </Pressable>
                        <Pressable style={[styles.actionButton, styles.saveButton]} onPress={() => doSave(pendingOverwriteName)}>
                            <Text style={styles.saveButtonText}>Overwrite</Text>
                        </Pressable>
                    </View>
                </>
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Timer name"
                        placeholderTextColor={SETUP.labelDim}
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
                </>
            )}
        </FloatingPromptButton>
    );
}

interface LoadTimerButtonProps {
    onLoad: (entry: SavedConfiguration) => void;
    triggerStyle?: StyleProp<ViewStyle>;
    triggerTextStyle?: StyleProp<TextStyle>;
}

// Small button that opens a floating list of saved configs to load, so
// loading a saved timer isn't only reachable from the home screen.
export function LoadTimerButton({ onLoad, triggerStyle, triggerTextStyle }: LoadTimerButtonProps) {
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
        <FloatingPromptButton
            icon="list.bullet"
            label="LOAD"
            title="Load Timer"
            visible={isOpen}
            onPress={open}
            onRequestClose={() => setIsOpen(false)}
            triggerStyle={triggerStyle}
            triggerTextStyle={triggerTextStyle}
        >
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
        minWidth: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
    },
    buttonLabel: {
        fontFamily: Font.oswaldSemi,
        fontSize: 13,
        letterSpacing: 1.5,
        color: Color.white,
    },
    keyboardAvoider: {
        flex: 1,
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(6, 10, 22, 0.66)",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    card: {
        width: "100%",
        maxWidth: 360,
        maxHeight: "70%",
        backgroundColor: "#0c1530",
        borderWidth: 1,
        borderColor: "#21305a",
        borderRadius: 12,
        padding: 20,
        gap: 12,
    },
    title: {
        fontFamily: Font.oswaldSemi,
        fontSize: 16,
        letterSpacing: 1,
        color: Color.white,
    },
    bodyText: {
        fontFamily: Font.barlowSemi,
        fontSize: 14,
        color: SETUP.label,
    },
    input: {
        backgroundColor: SETUP.field,
        borderWidth: 1,
        borderColor: SETUP.fieldBorder,
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        color: Color.white,
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
        backgroundColor: SETUP.chip,
        borderWidth: 1,
        borderColor: SETUP.chipBorder,
    },
    cancelButtonText: {
        fontFamily: Font.oswaldSemi,
        color: Color.white,
        letterSpacing: 0.5,
    },
    saveButton: {
        backgroundColor: Color.orange,
    },
    saveButtonText: {
        fontFamily: Font.oswaldBold,
        color: Color.navy,
        letterSpacing: 0.5,
    },
    emptyText: {
        fontFamily: Font.barlowSemi,
        fontSize: 14,
        color: SETUP.label,
    },
    list: {
        maxHeight: 280,
    },
    row: {
        backgroundColor: SETUP.chip,
        borderWidth: 1,
        borderColor: SETUP.chipBorder,
        borderRadius: 6,
        padding: 10,
        marginBottom: 8,
    },
    rowText: {
        fontFamily: Font.oswaldSemi,
        fontSize: 15,
        color: Color.white,
    },
});
