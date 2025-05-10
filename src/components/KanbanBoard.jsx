import { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import Column from './Column';

function KanbanBoard({ 
  columns, 
  tasks, 
  onTasksUpdate, 
  onAddColumn,
  isAddingColumn,
  setIsAddingColumn,
  newColumnTitle,
  setNewColumnTitle
}) {
  // Icons
  const PlusIcon = getIcon('Plus');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');

  // Local state if not provided
  const [internalIsAddingColumn, setInternalIsAddingColumn] = useState(false);
  const [internalNewColumnTitle, setInternalNewColumnTitle] = useState('');

  // Use provided state or local state
  const isAddingColumnState = isAddingColumn !== undefined ? isAddingColumn : internalIsAddingColumn;
  const setIsAddingColumnState = setIsAddingColumn || setInternalIsAddingColumn;
  const newColumnTitleState = newColumnTitle !== undefined ? newColumnTitle : internalNewColumnTitle;
  const setNewColumnTitleState = setNewColumnTitle || setInternalNewColumnTitle;

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination or it's dropped in the same spot
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Find the task that was dragged
    const task = tasks.find(t => t.id === draggableId);
    
    if (!task) return;
    
    // Create a new tasks array to avoid mutating the original
    const updatedTasks = [...tasks];
    
    // Create an array of tasks in the source column
    const sourceColumnTasks = updatedTasks
      .filter(t => t.columnId === source.droppableId)
      .sort((a, b) => a.order - b.order);
    
    // Create an array of tasks in the destination column
    const destinationColumnTasks = source.droppableId === destination.droppableId
      ? sourceColumnTasks // If same column, use source tasks
      : updatedTasks
          .filter(t => t.columnId === destination.droppableId)
          .sort((a, b) => a.order - b.order);
    
    // Remove the task from the source column tasks
    sourceColumnTasks.splice(source.index, 1);
    
    // Update the column ID if the task is moving to a different column
    if (source.droppableId !== destination.droppableId) {
      task.columnId = destination.droppableId;
    }
    
    // Insert the task at the destination index
    destinationColumnTasks.splice(destination.index, 0, task);
    
    // Update order values for tasks in the source column
    sourceColumnTasks.forEach((t, index) => {
      t.order = index;
    });
    
    // If different column, update order values for tasks in the destination column
    if (source.droppableId !== destination.droppableId) {
      destinationColumnTasks.forEach((t, index) => {
        t.order = index;
      });
    }
    
    // Call the provided handler to update tasks in parent component
    onTasksUpdate(updatedTasks);
  };

  const handleAddColumnInternal = (e) => {
    e.preventDefault();
    
    if (newColumnTitleState.trim()) {
      onAddColumn(newColumnTitleState);
      setNewColumnTitleState('');
      setIsAddingColumnState(false);
    }
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin">
      <DragDropContext onDragEnd={handleDragEnd}>
        {columns.map(column => (
          <Column 
            key={column.id}
            column={column}
            tasks={tasks.filter(task => task.columnId === column.id)
              .sort((a, b) => a.order - b.order)}
            setTasks={onTasksUpdate}
          />
        ))}
      </DragDropContext>
      
      {isAddingColumnState ? (
        <form onSubmit={handleAddColumnInternal} className="flex-shrink-0 w-[280px] md:w-[320px] bg-white dark:bg-surface-800 rounded-lg shadow-card p-3">
          <input type="text" className="input mb-3" placeholder="Enter column title..." value={newColumnTitleState} onChange={(e) => setNewColumnTitleState(e.target.value)} autoFocus />
          <div className="flex space-x-2">
            <button type="submit" className="btn btn-primary"><CheckIcon size={16} className="mr-1" /> Add</button>
            <button type="button" className="btn btn-outline" onClick={() => setIsAddingColumnState(false)}><XIcon size={16} className="mr-1" /> Cancel</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setIsAddingColumnState(true)} className="flex-shrink-0 w-[280px] md:w-[320px] h-12 flex items-center justify-center bg-surface-100 dark:bg-surface-800 bg-opacity-80 hover:bg-opacity-100 rounded-lg border-2 border-dashed border-surface-300 dark:border-surface-700">
          <PlusIcon size={20} className="mr-2" />
          <span>Add Another Column</span>
        </button>
      )}
    </div>
  );
}

export default KanbanBoard;