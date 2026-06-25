import { ActiveView } from "@/app";
import SavedTimerList from "@/components/saved-timer-list";
import SuggestedTimers from "@/components/suggested-timers";
import Link from "@/components/ui/ClickableLink";
import Concrete from "@/components/ui/ConcreteButton";
import { Color } from "@/styles/main-styles";
import { landingStyles } from "@/styles/navyTheme";
import { SavedConfiguration } from "@/utils/configuration-storage";
import React, { SetStateAction, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface HomeScreenProps {
    setActiveView: React.Dispatch<SetStateAction<ActiveView | undefined>>;
    loadedPreset: React.RefObject<SavedConfiguration | undefined>;
}

export default function LandingScreen({ setActiveView, loadedPreset }: HomeScreenProps) {
    const [savedListVersion, setSavedListVersion] = useState(0);

    return (
        <ScrollView
            contentContainerStyle={[
                { flexGrow: 1 }
            ]}
        >
            <SuggestedTimers
                onSelect={(entry) => {
                    loadedPreset.current = entry;
                    setActiveView('interval');
                }}
                refreshSignal={savedListVersion}
                onDataChanged={() => setSavedListVersion((version) => version + 1)}
            />

            <View style={landingStyles.ctaGroup}>
                <Concrete
                    ledge={Color.orangeLedge}
                    onPress={() => {
                        loadedPreset.current = undefined;
                        setActiveView('interval');
                    }}
                >
                    <View style={landingStyles.ctaPrimary}>
                        <Text style={landingStyles.ctaPrimaryText}>▸ INTERVAL TIMER</Text>
                    </View>
                </Concrete>

                <Pressable style={landingStyles.ctaSecondary} onPress={() => setActiveView('stopwatch')}>
                    <Text style={landingStyles.ctaSecondaryText}>⏱ STOPWATCH</Text>
                </Pressable>
            </View>

            <SavedTimerList
                onLoad={(entry) => {
                    loadedPreset.current = entry;
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
    )
}