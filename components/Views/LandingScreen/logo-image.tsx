import { landingStyles } from "@/styles/navyTheme";
import { Image } from 'expo-image';
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

// LinearGradient only fades along one axis, so two perpendicular gradients
// are layered inside the oval clip behind the mark — that way every edge
// (not just left/right or top/bottom) fades to alpha 0.
export default function LogoImage() {
    return (
        <View style={landingStyles.logoWrap}>
            <View style={landingStyles.logoGlow}>
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0)']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={landingStyles.logoGlowFill}
                />
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={landingStyles.logoGlowFill}
                />
            </View>
            <Image source={require('@/assets/images/btc-logo.png')} style={landingStyles.logo} />
        </View>
    );
}
