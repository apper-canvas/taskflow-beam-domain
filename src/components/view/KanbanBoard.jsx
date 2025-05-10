import { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from '../Column';

function KanbanBoard({ columns = [], tasks = [], setTasks, onDragEnd, onTaskClick }) {
  // Handle drag and drop if no external handler is provided
  const handleDragEnd = (result) => {
    if (!onDragEnd) {
      const { destination, source, draggableId, type } = result;
      
      // Check if we dropped it somewhere valid
      if (!destination) return;
      
      // Check if we dropped it in the same place
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) return;
      
      // Handle column reordering
      if (type === 'column') {
        // Code to reorder columns could be added here
        return;
      }
      
      // Handle task reordering
      const movedTask = tasks.find(task => task.id === draggableId);
      if (!movedTask) return;
      
      // Update the task's columnId if it changed columns
      const updatedTask = {
        ...movedTask,
        columnId: destination.droppableId
      };
      
      // Create a new array without the moved task
      const remainingTasks = tasks.filter(task => task.id !== draggableId);
      
      // Create a new array with the updated task
      const updatedTasks = [...remainingTasks, updatedTask];
      
      setTasks(updatedTasks);
    } else {
      onDragEnd(result);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd || handleDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div 
            className="flex gap-4 overflow-x-auto py-2 scrollbar-thin pb-4" 
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {columns.map((column, index) => {
              const columnTasks = tasks.filter(task => task.columnId === column.id);
              return (
                <Column 
                  key={column.id} 
                  column={column} 
                  tasks={columnTasks} 
                  index={index} 
                  setTasks={setTasks}
                  allTasks={tasks}
                  onTaskClick={onTaskClick}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default KanbanBoard;