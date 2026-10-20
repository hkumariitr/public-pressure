import { Text, View } from 'react-native';
import { color, font } from '../brand/tokens';

/**
 * पP mark for mobile. Devanagari प (neutral) + Latin P (red) set tight to share
 * a stem. Uses live glyphs so it needs no bundled image.
 */
export function Logo({ size = 28, surface = 'ink' }: { size?: number; surface?: 'ink' | 'white' | 'red' }) {
  const neutral = surface === 'white' ? color.ink : color.white;
  const p = surface === 'red' ? color.ink : color.red;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <Text style={{ fontFamily: font.deva, fontSize: size, color: neutral, lineHeight: size * 1.05 }}>
        प
      </Text>
      <Text
        style={{
          fontFamily: font.latin, fontWeight: '800', fontSize: size, color: p,
          marginLeft: -size * 0.18, lineHeight: size * 1.05,
        }}
      >
        P
      </Text>
    </View>
  );
}

export function Lockup() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Logo size={26} surface="ink" />
      <View>
        <Text
          style={{
            fontFamily: font.latin, fontWeight: '800', color: color.white,
            fontSize: 13, letterSpacing: 0.5, lineHeight: 14,
          }}
        >
          PUBLIC PRESSURE
        </Text>
        <Text style={{ fontFamily: font.deva, fontWeight: '700', color: color.red, fontSize: 10 }}>
          पब्लिक प्रेशर
        </Text>
      </View>
    </View>
  );
}
