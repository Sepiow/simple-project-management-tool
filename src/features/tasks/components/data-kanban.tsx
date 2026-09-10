"use client"

import React, { useCallback, useEffect, useState } from "react"
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult
} from "@hello-pangea/dnd"
import { Task, TaskStatus } from "../types"
import { KanbanColumnHeader } from "./kanban-column-header"
import { KanbanCard } from "./kanban-card"

const boards: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE
]

type TasksState = {
  [key in TaskStatus]: Task[]
}

interface DataKanbanProps {
  data: Task[]
  onChange: (
    tasks: { id: number | string; status: TaskStatus; position: number }[]
  ) => void
}

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: []
    }

    data.forEach((task) => {
      if (initialTasks[task.status]) {
        initialTasks[task.status].push(task)
      }
    })

    return initialTasks
  })

  useEffect(() => {
    const newTasks: TasksState = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: []
    }

    data.forEach((task) => {
      if (newTasks[task.status]) {
        newTasks[task.status].push(task)
      }
    })

    setTasks(newTasks)
  }, [data])

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return

      const { source, destination } = result
      const sourceStatus = source.droppableId as TaskStatus
      const destStatus = destination.droppableId as TaskStatus

      let updatesPayload: {
        id: number | string
        status: TaskStatus
        position: number
      }[] = []

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks }

        // Safely extract source column
        const sourceColumn = [...newTasks[sourceStatus]]
        const [movedTask] = sourceColumn.splice(source.index, 1)

        if (!movedTask) return prevTasks

        const updatedMovedTask =
          sourceStatus !== destStatus
            ? { ...movedTask, status: destStatus }
            : movedTask

        newTasks[sourceStatus] = sourceColumn

        const destColumn =
          sourceStatus === destStatus
            ? sourceColumn
            : [...newTasks[destStatus]]

        destColumn.splice(destination.index, 0, updatedMovedTask)
        newTasks[destStatus] = destColumn

        updatesPayload = [
          {
            id: updatedMovedTask.id,
            status: destStatus,
            position: Math.min((destination.index + 1) * 1000, 1_000_000)
          }
        ]

        return newTasks
      })

      if (updatesPayload.length > 0) {
        onChange(updatesPayload)
      }
    },
    [onChange]
  )

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto gap-x-4 pb-4">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 bg-neutral-100 p-2.5 rounded-lg min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={String(task.id)}
                        draggableId={String(task.id)}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}