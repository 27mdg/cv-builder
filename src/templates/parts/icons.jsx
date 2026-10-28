import { Svg, Path } from '@react-pdf/renderer'

// Hand-made vector icons: they stay sharp in the PDF and need no image licence.
const paths = {
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  email: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M3 7l9 6 9-6',
  website: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M3 12h18 M12 3c3 3.5 3 14.5 0 18 M12 3c-3 3.5-3 14.5 0 18',
  linkedin: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M8 10v7 M8 7v.01 M12 17v-7 M12 13a3 3 0 0 1 6 0v4',
  address: 'M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z M12 6.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z',
  person: 'M12 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7',
  briefcase: 'M4 8h16v11H4z M9 8V5h6v3 M4 13h16',
  education: 'M2 9l10-5 10 5-10 5z M6 11v5c3 2 9 2 12 0v-5',
  star: 'M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.4 6.4 20.3l1.1-6.2L3 9.7l6.2-.9z',
  chat: 'M4 5h16v11H9l-5 4z',
  info: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 11v5 M12 8v.01',
}

export function PdfIcon({ name, size = 10, color = '#222', strokeWidth = 2 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d={paths[name] ?? paths.info}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
