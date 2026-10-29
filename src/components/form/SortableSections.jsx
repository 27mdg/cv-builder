import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import texts from '../../locales/es.js'
import Section from './Section.jsx'
import Animated from '../Animated.jsx'
import { GripIcon } from '../Icons.jsx'

function SortableSection({ id, label, open, onRemove, extraProps, leaving, onLeft, children }) {
  const {
    attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging,
  } = useSortable({ id })

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      className="drag-handle"
      title={texts.reorder.handle}
      aria-label={`${texts.reorder.handle}: ${label}`}
      // The handle lives inside <summary>: without this, a click would also fold the section
      onClick={(e) => e.preventDefault()}
      {...attributes}
      {...listeners}
    >
      <GripIcon/>
    </button>
  )

  return (
    <div
      ref={setNodeRef}
      className={isDragging ? 'sortable dragging' : 'sortable'}
      // Translate, not Transform: sections have different heights and would be stretched
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      {/* Sections added in this visit (`open`) grow in */}
      <Animated appear={open} leaving={leaving} onLeft={onLeft}>
        <Section title={label} open={open} handle={handle} onRemove={onRemove} {...extraProps}>
          {children}
        </Section>
      </Animated>
    </div>
  )
}

// What screen readers hear while a section is moved; titleOf(key) gives each section's title
function accessibility(titleOf) {
  return {
    screenReaderInstructions: { draggable: texts.reorder.instructions },
    announcements: {
      onDragStart: ({ active }) => texts.reorder.picked(titleOf(active.id)),
      onDragOver: ({ over }) => (over ? texts.reorder.over(titleOf(over.id)) : ''),
      onDragEnd: ({ active }) => texts.reorder.dropped(titleOf(active.id)),
      onDragCancel: ({ active }) => texts.reorder.cancelled(titleOf(active.id)),
    },
  }
}

// Form sections the user can reorder by dragging their handle (mouse, finger or keyboard).
// renderContent(key) returns what goes inside each section; `removable` sections get a ×
// that calls onRemove(key), and `openKeys` start unfolded. sectionProps(key) returns more props
// for each Section (icon, summary, done). isLeaving(key) and onLeft(key): see useLeaving.js.
// titleOf(key): the section's title as the user sees it (custom sections have no fixed one).
function SortableSections({
  order, onReorder, renderContent, sectionProps, titleOf, removable = [], onRemove, openKeys = [], isLeaving, onLeft,
}) {
  const sensors = useSensors(
    // A small distance or delay before dragging starts, so a plain click or a scroll still work
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    onReorder(arrayMove(order, order.indexOf(active.id), order.indexOf(over.id)))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={accessibility(titleOf)}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        {order.map((key) => (
          <SortableSection
            key={key}
            id={key}
            label={titleOf(key)}
            open={openKeys.includes(key) || undefined}
            onRemove={removable.includes(key) ? () => onRemove(key) : undefined}
            extraProps={sectionProps?.(key)}
            leaving={isLeaving?.(key)}
            onLeft={() => onLeft?.(key)}
          >
            {renderContent(key)}
          </SortableSection>
        ))}
      </SortableContext>
    </DndContext>
  )
}

export default SortableSections
