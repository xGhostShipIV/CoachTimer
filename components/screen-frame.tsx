import { Color } from "@/styles/BTCIntervalTimer";
import { scrollFocusedInputIntoView } from "@/utils/scroll-focused-input-into-view";
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
// gesture-handler's ScrollView negotiates with nested Pressables/TextInputs
// far better than the core ScrollView, which otherwise loses the gesture to
// whatever touchable the drag happens to start on. The tradeoff: it doesn't
// trigger core ScrollView's built-in "scroll the focused input above the
// keyboard" behavior on its own, so we trigger it manually via
// scrollFocusedInputIntoView (platform-split since the native module it
// needs on iOS/Android can't be bundled for web).
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FOCUSED_INPUT_TOP_PADDING = 24;

const ScreenBackgroundContext = createContext<((color: string | null) => void) | null>(null);

// Lets a screen rendered inside ScreenFrame override the frame's own
// background — otherwise only that screen's own content box would change
// color (e.g. the active timer's work/recover/round-rest tint), while the
// frame still paints static navy behind the status bar/notch above it,
// leaving a visible seam. Pass null (or unmount) to revert to the default.
export function useScreenBackground(color: string | null) {
    const setBackground = useContext(ScreenBackgroundContext);

    useEffect(() => {
        setBackground?.(color);
        return () => setBackground?.(null);
    }, [color, setBackground]);
}

// Edge-to-edge wrapper for a full-screen view (matches the Home screen's
// full-bleed background — no margins/border, so there's never a gap
// exposing a different background color). The safe-area top inset is
// applied as padding (not margin) so the fill extends behind the status
// bar/notch while content still clears it. Content scrolls if it ever grows
// past the frame's height (e.g. an expanded sound-options picker pushing
// content offscreen); flexGrow:1 keeps it filling the frame instead of
// shrinking when short.
export function ScreenFrame({ children }: PropsWithChildren) {
    const insets = useSafeAreaInsets();
    const scrollRef = useRef<ScrollView>(null);
    const [background, setBackground] = useState<string | null>(null);

    useEffect(() => {
        const subscription = Keyboard.addListener("keyboardDidShow", () => {
            scrollFocusedInputIntoView(scrollRef, FOCUSED_INPUT_TOP_PADDING);
        });

        return () => subscription.remove();
    }, []);

    return (
        <ScreenBackgroundContext.Provider value={setBackground}>
            <View style={[styles.frame, { paddingTop: insets.top, backgroundColor: background ?? Color.white }]}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView
                        ref={scrollRef}
                        style={{ flex: 1 }}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {children}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </ScreenBackgroundContext.Provider>
    );
}

const styles = StyleSheet.create({
    frame: {
        flex: 1,
    },
});
