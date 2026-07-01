/**
 * BTC Interval Timer — Navy theme tokens + stylesheet.
 * ------------------------------------------------------------------
 * Style data only (no components — those live under components/).
 * Ported from the "Navy" design direction (Burlington Training Centre);
 * screens adopt pieces of this incrementally (see app/index.tsx for the
 * current usage of BTCStyles.stop* + Color.orangeLedge).
 *
 * Fonts (Font.*) name the intended google-fonts family per weight
 * (Oswald / Barlow Semi Condensed / Space Mono) — load them with
 * expo-font's useFonts before relying on the fontFamily values below.
 */

import { StyleSheet } from 'react-native';

export const Color = {
  navy: '#122142',
  orange: '#F05A28',
  orangeLedge: '#a63c18',
  navyLedge: '#0a1430',
  white: '#FFFFFF',
};

/** google-fonts family names (one per weight). */
export const Font = {
  oswaldMed: 'Oswald_500Medium',
  oswaldSemi: 'Oswald_600SemiBold',
  oswaldBold: 'Oswald_700Bold',
  barlowSemi: 'BarlowSemiCondensed_600SemiBold',
  barlowBold: 'BarlowSemiCondensed_700Bold',
  mono: 'SpaceMono_400Regular',
};

/** Per-stage palette for the active timer. The screen background SHIFTS by stage
 *  (orange stays a strike accent — never a full wash). */
export const Stage = {
  work: {
    bezel: '#0c1530',
    screen: '#122142',
    status: '#6f7da8',
    roundLabel: '#8593bd',
    roundNum: Color.orange,
    roundSlash: '#5469a0',
    heroLabel: '#7e8cb6',
    heroLabelStrong: '#7e8cb6',
    hero: '#FFFFFF',
    stopBg: '#16213f',
    stopBorder: '#34406a',
    stopLedge: '#0a1430',
    stopText: '#cdd6ec',
    // phase strip — "work" reads white-hot
    stripBg: '#FFFFFF',
    stripDot: '#0c1530',
    stripText: '#0c1530',
    stripTagText: '#9aa3c4',
  },
  recover: {
    bezel: '#070e1e',
    screen: '#0c1628',
    status: '#56638a',
    roundLabel: '#6b79a4',
    roundNum: Color.orange,
    roundSlash: '#44537e',
    heroLabel: '#6b79a4',
    heroLabelStrong: '#6b79a4',
    hero: '#d6deef',
    stopBg: '#101a32',
    stopBorder: '#2a365c',
    stopLedge: '#060c1c',
    stopText: '#b9c2da',
    // phase strip — "recover" reads in the strike accent
    stripBg: Color.orange,
    stripDot: '#FFFFFF',
    stripText: '#FFFFFF',
    stripTagText: 'rgba(255,255,255,0.7)',
  },
  roundRest: {
    bezel: '#05080f',
    screen: '#080d18',
    status: '#454f6e',
    roundLabel: '#5d6a93',
    roundNum: '#8593bd',
    roundSlash: '#3c466a',
    heroLabel: Color.orange, // "ROUND REST" reads in the strike accent
    heroLabelStrong: Color.orange,
    hero: '#FFFFFF',
    stopBg: '#0c1426',
    stopBorder: '#222d4d',
    stopLedge: '#04070f',
    stopText: '#aab3cf',
    // phase strip — deepest dim of the three stages
    stripBg: '#05080f',
    stripDot: Color.orange,
    stripText: '#aab3cf',
    stripTagText: '#5d6a93',
  },
} as const;

/** Fixed ON/OFF segment coloring for the active interval block — the ON
 *  segment is always white-family, the OFF segment always orange-family,
 *  independent of which overall Stage is showing (only active vs. idle
 *  within the block changes). */
export const SegmentTone = {
  onActiveBg: '#FFFFFF',
  onActiveText: '#0c1530',
  onIdleBg: '#16213f',
  onIdleText: '#5d6a93',
  idleTag: '#5469a0',
  offActiveBg: Color.orange,
  offActiveText: '#FFFFFF',
  offIdleBg: '#a63c18',
  offIdleText: '#e7c4ab',
  // Queued intervals further out than the idle segment of the current
  // block — same navy family as the idle tone, just dimmed down so they
  // recede behind whatever's actually up next.
  pendingBg: '#101a30',
  pendingText: '#3d4566',
} as const;

export type Phase = keyof typeof Stage;

/** Setup-screen palette — backs the BTCStyles entries below. */
export const SETUP = {
  bezel: '#0c1530',
  screen: '#122142',
  field: '#0e1a38',
  fieldBorder: '#2a3f74',
  chip: '#1a2c54',
  chipBorder: '#2a3f74',
  label: '#7e8cb6',
  labelDim: '#6f7da8',
  arrow: '#5469a0',
};

export const BTCStyles = StyleSheet.create({
  bezel: { width: 340, borderRadius: 32, padding: 14, borderWidth: 1, borderColor: '#21305a' },
  screen: { borderRadius: 22, overflow: 'hidden', minHeight: 700 },

  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 17, paddingTop: 13 },
  statusText: { fontFamily: Font.mono, fontSize: 10 },

  // round counter
  roundRow: { flexDirection: 'row', alignItems: 'baseline', gap: 9 },
  roundLabel: { fontFamily: Font.oswaldSemi, fontSize: 29, letterSpacing: 2 },
  roundNum: { fontFamily: Font.oswaldBold, fontSize: 57, letterSpacing: 1 },
  roundSlash: { fontFamily: Font.oswaldSemi, fontSize: 39, letterSpacing: 1 },

  // hero — the single most distance-readable element on the active screen
  heroLabel: { fontFamily: Font.barlowBold, fontSize: 21, letterSpacing: 3, marginBottom: -22 },
  hero: { fontFamily: Font.oswaldBold, fontSize: 142, letterSpacing: 1, textAlign: 'center' },

  // phase strip
  phaseStrip: { flexDirection: 'row', alignItems: 'center', gap: 11, height: 46, paddingHorizontal: 16, borderRadius: 6 },
  phaseDot: { width: 12, height: 12, borderRadius: 6 },
  phaseLabel: { fontFamily: Font.oswaldBold, fontSize: 19, letterSpacing: 3 },
  phaseTag: { fontFamily: Font.barlowBold, fontSize: 12, letterSpacing: 2, marginLeft: 'auto' },

  // interval block
  block: { borderRadius: 9, overflow: 'hidden', borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.06)' },
  segRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  segLabel: { fontFamily: Font.barlowBold, fontSize: 13, letterSpacing: 2 },
  segTag: { fontFamily: Font.barlowBold, fontSize: 12, letterSpacing: 2 },
  segTime: { fontFamily: Font.oswaldBold },
  progressTrack: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, backgroundColor: 'rgba(0,0,0,0.12)' },

  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 70 },

  // up next
  upNextCard: { borderRadius: 9, borderWidth: 1.5, borderColor: '#1d2944', backgroundColor: '#0c1426', padding: 18, paddingHorizontal: 20 },
  upNextKicker: { fontFamily: Font.mono, fontSize: 12, letterSpacing: 1, color: '#5d6a93', marginBottom: 6 },
  upNextRound: { fontFamily: Font.oswaldBold, fontSize: 36, letterSpacing: 1, color: Color.white },
  upNextSlash: { fontFamily: Font.oswaldSemi, fontSize: 21, color: '#5469a0' },

  // stop
  stop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, height: 70, borderRadius: 8, borderWidth: 1.5 },
  stopGlyph: { fontSize: 16 },
  stopText: { fontFamily: Font.oswaldBold, fontSize: 26, letterSpacing: 3 },

  // ---- setup ----
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 16 },
  toolBack: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: SETUP.chip, borderWidth: 1, borderColor: SETUP.chipBorder, borderRadius: 7 },
  toolBackGlyph: { fontFamily: Font.oswaldSemi, fontSize: 24, color: Color.white },
  toolChip: { height: 42, minWidth: 64, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: SETUP.chip, borderWidth: 1, borderColor: SETUP.chipBorder, borderRadius: 7 },
  toolChipText: { fontFamily: Font.oswaldSemi, fontSize: 14, letterSpacing: 1.5, color: Color.white },

  kicker: { fontFamily: Font.barlowSemi, fontSize: 11, letterSpacing: 2, color: SETUP.labelDim, marginBottom: 5 },
  workoutName: { fontFamily: Font.oswaldBold, fontSize: 26, letterSpacing: 0.5, color: Color.white },
  nameRule: { height: 3, width: 46, backgroundColor: Color.orange, marginTop: 9 },

  valueField: { backgroundColor: SETUP.field, borderWidth: 1, borderColor: SETUP.fieldBorder, borderRadius: 6, padding: 10, paddingHorizontal: 13 },
  fieldLabel: { fontFamily: Font.barlowBold, fontSize: 11, letterSpacing: 1.5, marginBottom: 4, color: SETUP.label },
  fieldValue: { fontFamily: Font.oswaldSemi, fontSize: 28, color: Color.white },
  fieldArrow: { fontSize: 8, lineHeight: 9, color: SETUP.arrow },

  soundRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#16264c', borderWidth: 1, borderColor: SETUP.chipBorder, borderRadius: 6, padding: 12, paddingHorizontal: 13 },
  soundText: { fontFamily: Font.oswaldSemi, fontSize: 14, letterSpacing: 1.5, color: Color.white },

  // collapsible "disclosure" options card — shared by SoundOptionsContainer
  // and NotificationContainer (label/chip row that opens a wheel picker).
  disclosureHeader: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 9 },
  disclosureBullet: { color: Color.orange, fontSize: 13 },
  disclosureTitle: { fontFamily: Font.oswaldSemi, fontSize: 13, letterSpacing: 1.5, color: Color.white },
  disclosureCard: { backgroundColor: '#0f1c3c', borderWidth: 1, borderColor: SETUP.chipBorder, borderRadius: 10, padding: 12, marginBottom: 4 },
  disclosureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#21376a' },
  disclosureRowLast: { borderBottomWidth: 0 },
  disclosureRowLabel: { fontFamily: Font.barlowSemi, fontSize: 13, color: SETUP.label },
  disclosureChip: { width: 140, alignItems: 'center', backgroundColor: SETUP.chip, borderWidth: 1, borderColor: SETUP.chipBorder, borderRadius: 5, paddingVertical: 6, paddingHorizontal: 12 },
  disclosureChipText: { fontFamily: Font.oswaldSemi, fontSize: 13, letterSpacing: 1, color: Color.white, textAlign: 'center' },

  intervalsBox: { backgroundColor: '#0f1c3c', borderWidth: 1, borderColor: SETUP.chipBorder, borderRadius: 10, padding: 12 },
  intervalsHead: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 11 },
  intervalsTitle: { fontFamily: Font.oswaldBold, fontSize: 16, letterSpacing: 2, color: Color.white },
  hr: { flex: 1, height: 1, backgroundColor: '#21376a' },
  intervalsCount: { fontFamily: Font.mono, fontSize: 10, color: '#5469a0' },

  intervalCard: { backgroundColor: SETUP.chip, borderWidth: 1, borderColor: SETUP.chipBorder, borderRadius: 8, padding: 12, marginBottom: 9 },
  intervalCardHead: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 11 },
  intervalBadge: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: Color.orange, borderRadius: 4 },
  intervalBadgeText: { fontFamily: Font.oswaldBold, fontSize: 14, color: Color.navy },
  intervalCardTitle: { fontFamily: Font.oswaldSemi, fontSize: 15, letterSpacing: 1.5, color: Color.white },
  intervalClose: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0e1a38', borderWidth: 1, borderColor: '#3a4f80', borderRadius: 5, marginLeft: 'auto' },
  intervalCloseGlyph: { color: '#8593bd', fontSize: 13 },
  miniField: { flex: 1, backgroundColor: '#0e1a38', borderWidth: 1, borderColor: SETUP.chipBorder, borderRadius: 5, padding: 7, paddingHorizontal: 10 },
  miniLabel: { fontFamily: Font.barlowBold, fontSize: 10, letterSpacing: 1, color: '#7e8cb6', marginBottom: 2 },
  miniValue: { fontFamily: Font.oswaldSemi, fontSize: 20, color: Color.white },

  addInterval: { height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#3a4f80', borderRadius: 7, borderStyle: 'dashed', marginBottom: 11 },
  addIntervalText: { fontFamily: Font.oswaldSemi, fontSize: 15, letterSpacing: 1.5, color: '#aeb9d6' },

  totalBox: { backgroundColor: '#0e1a38', borderWidth: 1, borderColor: SETUP.chipBorder, borderRadius: 8, padding: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontFamily: Font.barlowBold, fontSize: 12, letterSpacing: 2, color: '#7e8cb6' },
  totalValue: { fontFamily: Font.oswaldBold, fontSize: 42, letterSpacing: 1, color: Color.white },

  start: { height: 62, alignItems: 'center', justifyContent: 'center', backgroundColor: Color.orange, borderRadius: 6 },
  startText: { fontFamily: Font.oswaldBold, fontSize: 25, letterSpacing: 2, color: Color.navy },

  // wheel picker modal
  scrim: { flex: 1, backgroundColor: 'rgba(6,10,22,0.66)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  pickerCard: { width: '100%', backgroundColor: '#0c1530', borderWidth: 1, borderColor: '#21305a', borderRadius: 12, padding: 16 },
  wheel: { backgroundColor: SETUP.field, borderWidth: 1.5, borderColor: Color.orange, borderRadius: 7, paddingVertical: 14, paddingHorizontal: 12, overflow: 'hidden' },
  wheelSelected: { width: '100%', alignItems: 'center', paddingVertical: 6, borderTopWidth: 2, borderBottomWidth: 2, borderColor: Color.orange, marginVertical: 2 },
  wheelFadeTop: { position: 'absolute', left: 0, right: 0, top: 0, height: 36 },
  wheelFadeBot: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 36 },
});
