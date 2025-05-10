import { motion } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';
import getIcon from '../utils/iconUtils';

function Task({ task, index, onClick }) {
  // Icons
  const Calendar = getIcon('Calendar');
  const AlertCircle = getIcon('AlertCircle');
  const Tag = getIcon('Tag');
  
  // Priority colors
  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };
  
  const handleClick = () => {
    if (onClick) onClick(task);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`task-card ${snapshot.isDragging ? 'opacity-70' : ''}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClick}
        >
          <h4 className="font-medium text-surface-800 dark:text-white text-xs mb-1">{task.title}</h4>
          {task.description && <p className="text-surface-600 dark:text-surface-400 text-xs mb-2 line-clamp-2">{task.description}</p>}
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {task.priority && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            )}
            
            {task.labels && task.labels.length > 0 && task.labels.map(label => (
              <span key={label} className="flex items-center bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 px-2 py-0.5 rounded-full text-xs">
                <Tag size={10} className="mr-1" />
                {label}
              </span>
            ))}
            
            {task.dueDate && (
              <span className="flex items-center text-surface-500 dark:text-surface-400 text-xs">
                <Calendar size={10} className="mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}

export default Task;