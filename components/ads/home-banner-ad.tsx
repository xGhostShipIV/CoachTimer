import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

// const BANNER_AD_UNIT_ID = TestIds.BANNER;
const BANNER_AD_UNIT_ID = "ca-app-pub-4319721445473335/6886007279";


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
