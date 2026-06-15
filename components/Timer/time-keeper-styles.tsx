import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 48,
        gap: 20,
    },
    labelText: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    timerText: {
        fontSize: 36,
        lineHeight: 48,
        fontWeight: '800',
        textAlign: 'center',
        width: '100%',
        fontVariant: ['tabular-nums'],
        fontFamily: 'monospace',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: 140,
        alignItems: 'center',
    },
    buttonMargin: {
        marginRight: 12,
    },
    buttonPaused: {
        backgroundColor: '#4CAF50',
    },
    buttonRunning: {
        backgroundColor: '#E53935',
    },
    buttonClear: {
        backgroundColor: '#1976D2',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
});