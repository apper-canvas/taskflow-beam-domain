import { motion } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';
import getIcon from '../utils/iconUtils';
import { format } from 'date-fns';

function Task({ task, index, className = '' }) {
  // Icons
  const MessageSquareIcon = getIcon('MessageSquare');
  const PaperclipIcon = getIcon('Paperclip');
  
  // Generate a random number for this demo
  const commentCount = Math.floor(Math.random() * 5);
  const attachmentCount = Math.floor(Math.random() * 3);
  
  // Label colors mapping
  const labelColors = {
    design: 'bg-purple-500',
    dev: 'bg-blue-500',
    research: 'bg-green-500',
    meeting: 'bg-yellow-500',
    bug: 'bg-red-500',
    feature: 'bg-indigo-500'
  };

  return (
    <Draggable draggableId={task.id} index={index} type="task">
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'shadow-lg' : ''} ${className}`}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging
              ? provided.draggableProps.style.transform
              : 'translate(0, 0)'
            }}
          whileHover={!snapshot.isDragging ? { y: -2, transition: { duration: 0.2 } } : {}}
        >
          <div className="flex flex-wrap gap-1 mb-2">
            {task.labels && task.labels.map(label => (
              <span key={label} className={`${labelColors[label] || 'bg-gray-500'} px-2 py-0.5 rounded-full text-white text-xs`}>
                {label}
              </span>
            ))}
          </div>
          {task.description && (
            <p className="text-sm text-surface-600 dark:text-surface-400 mb-3 line-clamp-2">{task.description}</p>
          )}
          {task.description && <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">{task.description}</p>}
          <div className="flex items-center justify-between text-xs text-surface-500">
            <div className="flex items-center space-x-3">
              {commentCount > 0 && <span className="flex items-center"><MessageSquareIcon size={14} className="mr-1" /> {commentCount}</span>}
              {attachmentCount > 0 && <span className="flex items-center"><PaperclipIcon size={14} className="mr-1" /> {attachmentCount}</span>}
            {task.dueDate && (
              <div className="text-xs font-medium px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-600">
                {task.dueDate}
              </div>
            )}
           </div>
           {task.priority === 'high' && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 mt-1 mr-1"></div>}
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}

export default Task;