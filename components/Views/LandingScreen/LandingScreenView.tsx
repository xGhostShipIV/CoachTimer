import { ActiveView } from "@/app";
import SavedTimerList from "@/components/saved-timer-list";
import SuggestedTimers from "@/components/suggested-timers";
import Link from "@/components/ui/ClickableLink";
import Concrete from "@/components/ui/ConcreteButton";
import { Color } from "@/styles/BTCIntervalTimer";
import { landingStyles } from "@/styles/navyTheme";
import { SavedConfiguration } from "@/utils/configuration-storage";
import React, { SetStateAction, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LogoImage from "./logo-image";

interface HomeScreenProps {
    setActiveView: React.Dispatch<SetStateAction<ActiveView | undefined>>;
    loadedPreset: SavedConfiguration | undefined;
    setLoadedPreset: React.Dispatch<SetStateAction<SavedConfiguration | undefined>>;
}

export default function LandingScreen({ setActiveView, loadedPreset, setLoadedPreset }: HomeScreenProps) {
    const [savedListVersion, setSavedListVersion] = useState(0);

    return (
        <>
            <LogoImage />

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[
                    { flexGrow: 1 }
                ]}
            >
                <SuggestedTimers
                    onSelect={(entry) => {
                        setLoadedPreset(entry);
                        setActiveView('interval');
                    }}
                    refreshSignal={savedListVersion}
                    onDataChanged={() => setSavedListVersion((version) => version + 1)}
                />

                <View style={landingStyles.ctaGroup}>
                    <Concrete
                        ledge={Color.orangeLedge}
                        onPress={() => {
                            setLoadedPreset(undefined);
                            setActiveView('interval');
                        }}
                    >
                        <View style={landingStyles.ctaPrimary}>
                            <Text style={landingStyles.ctaPrimaryText}>▸ INTERVAL TIMER</Text>
                        </View>
                    </Concrete>

                    <Concrete ledge={Color.navyLedge} onPress={() => setActiveView('stopwatch')}>
                        <View style={landingStyles.ctaSecondary}>
                            <Text style={landingStyles.ctaSecondaryText}>⏱ STOPWATCH</Text>
                        </View>
                    </Concrete>
                </View>

                <SavedTimerList
                    onLoad={(entry) => {
                        setLoadedPreset(entry);
                        setActiveView('interval');
                    }}
                    onDeleted={() => setSavedListVersion((version) => version + 1)}
                    refreshSignal={savedListVersion}
                />

                <Link
                    url="https://www.btcworkout.com/"
                    text="btcworkout.com"
                />
            </ScrollView>
        </>
    )
}