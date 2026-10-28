import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import texts from '../../locales/es.js'
import Section from './Section.jsx'
import { GripIcon } from '../Icons.jsx'

function SortableSection({ id, children }) {
  const {
    attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging,
  } = useSortable({ id })

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      className="drag-handle"
      title={texts.reorder.handle}
      aria-label={`${texts.reorder.handle}: ${texts[id].title}`}
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
      <Section title={texts[id].title} handle={handle}>{children}</Section>
    </div>
  )
}

const titleOf = (id) => texts[id]?.title ?? ''

const accessibility = {
  screenReaderInstructions: { draggable: texts.reorder.instructions },
  announcements: {
    onDragStart: ({ active }) => texts.reorder.picked(titleOf(active.id)),
    onDragOver: ({ over }) => (over ? texts.reorder.over(titleOf(over.id)) : ''),
    onDragEnd: ({ active }) => texts.reorder.dropped(titleOf(active.id)),
    onDragCancel: ({ active }) => texts.reorder.cancelled(titleOf(active.id)),
  },
}

// Form sections the user can reorder by dragging their handle (mouse, finger or keyboard).
// renderContent(key) returns what goes inside each section.
function SortableSections({ order, onReorder, renderContent }) {
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
      accessibility={accessibility}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        {order.map((key) => (
          <SortableSection key={key} id={key}>{renderContent(key)}</SortableSection>
        ))}
      </SortableContext>
    </DndContext>
  )
}

export default SortableSections
