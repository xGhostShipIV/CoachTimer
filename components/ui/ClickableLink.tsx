import { landingStyles } from "@/styles/BTCIntervalTimer";
import { Linking, Pressable, Text } from "react-native";

interface LinkProps {
    url: string;
    text?: string;
}

export default function Link({ url, text }: LinkProps) {
    return (
        <Pressable
            accessibilityRole="link"
            hitSlop={8}
            onPress={() => Linking.openURL(url)}
        >
            <Text style={landingStyles.footerUrl}>
                {text ?? url}
            </Text>
        </Pressable>
    )
}
