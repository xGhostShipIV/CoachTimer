// Sound options editor component
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { sfxNames } from '@/constants/asset-constants';
import { SoundOptions } from '@/data/data-types';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface SoundOptionsProps {
	options: SoundOptions;
	onChange: (next: SoundOptions) => void;
}

export default function SoundOptionsContainer({ options, onChange }: SoundOptionsProps) {
	const setField = <K extends keyof SoundOptions>(key: K, value: SoundOptions[K]) => {
		onChange({ ...options, [key]: value });
	};

	return (
		<ThemedView style={styles.container}>
			<ThemedView style={styles.fieldContainer}>
				<ThemedText style={styles.label}>Round Start SFX</ThemedText>
				<Picker
					style={styles.picker}
					selectedValue={options?.roundStartSfx ?? ''}
					onValueChange={(value) => setField('roundStartSfx', value === '' ? undefined : value)}
				>
					<Picker.Item label="None" value="" />
					{sfxNames.map((name) => (
						<Picker.Item key={name} label={name} value={name} />
					))}
				</Picker>
			</ThemedView>

			<ThemedView style={styles.fieldContainer}>
				<ThemedText style={styles.label}>Round End SFX</ThemedText>
				<Picker
					style={styles.picker}
					selectedValue={options?.roundEndSfx ?? ''}
					onValueChange={(value) => setField('roundEndSfx', value === '' ? undefined : value)}
				>
					<Picker.Item label="None" value="" />
					{sfxNames.map((name) => (
						<Picker.Item key={name} label={name} value={name} />
					))}
				</Picker>
			</ThemedView>

			<ThemedView style={styles.fieldContainer}>
				<ThemedText style={styles.label}>Round End Warning SFX</ThemedText>
				<Picker
					style={styles.picker}
					selectedValue={options?.roundEndWarningSfx ?? ''}
					onValueChange={(value) => setField('roundEndWarningSfx', value === '' ? undefined : value)}
				>
					<Picker.Item label="None" value="" />
					{sfxNames.map((name) => (
						<Picker.Item key={name} label={name} value={name} />
					))}
				</Picker>
			</ThemedView>

			<ThemedView style={styles.row}>
				<ThemedView style={styles.fieldSplit}>
					<ThemedText style={styles.label}>Round End Warning (ms)</ThemedText>
					<TextInput
						style={styles.input}
						value={String(options?.roundEndWarningMs ?? '')}
						keyboardType="numeric"
						placeholder="ms"
						onChangeText={(txt) => {
							const v = parseInt(txt, 10);
							setField('roundEndWarningMs', Number.isNaN(v) ? undefined : v);
						}}
					/>
				</ThemedView>

				<ThemedView style={[styles.fieldSplit, styles.fieldSplitLast]}>
					<ThemedText style={styles.label}>Rest End Warning (ms)</ThemedText>
					<TextInput
						style={styles.input}
						value={String(options?.restEndWarningMs ?? '')}
						keyboardType="numeric"
						placeholder="ms"
						onChangeText={(txt) => {
							const v = parseInt(txt, 10);
							setField('restEndWarningMs', Number.isNaN(v) ? undefined : v);
						}}
					/>
				</ThemedView>
			</ThemedView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	fieldContainer: {
		marginBottom: 12,
	},
	label: {
		fontSize: 14,
		marginBottom: 6,
	},
	picker: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 6,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 6,
		padding: 10,
		fontSize: 16,
	},
	row: {
		flexDirection: 'row',
	},
	fieldSplit: {
		flex: 1,
		marginRight: 12,
	},
	fieldSplitLast: {
		marginRight: 0,
	},
});
