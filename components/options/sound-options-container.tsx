// Sound options editor component
import { WheelPicker } from '@/components/ui/wheel-picker';
import { sfxNames } from '@/constants/asset-constants';
import { SoundOptions } from '@/data/data-types';
import { Color, Font, SETUP } from '@/styles/BTCIntervalTimer';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const NONE_OPTION = 'None';
const SFX_OPTIONS = [NONE_OPTION, ...sfxNames];
const WARNING_SECONDS_OPTIONS = Array.from({ length: 31 }, (_, i) => i);

function formatSfxLabel(name: string) {
	return name.toUpperCase().replace(/[_-]/g, ' ');
}

interface SoundOptionsProps {
	options: SoundOptions;
	onChange: (next: SoundOptions) => void;
	title?: string;
}

export default function SoundOptionsContainer({ options, onChange, title = 'Sounds & Warnings' }: SoundOptionsProps) {
	const [isOpen, setIsOpen] = useState(false);

	const setField = <K extends keyof SoundOptions>(key: K, value: SoundOptions[K]) => {
		onChange({ ...options, [key]: value });
	};

	const setSfxField = (key: 'roundStartSfx' | 'roundEndSfx' | 'roundEndWarningSfx', value: string) => {
		setField(key, value === NONE_OPTION ? undefined : value);
	};

	const setWarningSeconds = (key: 'roundEndWarningMs' | 'restEndWarningMs', seconds: number) => {
		setField(key, seconds * 1000);
	};

	return (
		<View>
			<Pressable style={styles.disclosureHeader} onPress={() => setIsOpen((value) => !value)}>
				<Text style={styles.disclosureBullet}>{isOpen ? '▾' : '▸'}</Text>
				<Text style={styles.disclosureTitle}>{title.toUpperCase()}</Text>
			</Pressable>

			{isOpen && (
				<View style={styles.card}>
					<Row label="Start SFX">
						<WheelPicker
							options={SFX_OPTIONS}
							value={options?.roundStartSfx ?? NONE_OPTION}
							onChange={(value) => setSfxField('roundStartSfx', value)}
							formatOption={formatSfxLabel}
							renderTrigger={({ displayValue, open }) => <Chip displayValue={displayValue} onPress={open} />}
						/>
					</Row>

					<Row label="End SFX">
						<WheelPicker
							options={SFX_OPTIONS}
							value={options?.roundEndSfx ?? NONE_OPTION}
							onChange={(value) => setSfxField('roundEndSfx', value)}
							formatOption={formatSfxLabel}
							renderTrigger={({ displayValue, open }) => <Chip displayValue={displayValue} onPress={open} />}
						/>
					</Row>

					<Row label="End Warning SFX">
						<WheelPicker
							options={SFX_OPTIONS}
							value={options?.roundEndWarningSfx ?? NONE_OPTION}
							onChange={(value) => setSfxField('roundEndWarningSfx', value)}
							formatOption={formatSfxLabel}
							renderTrigger={({ displayValue, open }) => <Chip displayValue={displayValue} onPress={open} />}
						/>
					</Row>

					<Row label="Round End Notice">
						<WheelPicker
							options={WARNING_SECONDS_OPTIONS}
							value={Math.round((options?.roundEndWarningMs ?? 0) / 1000)}
							onChange={(seconds) => setWarningSeconds('roundEndWarningMs', seconds)}
							formatOption={(seconds) => `${seconds}S`}
							renderTrigger={({ displayValue, open }) => <Chip displayValue={displayValue} onPress={open} />}
						/>
					</Row>

					<Row label="Rest End Notice" last>
						<WheelPicker
							options={WARNING_SECONDS_OPTIONS}
							value={Math.round((options?.restEndWarningMs ?? 0) / 1000)}
							onChange={(seconds) => setWarningSeconds('restEndWarningMs', seconds)}
							formatOption={(seconds) => `${seconds}S`}
							renderTrigger={({ displayValue, open }) => <Chip displayValue={displayValue} onPress={open} />}
						/>
					</Row>
				</View>
			)}
		</View>
	);
}

function Row({ label, last, children }: { label: string; last?: boolean; children: React.ReactNode }) {
	return (
		<View style={[styles.row, last && styles.rowLast]}>
			<Text style={styles.rowLabel}>{label}</Text>
			{children}
		</View>
	);
}

function Chip({ displayValue, onPress }: { displayValue: string; onPress: () => void }) {
	return (
		<Pressable style={styles.chip} onPress={onPress}>
			<Text style={styles.chipText} numberOfLines={1}>{displayValue}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	disclosureHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 9,
		paddingVertical: 9,
	},
	disclosureBullet: {
		color: Color.orange,
		fontSize: 13,
	},
	disclosureTitle: {
		fontFamily: Font.oswaldSemi,
		fontSize: 13,
		letterSpacing: 1.5,
		color: Color.white,
	},
	card: {
		backgroundColor: '#0f1c3c',
		borderWidth: 1,
		borderColor: SETUP.chipBorder,
		borderRadius: 10,
		padding: 12,
		marginBottom: 4,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#21376a',
	},
	rowLast: {
		borderBottomWidth: 0,
	},
	rowLabel: {
		fontFamily: Font.barlowSemi,
		fontSize: 13,
		color: SETUP.label,
	},
	chip: {
		width: 140,
		alignItems: 'center',
		backgroundColor: SETUP.chip,
		borderWidth: 1,
		borderColor: SETUP.chipBorder,
		borderRadius: 5,
		paddingVertical: 6,
		paddingHorizontal: 12,
	},
	chipText: {
		fontFamily: Font.oswaldSemi,
		fontSize: 13,
		letterSpacing: 1,
		color: Color.white,
		textAlign: 'center',
	},
});
