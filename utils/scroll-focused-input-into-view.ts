import type { RefObject } from "react";
import type { ScrollView } from "react-native-gesture-handler";
import TextInputState from "react-native/Libraries/Components/TextInput/TextInputState";

// gesture-handler's ScrollView forwards its ref straight to the underlying
// core ScrollView instance, so its built-in keyboard-avoidance method is
// still available even though gesture-handler's own ScrollView doesn't
// trigger it automatically.
export function scrollFocusedInputIntoView(scrollRef: RefObject<ScrollView | null>, additionalOffset: number) {
    const focusedInput = TextInputState.currentlyFocusedInput();
    if (!focusedInput) return;

    scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard(focusedInput, additionalOffset, true);
}
