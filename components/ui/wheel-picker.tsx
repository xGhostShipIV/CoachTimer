import { BTCStyles, Color, Font, SETUP } from "@/styles/BTCIntervalTimer";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
    Animated,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const LIST_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
// How far (in items) a row fades out to its dimmest opacity.
const FADE_DISTANCE_ITEMS = 2;
const DIMMEST_OPACITY = 0.15;

interface WheelPickerProps<T extends string | number> {
    options: T[];
    value: T;
    onChange: (value: T) => void;
    // When provided, each option row gets a small delete button so an entry
    // can be removed without closing the picker (e.g. SavedTimerList deleting
    // a saved preset while browsing the list).
    onDeleteOption?: (option: T) => void;
    // Formats an option for display only — selection still keys off the raw
    // value. Defaults to String(option).
    formatOption?: (option: T) => string;
    // Notified whenever scrolling settles on a new centered option. Purely
    // informational — never triggers selection on its own — so a parent
    // wrapping this wheel in its own modal (e.g. TimeWheelPicker) can know
    // what to commit if the user dismisses without tapping a row directly.
    onCenterChange?: (value: T) => void;
    // When true (default), options stay hidden behind a closed trigger until
    // tapped, then open in a centered modal. When false, the wheel itself is
    // always visible and scrollable inline — no trigger, no modal.
    hideOptionsWhenUnfocused?: boolean;
    // Overrides for the closed trigger only (unused when
    // hideOptionsWhenUnfocused is false) — the wheel itself is always styled
    // from the BTC navy theme below.
    triggerStyle?: StyleProp<ViewStyle>;
    triggerTextStyle?: StyleProp<TextStyle>;
    // Replaces the default Pressable+Text trigger entirely (unused when
    // hideOptionsWhenUnfocused is false), so callers can build richer trigger
    // chrome (e.g. a labeled value field) while still reusing the modal/wheel
    // mechanics below.
    renderTrigger?: (params: { value: T; displayValue: string; open: () => void }) => React.ReactNode;
}

// A picker built around a fixed center band (the two orange lines) —
// whichever option is scrolled in between them is the candidate, but only
// two gestures ever commit a selection: tapping a specific option directly,
// or tapping outside the wheel to dismiss its modal (which commits whichever
// option is currently centered). Letting a scroll settle never commits by
// itself — centering an option is just navigation until one of those two
// gestures confirms it.
//
// By default the wheel stays hidden behind a closed trigger until tapped,
// opening in a centered modal (so it never intercepts touches meant for an
// ancestor ScrollView the way the native Picker widget did). Set
// hideOptionsWhenUnfocused={false} to skip the trigger/modal entirely and
// render the wheel directly in the layout, always visible — in that case
// only a direct tap on a row can commit, since there's no modal to dismiss.
export function WheelPicker<T extends string | number>({
    options,
    value,
    onChange,
    onDeleteOption,
    formatOption = (option) => String(option),
    onCenterChange,
    hideOptionsWhenUnfocused = true,
    triggerStyle,
    triggerTextStyle,
    renderTrigger,
}: WheelPickerProps<T>) {
    const [isOpen, setIsOpen] = useState(false);

    const indexOf = (target: T) => {
        const index = options.indexOf(target);
        return index === -1 ? 0 : index;
    };

    const centeredIndexRef = useRef(indexOf(value));
    const scrollY = useRef(new Animated.Value(indexOf(value) * ITEM_HEIGHT)).current;

    const openPicker = () => {
        const index = indexOf(value);
        centeredIndexRef.current = index;
        scrollY.setValue(index * ITEM_HEIGHT);
        setIsOpen(true);
    };

    const selectIndex = (index: number) => {
        const selected = options[index] ?? value;
        if (hideOptionsWhenUnfocused) setIsOpen(false);
        onChange(selected);
    };

    const trackCenteredIndex = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.min(Math.max(Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT), 0), options.length - 1);
        centeredIndexRef.current = index;
        onCenterChange?.(options[index] ?? value);
    };

    const wheel = (
        <View style={BTCStyles.wheel}>
            {/* Padding-free wrapper: RN ignores an ancestor's padding when
                positioning absolute children, so the indicator/fades live in
                here (not directly inside BTCStyles.wheel, which has padding)
                to share the exact same coordinate space as the ScrollView. */}
            <View style={styles.viewport}>
                <View pointerEvents="none" style={styles.centerIndicator} />

                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    contentOffset={{ x: 0, y: centeredIndexRef.current * ITEM_HEIGHT }}
                    contentContainerStyle={{ paddingVertical: (LIST_HEIGHT - ITEM_HEIGHT) / 2 }}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                        useNativeDriver: true,
                    })}
                    scrollEventThrottle={16}
                    onMomentumScrollEnd={trackCenteredIndex}
                    onScrollEndDrag={trackCenteredIndex}
                    style={{ height: LIST_HEIGHT }}
                >
                    {options.map((option, index) => {
                        const opacity = scrollY.interpolate({
                            inputRange: [
                                (index - FADE_DISTANCE_ITEMS) * ITEM_HEIGHT,
                                index * ITEM_HEIGHT,
                                (index + FADE_DISTANCE_ITEMS) * ITEM_HEIGHT,
                            ],
                            outputRange: [DIMMEST_OPACITY, 1, DIMMEST_OPACITY],
                            extrapolate: "clamp",
                        });

                        return (
                            <Animated.View key={String(option)} style={[styles.optionRow, { opacity }]}>
                                <Pressable style={styles.optionTextButton} onPress={() => selectIndex(index)}>
                                    <Text style={styles.optionText}>{formatOption(option)}</Text>
                                </Pressable>

                                {onDeleteOption && (
                                    <Pressable style={styles.deleteButton} onPress={() => onDeleteOption(option)} hitSlop={8}>
                                        <Text style={styles.deleteText}>×</Text>
                                    </Pressable>
                                )}
                            </Animated.View>
                        );
                    })}
                </Animated.ScrollView>

                <LinearGradient pointerEvents="none" colors={[SETUP.field, "transparent"]} style={BTCStyles.wheelFadeTop} />
                <LinearGradient pointerEvents="none" colors={["transparent", SETUP.field]} style={BTCStyles.wheelFadeBot} />
            </View>
        </View>
    );

    if (!hideOptionsWhenUnfocused) {
        return wheel;
    }

    return (
        <>
            {renderTrigger ? (
                renderTrigger({ value, displayValue: formatOption(value), open: openPicker })
            ) : (
                <Pressable style={[styles.trigger, triggerStyle]} onPress={openPicker}>
                    <Text style={[styles.triggerText, triggerTextStyle]}>{formatOption(value)}</Text>
                </Pressable>
            )}

            {isOpen && (
                <Modal transparent visible animationType="fade" onRequestClose={() => selectIndex(centeredIndexRef.current)}>
                    <Pressable style={BTCStyles.scrim} onPress={() => selectIndex(centeredIndexRef.current)}>
                        <Pressable style={BTCStyles.pickerCard} onPress={(event) => event.stopPropagation()}>
                            {wheel}
                        </Pressable>
                    </Pressable>
                </Modal>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    trigger: {
        height: 40,
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
    viewport: {
        height: LIST_HEIGHT,
    },
    centerIndicator: {
        position: "absolute",
        left: 20,
        right: 20,
        top: (LIST_HEIGHT - ITEM_HEIGHT) / 2,
        height: ITEM_HEIGHT,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: Color.orange,
        zIndex: 1,
    },
    optionRow: {
        height: ITEM_HEIGHT,
        flexDirection: "row",
        alignItems: "center",
    },
    optionTextButton: {
        flex: 1,
        height: ITEM_HEIGHT,
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    optionText: {
        fontFamily: Font.oswaldSemi,
        fontSize: 18,
        letterSpacing: 0.5,
        color: Color.white,
        textAlign: "center",
    },
    deleteButton: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    deleteText: {
        color: Color.orange,
        fontSize: 18,
        fontWeight: "700",
        lineHeight: 18,
    },
});
