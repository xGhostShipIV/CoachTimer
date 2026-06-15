import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 16,
        alignItems: 'center',
        borderRadius: 16,
        overflow: 'hidden',
    },
    emptyContainer: {
        borderWidth: 4,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        borderRadius: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 12,
    },
    fieldGroup: {
        minWidth: 0,
    },
    soundGroup: {
        flex: 2,
    },
    intervalGroup: {
        flex: 1
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        width: '100%',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
    },
    picker: {

        width: '100%'
    },
    createButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28,
    },
    promptButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    promptButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});