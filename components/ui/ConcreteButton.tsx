import { Pressable, StyleProp, View, ViewStyle } from "react-native";

/** "Concrete" button: hard color ledge + soft drop shadow. */
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
        style={[
          {
            borderRadius: radius,
            // soft drop
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 9 },
            shadowOpacity: 0.45,
            shadowRadius: 16,
            elevation: 8,
          },
          style,
        ]}
      >
        {children}
      </Pressable>
    </View>
  );
}