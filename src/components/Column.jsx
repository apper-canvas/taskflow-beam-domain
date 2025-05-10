import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import Task from './Task';

function Column({ column, tasks, setTasks, index, allTasks }) {
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
      
      // Clone all tasks to avoid direct mutation
      const updatedTasks = allTasks ? [...allTasks, newTask] : [newTask];
      
      // Update tasks
      setTasks(updatedTasks);
      
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
    <Draggable draggableId={column.id} index={index} type="column">
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="board-column flex-shrink-0"
        >
          {/* Column Header */}
          <div 
            className="p-3 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between"
            {...provided.dragHandleProps}
          >
            <h3 className="font-medium text-surface-800 dark:text-surface-100">{column.title}</h3>
            <button 
              className="p-1 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 rounded"
              aria-label="Column options"
            >
              <MoreHorizontalIcon size={16} />
            </button>
          </div>
          
          {/* Tasks */}
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div 
                className={`flex-1 overflow-y-auto p-2 scrollbar-thin ${
                  snapshot.isDraggingOver ? 'bg-surface-200 dark:bg-surface-700' : ''
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
            
                {isAddingTask ? (
                  <motion.form 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleAddTask} 
                    className="mt-2 bg-white dark:bg-surface-700 p-3 rounded-lg shadow-soft"
                  >
                    <h4 className="font-medium text-surface-800 dark:text-surface-100 mb-3">Add New Task</h4>
                    
                    <div className="space-y-3">
                      {/* Task Title */}
                      <div>
                        <label htmlFor={`task-title-${column.id}`} className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Title *
                        </label>
                        <input
                          id={`task-title-${column.id}`}
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
                        <label htmlFor={`task-description-${column.id}`} className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Description
                        </label>
                        <textarea
                          id={`task-description-${column.id}`}
                          className="input resize-none min-h-[80px]"
                          placeholder="Add more details to this task..."
                          value={newTaskDescription}
                          onChange={(e) => setNewTaskDescription(e.target.value)}
                        />
                      </div>
                      
                      {/* Task Priority */}
                      <div>
                        <label htmlFor={`task-priority-${column.id}`} className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Priority
                        </label>
                        <select
                          id={`task-priority-${column.id}`}
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
                        <label htmlFor={`task-due-date-${column.id}`} className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Due Date
                        </label>
                        <input
                          id={`task-due-date-${column.id}`}
                          type="date"
                          className="input"
                          value={newTaskDueDate}
                          onChange={(e) => setNewTaskDueDate(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <button type="submit" className="btn btn-primary" disabled={!newTaskTitle.trim()}>
                        <CheckIcon size={16} className="mr-1" /> Add Task
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => setIsAddingTask(false)}>
                        <XIcon size={16} className="mr-1" /> Cancel
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <button onClick={() => setIsAddingTask(true)} className="w-full mt-2 py-2 px-3 text-left text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded flex items-center">
                    <PlusIcon size={16} className="mr-2" />
                    <span>Add a task</span>
                  </button>
                )}
              </div>
            )}
          </Droppable>
          </div>
      )}
    </Draggable>
  );
}

export default Column;