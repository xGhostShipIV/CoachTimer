import { useRef, useState } from "react";
import {
    Animated,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const LIST_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const FADE_DURATION_MS = 150;

interface Anchor {
    x: number;
    y: number;
    width: number;
}

interface WheelPickerProps<T extends string | number> {
    options: T[];
    value: T;
    onChange: (value: T) => void;
}

// A compact, closed-by-default picker. Opening it floats a scrollable list of
// options over the screen (in a Modal, so it never affects surrounding
// layout) anchored to the trigger's position. Swiping scrolls the list;
// tapping an option selects it; tapping outside selects whichever option is
// centered. Being a Modal/Pressable/ScrollView stack with nothing rendered
// at all while closed, it never intercepts touches meant for an ancestor
// ScrollView the way the native Picker widget did.
export function WheelPicker<T extends string | number>({ options, value, onChange }: WheelPickerProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [anchor, setAnchor] = useState<Anchor | null>(null);
    const triggerRef = useRef<View>(null);
    const centeredIndexRef = useRef(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const indexOf = (target: T) => {
        const index = options.indexOf(target);
        return index === -1 ? 0 : index;
    };

    const openPicker = () => {
        triggerRef.current?.measureInWindow((x, y, width) => {
            centeredIndexRef.current = indexOf(value);
            fadeAnim.setValue(1);
            setAnchor({ x, y, width });
            setIsOpen(true);
        });
    };

    const closeWithSelection = (index: number) => {
        const selected = options[index] ?? value;
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: FADE_DURATION_MS,
            useNativeDriver: true,
        }).start(() => {
            setIsOpen(false);
            onChange(selected);
        });
    };

    const trackCenteredIndex = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
        centeredIndexRef.current = Math.min(Math.max(index, 0), options.length - 1);
    };

    return (
        <>
            <Pressable ref={triggerRef} style={styles.trigger} onPress={openPicker}>
                <Text style={styles.triggerText}>{String(value)}</Text>
            </Pressable>

            {isOpen && anchor && (
                <Modal transparent visible animationType="none" onRequestClose={() => closeWithSelection(centeredIndexRef.current)}>
                    <Pressable style={styles.backdrop} onPress={() => closeWithSelection(centeredIndexRef.current)}>
                        <Animated.View
                            style={[
                                styles.panel,
                                {
                                    opacity: fadeAnim,
                                    top: anchor.y + ITEM_HEIGHT / 2 - LIST_HEIGHT / 2,
                                    left: anchor.x,
                                    width: anchor.width,
                                },
                            ]}
                        >
                            <Pressable onPress={(event) => event.stopPropagation()}>
                                <View pointerEvents="none" style={styles.centerIndicator} />

                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    snapToInterval={ITEM_HEIGHT}
                                    decelerationRate="fast"
                                    contentOffset={{ x: 0, y: centeredIndexRef.current * ITEM_HEIGHT }}
                                    contentContainerStyle={{ paddingVertical: (LIST_HEIGHT - ITEM_HEIGHT) / 2 }}
                                    onMomentumScrollEnd={trackCenteredIndex}
                                    onScrollEndDrag={trackCenteredIndex}
                                    style={{ height: LIST_HEIGHT }}
                                >
                                    {options.map((option, index) => (
                                        <Pressable key={String(option)} style={styles.optionRow} onPress={() => closeWithSelection(index)}>
                                            <Text style={styles.optionText}>{String(option)}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </Pressable>
                        </Animated.View>
                    </Pressable>
                </Modal>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    trigger: {
        height: ITEM_HEIGHT,
        width: 180,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
    },
    triggerText: {
        fontSize: 16,
        color: "#000000",
    },
    backdrop: {
        flex: 1,
    },
    panel: {
        position: "absolute",
        height: LIST_HEIGHT,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    centerIndicator: {
        position: "absolute",
        left: 0,
        right: 0,
        top: (LIST_HEIGHT - ITEM_HEIGHT) / 2,
        height: ITEM_HEIGHT,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.2)",
        zIndex: 1,
    },
    optionRow: {
        height: ITEM_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
    },
    optionText: {
        fontSize: 16,
        color: "#000000",
    },
});
