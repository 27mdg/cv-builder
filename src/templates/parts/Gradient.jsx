import { Svg, Defs, LinearGradient, Stop, Rect } from '@react-pdf/renderer'

// A rectangle that fades from one colour to another, left to right
export function Gradient({ width, height, from, to, id = 'gradient' }) {
  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={from}/>
          <Stop offset="1" stopColor={to}/>
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={width} height={height} fill={`url(#${id})`}/>
    </Svg>
  )
}
