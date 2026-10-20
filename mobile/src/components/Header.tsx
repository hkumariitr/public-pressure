import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Lockup } from './Logo';
import { color, font, type as T } from '../brand/tokens';
import type { Lang } from '../api/client';

export function Header({
  lang, onLang, liveConnected,
}: {
  lang: Lang;
  onLang: (l: Lang) => void;
  liveConnected: boolean;
}) {
  return (
    <View style={s.header}>
      <Lockup />
      <View style={{ flex: 1 }} />
      <View style={s.live}>
        {liveConnected && <View style={s.dot} />}
        <Text style={s.liveTxt}>LIVE</Text>
      </View>
      <View style={s.toggle}>
        <TouchableOpacity onPress={() => onLang('en')} style={[s.tbtn, lang === 'en' && s.tbtnOn]}>
          <Text style={[s.tbtnTxt, lang === 'en' && s.tbtnTxtOn]}>EN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onLang('hi')} style={[s.tbtn, lang === 'hi' && s.tbtnOn]}>
          <Text style={[s.tbtnTxt, lang === 'hi' && s.tbtnTxtOn, { fontFamily: font.deva }]}>हिं</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: color.ink, paddingHorizontal: 14, paddingVertical: 10,
  },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.red },
  liveTxt: { fontFamily: font.mono, color: color.white, fontSize: T.meta, letterSpacing: 1 },
  toggle: { flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 999, overflow: 'hidden' },
  tbtn: { paddingHorizontal: 10, paddingVertical: 4 },
  tbtnOn: { backgroundColor: color.white },
  tbtnTxt: { fontFamily: font.mono, color: color.white, fontSize: T.meta },
  tbtnTxtOn: { color: color.ink },
});
