declare module "react-native/Libraries/Components/TextInput/TextInputState" {
    interface TextInputStateModule {
        // Opaque host-component instance, passed straight through to
        // ScrollView's own scrollResponderScrollNativeHandleToKeyboard.
        currentlyFocusedInput(): unknown;
    }

    const TextInputState: TextInputStateModule;
    export default TextInputState;
}
