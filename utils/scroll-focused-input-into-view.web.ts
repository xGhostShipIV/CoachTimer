import type { RefObject } from "react";
import type { ScrollView } from "react-native-gesture-handler";

// No-op on web: the underlying react-native-internal module this relies on
// (react-native/Libraries/Components/TextInput/TextInputState) pulls in
// native-only renderer code that can't be bundled for web, and browsers
// already scroll focused inputs into view above the on-screen keyboard
// on their own, so there's nothing to do here.
export function scrollFocusedInputIntoView(_scrollRef: RefObject<ScrollView | null>, _additionalOffset: number) {}
