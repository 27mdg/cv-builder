import { View } from '@react-pdf/renderer'

// Skill levels are stored as 1–5, so every template can draw them its own way.

export function Dots({ level, color, size = 6, emptyColor = 'transparent' }) {
  return (
    <View style={{ flexDirection: 'row', marginTop: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <View
          key={n}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginRight: size / 2,
            borderWidth: 0.6,
            borderColor: color,
            backgroundColor: n <= level ? color : emptyColor,
          }}
        />
      ))}
    </View>
  )
}

export function Bar({ level, color, trackColor, width = 90, height = 5 }) {
  return (
    <View style={{ width, height, backgroundColor: trackColor }}>
      <View style={{ width: (width * level) / 5, height, backgroundColor: color }}/>
    </View>
  )
}
