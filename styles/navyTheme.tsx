/**
 * BTC — Navy theme · styles only (no components).
 * ------------------------------------------------------------------
 * Adds the Landing (Tone Study) navy styles on top of BTCIntervalTimer's
 * Color/Font/BTCStyles, so every BTC-themed screen's styles import from
 * one module.
 *
 * Conventions match the codebase:
 *   • google-fonts, one family per weight (Font.*) — no `fontWeight`.
 *   • "concrete" buttons = face style here + a 4px ledge View behind it
 *     (use components/ui/ConcreteButton's <Concrete ledge={Color.orangeLedge}>).
 *   • CSS mask-image fades → <LinearGradient> overlays (presetFadeTop/Bot).
 */

import { StyleSheet } from 'react-native';
import { BTCStyles, Color, Font } from './BTCIntervalTimer';

export { BTCStyles, Color, Font };

/* ============================================================= *
 * LANDING (Tone Study · Navy)
 * ============================================================= */

export const landingStyles = StyleSheet.create({
  // shell
  bezel: {
    width: 320,
    backgroundColor: '#0c1530',
    borderColor: '#21305a',
    borderWidth: 1,
    borderRadius: 30,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.45,
    shadowRadius: 40,
    elevation: 12,
  },
  screen: { backgroundColor: Color.navy, borderRadius: 20, overflow: 'hidden', minHeight: 620 },

  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingTop: 14 },
  statusText: { fontFamily: Font.mono, fontSize: 10, color: '#6f7da8' },

  // logo — faded oval mask is applied on the <Image> itself
  logoWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 8, paddingBottom: 2, paddingHorizontal: 18 },
  logo: { width: 210, height: undefined, aspectRatio: 2.4, resizeMode: 'contain' },

  // recommended row
  recoBlock: { paddingHorizontal: 18, paddingTop: 20 },
  recoKicker: { fontFamily: Font.oswaldSemi, fontSize: 12, letterSpacing: 2, color: Color.orange, marginBottom: 9 },
  recoCard: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#1a2c54', borderLeftWidth: 4, borderLeftColor: Color.orange, borderRadius: 4, paddingVertical: 13, paddingHorizontal: 14 },
  recoTitle: { fontFamily: Font.oswaldSemi, fontSize: 20, letterSpacing: 0.5, color: Color.white },
  recoMeta: { fontFamily: Font.mono, fontSize: 10, color: '#7e8cb6' },

  // CTAs
  ctaGroup: { paddingHorizontal: 18, paddingTop: 20, gap: 11 },
  // primary "strike" — wrap in <Concrete ledge={Color.orangeLedge}>
  ctaPrimary: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 11, backgroundColor: Color.orange, borderRadius: 6 },
  ctaPrimaryText: { fontFamily: Font.oswaldBold, fontSize: 23, letterSpacing: 1.5, color: Color.navy },
  ctaSecondary: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 11, backgroundColor: '#15294f', borderWidth: 1.5, borderColor: '#3a4f80', borderRadius: 6 },
  ctaSecondaryText: { fontFamily: Font.oswaldSemi, fontSize: 20, letterSpacing: 1.5, color: Color.white },

  // preset wheel
  presetBlock: { paddingHorizontal: 18, paddingTop: 22 },
  presetLabel: { fontFamily: Font.oswaldSemi, fontSize: 12, letterSpacing: 2, color: '#7e8cb6', marginBottom: 8 },
  presetWheel: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#21376a', paddingVertical: 8, alignItems: 'center', gap: 3, overflow: 'hidden' },
  presetFar: { fontFamily: Font.oswaldMed, fontSize: 16, letterSpacing: 1, color: '#5469a0' },
  presetNear: { fontFamily: Font.oswaldMed, fontSize: 18, letterSpacing: 1, color: '#8593bd' },
  presetSelected: { width: '100%', alignItems: 'center', paddingVertical: 5, borderTopWidth: 2, borderBottomWidth: 2, borderColor: Color.orange },
  presetSelectedText: { fontFamily: Font.oswaldBold, fontSize: 24, letterSpacing: 1, color: Color.white },
  presetFadeTop: { position: 'absolute', left: 0, right: 0, top: 0, height: 28 },
  presetFadeBot: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 28 },

  // footer
  footer: { marginTop: 'auto', paddingHorizontal: 18, paddingTop: 20, paddingBottom: 16 },
  footerUrl: { fontFamily: Font.oswaldMed, fontSize: 13, letterSpacing: 1.5, color: '#6f7da8', textAlign: 'center', textTransform: 'uppercase', marginBottom: 12 },
  bannerAd: { height: 52, borderWidth: 1, borderColor: '#3a4f80', borderStyle: 'dashed', borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  bannerAdText: { fontFamily: Font.mono, fontSize: 10, color: '#5469a0' },
});
