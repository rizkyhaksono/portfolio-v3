"use client"

import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils"
import type { TrackerTask } from "@/services/visitor/tracker"

/** Drag and drop for signed-in visitors only; loaded with next/dynamic so readers never download it. */
export default function DndBoard({ onDragEnd, children }: Readonly<{ onDragEnd: (result: DropResult) => void; children: React.ReactNode }>) {
  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
}

interface DndListProps {
  id: string
  items: TrackerTask[]
  className: string
  canDrag: (task: TrackerTask) => boolean
  renderCard: (task: TrackerTask, lifted: boolean) => React.ReactNode
}

export function DndList({ id, items, className, canDrag, renderCard }: Readonly<DndListProps>) {
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <ol ref={provided.innerRef} {...provided.droppableProps} role="list" className={cn(className, snapshot.isDraggingOver && "bg-tint")}>
          {items.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={!canDrag(task)}>
              {(drag, state) => (
                <li ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps} className={canDrag(task) ? "cursor-grab active:cursor-grabbing" : undefined}>
                  {renderCard(task, state.isDragging)}
                </li>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </ol>
      )}
    </Droppable>
  )
}
