import { DEFAULT_CONFIG } from "@/constants/data-constants";
import { TimeConfiguration } from "@/data/data-types";
import { BTCStyles, Color } from "@/styles/BTCIntervalTimer";
import { SavedConfiguration } from "@/utils/configuration-storage";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BackButton, LoadTimerButton, SaveTimerButton } from "../timer-action-buttons";

interface ToolbarHeaderProps {
    onBack?: () => void;
    onLoad: (entry: SavedConfiguration) => void;
    onSave?: (name: string) => void;
    configuration?: TimeConfiguration | undefined;
    // Name the current configuration was loaded from (or last saved as), if
    // any, so the save prompt can prefill it and detect the overwrite case.
    currentName?: string;
    allowSaveLoad?: boolean;
}

export default function ToolbarHeaderView({ onBack, onLoad, onSave, configuration, currentName, allowSaveLoad = true }: ToolbarHeaderProps) {
    return (
        <View style={BTCStyles.toolbar}>
            {onBack ? <BackButton onPress={onBack} style={BTCStyles.toolBack} /> : <View style={localStyles.backSpacer} />}

            {
                allowSaveLoad ?
                <View style={localStyles.toolbarActions}>
                    <LoadTimerButton
                        onLoad={onLoad}
                        triggerStyle={BTCStyles.toolChip}
                        triggerTextStyle={BTCStyles.toolChipText}
                    />
                    <SaveTimerButton
                        configuration={configuration ?? DEFAULT_CONFIG}
                        initialName={currentName}
                        onSaved={onSave}
                        triggerStyle={BTCStyles.toolChip}
                        triggerTextStyle={BTCStyles.toolChipText}
                    />
                </View> : <></>
            }
        </View>
    );
}

const localStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.navy,
    },
    backSpacer: {
        width: 42,
    },
    nameRuleSpacing: {
        marginBottom: 20,
    },
    toolbarActions: {
        flexDirection: "row",
        gap: 9,
        marginLeft: "auto",
    },
    body: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    section: {
        marginBottom: 16,
    },
});