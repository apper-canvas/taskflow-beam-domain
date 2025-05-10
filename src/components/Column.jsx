import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import Task from './Task';

function Column({ column, tasks, setTasks }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  // Icons
  const PlusIcon = getIcon('Plus');
  const MoreHorizontalIcon = getIcon('MoreHorizontal');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (newTaskTitle.trim()) {
      const newTask = {
        id: `task_${Date.now()}`,
        columnId: column.id,
        title: newTaskTitle.trim(),
        description: '',
        labels: [],
        order: tasks.length
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      setNewTaskTitle('');
      setIsAddingTask(false);
      toast.success('Task added successfully');
    }
  };

  return (
    <div className="board-column">
      {/* Column Header */}
      <div className="p-3 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
        <h3 className="font-medium text-surface-800 dark:text-surface-100">{column.title}</h3>
        <button className="p-1 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 rounded">
          <MoreHorizontalIcon size={16} />
        </button>
      </div>
      
      {/* Tasks */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {tasks.map(task => (
          <Task key={task.id} task={task} />
        ))}
        
        {isAddingTask ? (
          <form onSubmit={handleAddTask} className="mt-2">
            <textarea
              className="input resize-none min-h-[60px]"
              placeholder="Enter task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              autoFocus
            />
            <div className="flex space-x-2 mt-2">
              <button type="submit" className="btn btn-primary py-1 px-3 text-xs">Add Task</button>
              <button type="button" className="btn btn-outline py-1 px-3 text-xs" onClick={() => setIsAddingTask(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setIsAddingTask(true)} className="w-full mt-2 py-2 px-3 text-left text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded flex items-center">
            <PlusIcon size={16} className="mr-2" />
            <span>Add a task</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Column;