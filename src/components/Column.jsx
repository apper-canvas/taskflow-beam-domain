import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import Task from './Task';

function Column({ column, tasks, setTasks }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskLabels, setNewTaskLabels] = useState([]);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  
  // Icons
  const PlusIcon = getIcon('Plus');
  const MoreHorizontalIcon = getIcon('MoreHorizontal');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  const TagIcon = getIcon('Tag');
  const CalendarIcon = getIcon('Calendar');
  
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (newTaskTitle.trim()) {
      const newTask = {
        id: `task_${Date.now()}`,
        columnId: column.id,
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        labels: newTaskLabels,
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
        order: tasks.length,
        createdAt: new Date().toISOString()
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setNewTaskLabels([]);
      setNewTaskDueDate('');
      setIsAddingTask(false);
      
      // Show success message
      
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
          <form onSubmit={handleAddTask} className="mt-2 bg-white dark:bg-surface-700 p-3 rounded-lg shadow-soft">
            <h4 className="font-medium text-surface-800 dark:text-surface-100 mb-3">Add New Task</h4>
            
            <div className="space-y-3">
              {/* Task Title */}
              <div>
                <label htmlFor="task-title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Title *
                </label>
                <input
                  id="task-title"
                  type="text"
                  className="input"
                  placeholder="Enter task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              
              {/* Task Description */}
              <div>
                <label htmlFor="task-description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Description
                </label>
                <textarea
                  id="task-description"
                  className="input resize-none min-h-[80px]"
                  placeholder="Add more details to this task..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
              </div>
              
              {/* Task Priority */}
              <div>
                <label htmlFor="task-priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Priority
                </label>
                <select
                  id="task-priority"
                  className="input"
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              {/* Task Labels */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Labels
                </label>
                <div className="flex flex-wrap gap-2">
                  {['design', 'dev', 'research', 'meeting', 'bug', 'feature'].map(label => (
                    <button
                      key={label}
                      type="button"
                      className={`px-2 py-1 rounded-full text-xs ${
                        newTaskLabels.includes(label) 
                          ? 'bg-primary text-white' 
                          : 'bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300'
                      }`}
                      onClick={() => setNewTaskLabels(prev => 
                        prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Due Date */}
              <div>
                <label htmlFor="task-due-date" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Due Date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  className="input"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button type="submit" className="btn btn-primary">Add Task</button>
              <button type="button" className="btn btn-outline" onClick={() => setIsAddingTask(false)}>Cancel</button>
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