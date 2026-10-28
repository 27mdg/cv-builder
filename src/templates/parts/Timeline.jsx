import { View } from '@react-pdf/renderer'

// A vertical line with a dot next to each item. The line is the container's left border,
// so it keeps going when the section continues on the next page.

const dotSize = 9

export function Timeline({ color, children }) {
  return (
    <View style={{ marginLeft: dotSize / 2, paddingLeft: 14, borderLeftWidth: 1, borderLeftColor: color }}>
      {children}
    </View>
  )
}

// wrap={false}: an item split across two pages is hard to read
export function TimelineItem({ color, style, children }) {
  return (
    <View style={style} wrap={false}>
      <View
        style={{
          position: 'absolute',
          top: 3,
          left: -14 - dotSize / 2 - 0.5,
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: color,
        }}
      />
      {children}
    </View>
  )
}
