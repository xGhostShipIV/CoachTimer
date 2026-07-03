import { Pressable, StyleProp, View, ViewStyle } from "react-native";

/** "Concrete" button: hard color ledge + soft drop shadow. Presses shrink the
 *  face slightly and wash it with a light overlay, so it reads as sinking
 *  toward the ledge instead of just recoloring flatly. */
export default function Concrete({
  ledge,
  radius = 6,
  children,
  style,
  onPress,
}: {
  ledge: string;
  radius?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  return (
    <View>
      {/* hard ledge sitting 4px below the face */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 4,
          bottom: -4,
          backgroundColor: ledge,
          borderRadius: radius,
        }}
      />
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            borderRadius: radius,
            // soft drop
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 9 },
            shadowOpacity: 0.45,
            shadowRadius: 16,
            elevation: 8,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
          style,
        ]}
      >
        {(state) => (
          <View style={{ borderRadius: radius, overflow: 'hidden' }}>
            {children}
            {state.pressed && (
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255,255,255,0.18)',
                }}
              />
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
}