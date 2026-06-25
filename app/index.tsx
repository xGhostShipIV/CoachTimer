import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import IntervalView from '@/components/Views/IntervalRoundTimer/interval-view';
import LandingScreen from '@/components/Views/LandingScreen/LandingScreenView';
import ToolbarHeaderView from '@/components/Views/ToolbarHeaderView';
import { Color } from '@/styles/BTCIntervalTimer';
import { SavedConfiguration } from '@/utils/configuration-storage';

export type ActiveView = 'interval' | 'stopwatch';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    // Yes, changing the active view should trigger a re-render
    const [activeView, setActiveView] = useState<ActiveView | undefined>(undefined);

    const loadedPreset = useRef<SavedConfiguration | undefined>(undefined);

    // What if I refactor this so that we have one top level container
    // this container has three areas: header, content, footer
    // all of our views will be rendered inside of the content container
    // header/footer will resize height depending on their content
    // so if they are empty (i.e. no ad showing) they will not consume screen space

    // what would this look like then?

    let header = <></>
    let content = <LandingScreen 
                    setActiveView={setActiveView}
                    loadedPreset={loadedPreset}
                />;

    if (activeView == 'interval') {
        content = <IntervalView 
                    onBack={() => setActiveView(undefined)}
                    initialEntry={loadedPreset.current}
                />;
    }

    return (
        <View style={{ ...styles.fullScreen, paddingTop: insets.top }}>
            {/* Header */}
            <View style={{ backgroundColor: Color.white }}>
                {
                    /*
                     * Here goes header content.
                     * Determined by our content state.
                     * To start us out, we have our logo.
                     */
                    <ToolbarHeaderView 
                        onBack={() => setActiveView(undefined)}
                        // this doesnt re-render...
                        onLoad={(entry) => loadedPreset.current = entry}
                    />
                }
            </View>

            {/* Content */}
            <View style={{ flexGrow: 1, backgroundColor: Color.navy }}>
                { content }
            </View>

            {/* Footer */}
            <View style={{ height: 0, backgroundColor: Color.orange }}>
                {
                    /* 
                       Here goes our ad controller 
                       must be able to affect height of parent container.
                       State driven?
                    */
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: Color.navy,
    },
    scrollContent: {
        flexGrow: 1,
    },
});
