import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function Task({ task }) {
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
    <motion.div
      className="task-card"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="flex flex-wrap gap-1 mb-2">
        {task.labels && task.labels.map(label => (
          <span key={label} className={`${labelColors[label] || 'bg-gray-500'} px-2 py-0.5 rounded-full text-white text-xs`}>
            {label}
          </span>
        ))}
      </div>
      <h4 className="font-medium text-surface-800 dark:text-surface-100 mb-2">{task.title}</h4>
      {task.description && <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">{task.description}</p>}
      <div className="flex items-center justify-between text-xs text-surface-500">
        <div className="flex items-center space-x-3">
          {commentCount > 0 && <span className="flex items-center"><MessageSquareIcon size={14} className="mr-1" /> {commentCount}</span>}
          {attachmentCount > 0 && <span className="flex items-center"><PaperclipIcon size={14} className="mr-1" /> {attachmentCount}</span>}
        </div>
      </div>
    </motion.div>
  );
}

export default Task;