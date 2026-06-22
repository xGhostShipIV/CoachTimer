import mainStyles from "@/styles/main-styles";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
// gesture-handler's ScrollView negotiates with nested Pressables/TextInputs
// far better than the core ScrollView, which otherwise loses the gesture to
// whatever touchable the drag happens to start on. The tradeoff: it doesn't
// trigger core ScrollView's built-in "scroll the focused input above the
// keyboard" behavior on its own, so we trigger it manually below (the
// gesture-handler wrapper forwards its ref straight to the underlying core
// ScrollView instance, so that built-in method is still available on it).
import { ScrollView } from "react-native-gesture-handler";
import TextInputState from "react-native/Libraries/Components/TextInput/TextInputState";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "./themed-view";

const FRAME_MARGIN = 12;
const FOCUSED_INPUT_TOP_PADDING = 24;

// Encapsulates a full-screen view in a bordered frame. Left/right/bottom
// margins stay small, but the top margin adds the device's safe-area inset
// so content (e.g. a back button) clears the status bar/notch and stays
// comfortably tappable. Content scrolls if it ever grows past the frame's
// height (e.g. an expanded sound-options picker pushing content offscreen);
// flexGrow:1 keeps it filling the frame instead of shrinking when short.
export function ScreenFrame({ children }: PropsWithChildren) {
    const insets = useSafeAreaInsets();
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        const subscription = Keyboard.addListener("keyboardDidShow", () => {
            const focusedInput = TextInputState.currentlyFocusedInput();
            if (!focusedInput) return;

            scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard(
                focusedInput,
                FOCUSED_INPUT_TOP_PADDING,
                true
            );
        });

        return () => subscription.remove();
    }, []);

    return (
        <ThemedView
            style={[
                mainStyles.screenFrame,
                {
                    marginTop: insets.top + FRAME_MARGIN,
                    marginLeft: FRAME_MARGIN,
                    marginRight: FRAME_MARGIN,
                    marginBottom: FRAME_MARGIN,
                },
            ]}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    ref={scrollRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 300 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}
