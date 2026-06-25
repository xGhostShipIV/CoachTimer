import { landingStyles } from "@/styles/navyTheme";
import { Linking, Pressable, Text, View } from "react-native";

interface LinkProps {
    url: string;
    text?: string;
}

export default function Link({ url, text }: LinkProps) {
    return (
        <View style={landingStyles.footer}>
            <Pressable onPress={() => Linking.openURL(url)}>
                <Text style={landingStyles.footerUrl}>
                    {
                        text != undefined ?
                            text : url
                    }
                </Text>
            </Pressable>
        </View>
    )
}