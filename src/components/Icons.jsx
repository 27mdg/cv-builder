// Hand-made so we do not depend on icon libraries or their licences.

function Icon({ children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

export function TemplatesIcon() {
  return <Icon><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></Icon>
}

export function FontIcon() {
  return <Icon><path d="M3 19l5-14 5 14M5 14h6"/><circle cx="18" cy="16" r="3"/><path d="M21 13v6"/></Icon>
}

export function SpacingIcon() {
  return <Icon><path d="M11 6h10M11 12h10M11 18h10M5 4v16M3 6l2-2 2 2M3 18l2 2 2-2"/></Icon>
}

export function CalendarIcon() {
  return <Icon><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></Icon>
}

export function ColorsIcon() {
  return <Icon><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></Icon>
}

export function FullScreenIcon() {
  return <Icon><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></Icon>
}

export function ExitFullScreenIcon() {
  return <Icon><path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/></Icon>
}

export function PlusIcon() {
  return <Icon><path d="M12 5v14M5 12h14"/></Icon>
}

export function ResizeIcon() {
  return <Icon><path d="m9 7-5 5 5 5M15 7l5 5-5 5"/></Icon>
}

export function GripIcon() {
  return (
    <Icon>
      {[6, 12, 18].map((y) => [9, 15].map((x) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" fill="currentColor" stroke="none"/>
      )))}
    </Icon>
  )
}

export function LockIcon() {
  return <Icon><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></Icon>
}

export function DownloadIcon() {
  return <Icon><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></Icon>
}

export function TrashIcon() {
  return <Icon><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></Icon>
}

export function CloseIcon() {
  return <Icon><path d="M6 6l12 12M18 6L6 18"/></Icon>
}

export function PersonIcon() {
  return <Icon><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></Icon>
}

export function CheckIcon() {
  return <Icon><path d="M5 12l5 5L19 7"/></Icon>
}

export function TextIcon() {
  return <Icon><path d="M4 6h16M4 12h16M4 18h10"/></Icon>
}

export function CapIcon() {
  return <Icon><path d="M2 9l10-5 10 5-10 5-10-5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/></Icon>
}

export function BriefcaseIcon() {
  return <Icon><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></Icon>
}

export function StarIcon() {
  return <Icon><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></Icon>
}

export function GlobeIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9"/>
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z"/>
    </Icon>
  )
}

export function HeartIcon() {
  return <Icon><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></Icon>
}

export function BookIcon() {
  return <Icon><path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2V5z"/><path d="M4 19a2 2 0 0 1 2-2h14"/></Icon>
}

export function BadgeIcon() {
  return <Icon><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M8 17c.6-2 2.1-3 4-3s3.4 1 4 3"/></Icon>
}

export function FlagIcon() {
  return <Icon><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></Icon>
}

export function MedalIcon() {
  return <Icon><circle cx="12" cy="9" r="5"/><path d="M9 13.5L8 21l4-2 4 2-1-7.5"/></Icon>
}

export function BulbIcon() {
  return <Icon><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></Icon>
}

export function TrophyIcon() {
  return <Icon><path d="M8 4h8v5a4 4 0 0 1-8 0V4zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M10 17h4"/></Icon>
}

export function FolderIcon() {
  return <Icon><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/></Icon>
}

export function HandIcon() {
  return (
    <Icon>
      <path d="M8 12V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v5"/>
      <path d="M17 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.7l-2.8-4.4a1.5 1.5 0 0 1 2.5-1.7L8 14"/>
    </Icon>
  )
}

export function SparkleIcon() {
  return <Icon><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16v4M17 18h4"/></Icon>
}

export function NewspaperIcon() {
  return <Icon><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h4M7 16h4M14 12h3v4h-3z"/></Icon>
}

export function PeopleIcon() {
  return <Icon><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.1.8 3.5 2.9 3.5 5.7"/></Icon>
}

export function EyeIcon() {
  return <Icon><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></Icon>
}

export function EyeOffIcon() {
  return (
    <Icon>
      <path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.4 3.3M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/>
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18"/>
    </Icon>
  )
}

export function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  )
}
