import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

// Swap to a real ad unit ID from your AdMob account before shipping —
// TestIds.BANNER always serves Google's sample test creative, regardless of
// platform, and is safe to leave wired in during development.
const BANNER_AD_UNIT_ID = TestIds.BANNER;

export default function HomeBannerAd() {
    return (
        <View style={styles.wrapper}>
            <BannerAd unitId={BANNER_AD_UNIT_ID} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        marginVertical: 16,
    },
});
