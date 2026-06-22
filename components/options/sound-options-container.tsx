// Sound options editor component
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { sfxNames } from '@/constants/asset-constants';
import { SoundOptions } from '@/data/data-types';
import { StyleSheet, TextInput } from 'react-native';
import { Collapsible } from '../ui/collapsible';
import { WheelPicker } from '../ui/wheel-picker';

const NONE_OPTION = 'None';
const SFX_OPTIONS = [NONE_OPTION, ...sfxNames];

interface SoundOptionsProps {
	options: SoundOptions;
	onChange: (next: SoundOptions) => void;
}

export default function SoundOptionsContainer({ options, onChange }: SoundOptionsProps) {
    return (
        <Collapsible
            title='Sound Options'
            children={useSoundOptions({options, onChange})}>
        </Collapsible>
	);
}

function useSoundOptions({ options, onChange }: SoundOptionsProps) {
    const setField = <K extends keyof SoundOptions>(key: K, value: SoundOptions[K]) => {
        onChange({ ...options, [key]: value });
    };

    const setSfxField = (key: 'roundStartSfx' | 'roundEndSfx' | 'roundEndWarningSfx', value: string) => {
        setField(key, value === NONE_OPTION ? undefined : value);
    };

    return (
        <ThemedView style={styles.container}>
			<ThemedView style={styles.fieldContainer}>
				<ThemedText style={styles.label}>Round Start SFX</ThemedText>
				<WheelPicker
					options={SFX_OPTIONS}
					value={options?.roundStartSfx ?? NONE_OPTION}
					onChange={(value) => setSfxField('roundStartSfx', value)}
				/>
			</ThemedView>

			<ThemedView style={styles.fieldContainer}>
				<ThemedText style={styles.label}>Round End SFX</ThemedText>
				<WheelPicker
					options={SFX_OPTIONS}
					value={options?.roundEndSfx ?? NONE_OPTION}
					onChange={(value) => setSfxField('roundEndSfx', value)}
				/>
			</ThemedView>

			<ThemedView style={styles.fieldContainer}>
				<ThemedText style={styles.label}>Round End Warning SFX</ThemedText>
				<WheelPicker
					options={SFX_OPTIONS}
					value={options?.roundEndWarningSfx ?? NONE_OPTION}
					onChange={(value) => setSfxField('roundEndWarningSfx', value)}
				/>
			</ThemedView>

			<ThemedView style={styles.row}>
				<ThemedView style={styles.fieldSplit}>
					<ThemedText style={styles.label}>Round End Warning</ThemedText>
					<TextInput
						style={styles.input}
						value={String((options?.roundEndWarningMs ?? 0) / 1000)}
						keyboardType="numeric"
						onChangeText={(txt) => {
							const v = parseInt(txt, 10);
							setField('roundEndWarningMs', Number.isNaN(v) ? undefined : v * 1000);
						}}
					/>
				</ThemedView>

				<ThemedView style={[styles.fieldSplit, styles.fieldSplitLast]}>
					<ThemedText style={styles.label}>Rest End Warning</ThemedText>
					<TextInput
						style={styles.input}
						value={String((options?.restEndWarningMs ?? 0) / 1000)}
						keyboardType="numeric"
						onChangeText={(txt) => {
							const v = parseInt(txt, 10);
							setField('restEndWarningMs', Number.isNaN(v) ? undefined : v * 1000);
						}}
					/>
				</ThemedView>
			</ThemedView>
		</ThemedView>
    )
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
