// Sound options editor component
import { WheelPicker } from '@/components/ui/wheel-picker';
import { sfxNames } from '@/constants/asset-constants';
import { SoundOptions } from '@/data/data-types';
import { BTCStyles } from '@/styles/BTCIntervalTimer';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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
			<Pressable style={BTCStyles.disclosureHeader} onPress={() => setIsOpen((value) => !value)}>
				<Text style={BTCStyles.disclosureBullet}>{isOpen ? '▾' : '▸'}</Text>
				<Text style={BTCStyles.disclosureTitle}>{title.toUpperCase()}</Text>
			</Pressable>

			{isOpen && (
				<View style={BTCStyles.disclosureCard}>
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
		<View style={[BTCStyles.disclosureRow, last && BTCStyles.disclosureRowLast]}>
			<Text style={BTCStyles.disclosureRowLabel}>{label}</Text>
			{children}
		</View>
	);
}

function Chip({ displayValue, onPress }: { displayValue: string; onPress: () => void }) {
	return (
		<Pressable style={BTCStyles.disclosureChip} onPress={onPress}>
			<Text style={BTCStyles.disclosureChipText} numberOfLines={1}>{displayValue}</Text>
		</Pressable>
	);
}
