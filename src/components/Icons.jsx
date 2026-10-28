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

export function GripIcon() {
  return (
    <Icon>
      {[6, 12, 18].map((y) => [9, 15].map((x) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" fill="currentColor" stroke="none"/>
      )))}
    </Icon>
  )
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

export function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  )
}
