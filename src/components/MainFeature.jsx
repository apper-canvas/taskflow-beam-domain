import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function MainFeature() {
  // Define all icons
  const PlusIcon = getIcon('Plus');
  const GripIcon = getIcon('GripVertical');
  const PencilIcon = getIcon('Pencil');
  const TrashIcon = getIcon('Trash2');
  const ClockIcon = getIcon('Clock');
  const TagIcon = getIcon('Tag');
  const UserIcon = getIcon('User');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');

  // State for the kanban board
  const [lists, setLists] = useState(
    JSON.parse(localStorage.getItem('kanbanLists')) || [
      {
        id: '1',
        title: 'To Do',
        cards: [
          { id: '101', title: 'Research competitors', description: 'Analyze top 5 competitor products', labels: ['Research', 'Planning'], dueDate: '2023-12-15' },
          { id: '102', title: 'Create wireframes', description: 'Design initial UI mockups for review', labels: ['Design'], dueDate: '2023-12-20' }
        ]
      },
      {
        id: '2',
        title: 'In Progress',
        cards: [
          { id: '201', title: 'Develop MVP', description: 'Build core functionality for beta testing', labels: ['Development'], dueDate: '2023-12-25' },
          { id: '202', title: 'User testing', description: 'Conduct usability tests with 5 participants', labels: ['Testing', 'UX'], dueDate: '2023-12-30' }
        ]
      },
      {
        id: '3',
        title: 'Done',
        cards: [
          { id: '301', title: 'Initial planning', description: 'Define project scope and timeline', labels: ['Planning', 'Documentation'], dueDate: '2023-12-10' }
        ]
      }
    ]
  );

  // State for editing cards and lists
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [activeCardId, setActiveCardId] = useState(null);
  const [isAddingCard, setIsAddingCard] = useState(null);
  const [newCardData, setNewCardData] = useState({
    title: '',
    description: '',
    labels: [],
    dueDate: ''
  });
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [draggedListId, setDraggedListId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  // Available labels
  const availableLabels = [
    { id: 'design', name: 'Design', color: 'bg-purple-500' },
    { id: 'development', name: 'Development', color: 'bg-blue-500' },
    { id: 'testing', name: 'Testing', color: 'bg-green-500' },
    { id: 'research', name: 'Research', color: 'bg-yellow-500' },
    { id: 'planning', name: 'Planning', color: 'bg-pink-500' },
    { id: 'ux', name: 'UX', color: 'bg-indigo-500' },
    { id: 'documentation', name: 'Documentation', color: 'bg-gray-500' }
  ];

  // Save lists to localStorage when they change
  useEffect(() => {
    localStorage.setItem('kanbanLists', JSON.stringify(lists));
  }, [lists]);

  // Add a new list
  const handleAddList = (e) => {
    e.preventDefault();
    if (newListTitle.trim()) {
      const newList = {
        id: Date.now().toString(),
        title: newListTitle,
        cards: []
      };
      
      setLists([...lists, newList]);
      setNewListTitle('');
      setIsAddingList(false);
      toast.success('New list added!');
    }
  };

  // Delete a list
  const handleDeleteList = (listId) => {
    const updatedLists = lists.filter(list => list.id !== listId);
    setLists(updatedLists);
    toast.info('List deleted');
  };

  // Add a new card
  const handleAddCard = (e, listId) => {
    e.preventDefault();
    if (newCardData.title.trim()) {
      const newCard = {
        id: Date.now().toString(),
        title: newCardData.title,
        description: newCardData.description,
        labels: newCardData.labels,
        dueDate: newCardData.dueDate
      };
      
      const updatedLists = lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: [...list.cards, newCard]
          };
        }
        return list;
      });
      
      setLists(updatedLists);
      setIsAddingCard(null);
      setNewCardData({
        title: '',
        description: '',
        labels: [],
        dueDate: ''
      });
      toast.success('New card added!');
    }
  };

  // Toggle label selection
  const toggleLabel = (labelId) => {
    if (newCardData.labels.includes(labelId)) {
      setNewCardData({
        ...newCardData,
        labels: newCardData.labels.filter(id => id !== labelId)
      });
    } else {
      setNewCardData({
        ...newCardData,
        labels: [...newCardData.labels, labelId]
      });
    }
  };

  // Delete a card
  const handleDeleteCard = (listId, cardId) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          cards: list.cards.filter(card => card.id !== cardId)
        };
      }
      return list;
    });
    
    setLists(updatedLists);
    setActiveCardId(null);
    toast.info('Card deleted');
  };

  // Drag and drop functionality
  const handleDragStart = (cardId, listId) => {
    setDraggedCardId(cardId);
    setDraggedListId(listId);
  };

  const handleDragOver = (e, targetListId) => {
    e.preventDefault();
    setDropTarget(targetListId);
  };

  const handleDrop = (e, targetListId) => {
    e.preventDefault();
    
    if (draggedCardId && draggedListId) {
      const sourceList = lists.find(list => list.id === draggedListId);
      const card = sourceList.cards.find(card => card.id === draggedCardId);
      
      if (draggedListId === targetListId) return;
      
      // Remove card from source list
      const updatedLists = lists.map(list => {
        if (list.id === draggedListId) {
          return {
            ...list,
            cards: list.cards.filter(c => c.id !== draggedCardId)
          };
        }
        return list;
      });
      
      // Add card to target list
      const finalLists = updatedLists.map(list => {
        if (list.id === targetListId) {
          return {
            ...list,
            cards: [...list.cards, card]
          };
        }
        return list;
      });
      
      setLists(finalLists);
      toast.success('Card moved');
    }
    
    setDraggedCardId(null);
    setDraggedListId(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
    setDraggedListId(null);
    setDropTarget(null);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Active Board: Product Development</h2>
      
      <div className="flex items-start space-x-4 overflow-x-auto pb-4 scrollbar-thin">
        {lists.map(list => (
          <div 
            key={list.id}
            className={`board-column ${dropTarget === list.id ? 'ring-2 ring-primary' : ''}`}
            onDragOver={(e) => handleDragOver(e, list.id)}
            onDrop={(e) => handleDrop(e, list.id)}
          >
            <div className="p-3 border-b border-surface-200 dark:border-surface-700 bg-surface-200 dark:bg-surface-700 flex justify-between items-center">
              <h3 className="font-semibold text-surface-800 dark:text-surface-100">{list.title}</h3>
              <div className="flex space-x-1">
                <button 
                  className="p-1 rounded hover:bg-surface-300 dark:hover:bg-surface-600"
                  onClick={() => setIsAddingCard(list.id)}
                >
                  <PlusIcon size={16} />
                </button>
                <button 
                  className="p-1 rounded hover:bg-surface-300 dark:hover:bg-surface-600"
                  onClick={() => handleDeleteList(list.id)}
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-2 overflow-y-auto flex-grow">
              <AnimatePresence>
                {list.cards.map(card => (
                  <motion.div
                    key={card.id}
                    layoutId={card.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`task-card ${draggedCardId === card.id ? 'opacity-50' : ''}`}
                    onClick={() => setActiveCardId(card.id)}
                    draggable
                    onDragStart={() => handleDragStart(card.id, list.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-surface-800 dark:text-surface-100">{card.title}</h4>
                      <div className="text-surface-400 dark:text-surface-500 cursor-move">
                        <GripIcon size={16} />
                      </div>
                    </div>
                    
                    {card.description && (
                      <p className="text-sm text-surface-600 dark:text-surface-400 mt-1 line-clamp-2">
                        {card.description}
                      </p>
                    )}
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {card.labels && card.labels.map(label => {
                          const labelInfo = availableLabels.find(l => l.id.toLowerCase() === label.toLowerCase());
                          return labelInfo ? (
                            <span 
                              key={label} 
                              className={`${labelInfo.color} text-white text-xs px-2 py-0.5 rounded`}
                            >
                              {labelInfo.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                      
                      {card.dueDate && (
                        <div className="text-xs flex items-center text-surface-500">
                          <ClockIcon size={12} className="mr-1" />
                          {new Date(card.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isAddingCard === list.id && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-surface-700 p-3 rounded-lg shadow-md border border-surface-200 dark:border-surface-600 mt-2"
                  onSubmit={(e) => handleAddCard(e, list.id)}
                >
                  <div className="mb-3">
                    <input
                      type="text"
                      className="input text-sm py-1.5"
                      placeholder="Card title"
                      value={newCardData.title}
                      onChange={(e) => setNewCardData({...newCardData, title: e.target.value})}
                      autoFocus
                    />
                  </div>
                  
                  <div className="mb-3">
                    <textarea
                      className="input text-sm py-1.5 min-h-[60px]"
                      placeholder="Description (optional)"
                      value={newCardData.description}
                      onChange={(e) => setNewCardData({...newCardData, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1 flex items-center">
                      <TagIcon size={12} className="mr-1" />
                      Labels
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {availableLabels.map(label => (
                        <button
                          key={label.id}
                          type="button"
                          className={`text-xs px-2 py-0.5 rounded ${
                            newCardData.labels.includes(label.id)
                              ? label.color + ' text-white'
                              : 'bg-surface-100 dark:bg-surface-600 text-surface-700 dark:text-surface-300'
                          }`}
                          onClick={() => toggleLabel(label.id)}
                        >
                          {label.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 flex items-center">
                      <ClockIcon size={12} className="mr-1" />
                      Due Date (optional)
                    </label>
                    <input
                      type="date"
                      className="input text-sm py-1.5"
                      value={newCardData.dueDate}
                      onChange={(e) => setNewCardData({...newCardData, dueDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="btn btn-outline text-xs py-1 px-2"
                      onClick={() => setIsAddingCard(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary text-xs py-1 px-3"
                      disabled={!newCardData.title.trim()}
                    >
                      Add Card
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </div>
        ))}
        
        {/* Add New List */}
        <div className="flex-shrink-0 w-[280px] md:w-[320px]">
          {!isAddingList ? (
            <button
              className="w-full h-12 bg-surface-200/80 dark:bg-surface-800/80 rounded-lg border border-dashed border-surface-300 dark:border-surface-700 flex items-center justify-center text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              onClick={() => setIsAddingList(true)}
            >
              <PlusIcon size={16} className="mr-1" />
              <span>Add New List</span>
            </button>
          ) : (
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-surface-800 p-3 rounded-lg shadow-card"
              onSubmit={handleAddList}
            >
              <input
                type="text"
                className="input mb-3"
                placeholder="Enter list title"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="btn btn-outline py-1 px-3"
                  onClick={() => setIsAddingList(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary py-1 px-3"
                  disabled={!newListTitle.trim()}
                >
                  <CheckIcon size={16} className="mr-1" />
                  Add List
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
      
      {/* Card Detail Modal */}
      <AnimatePresence>
        {activeCardId && (() => {
          const listWithCard = lists.find(list => 
            list.cards.some(card => card.id === activeCardId)
          );
          const card = listWithCard.cards.find(card => card.id === activeCardId);
          
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setActiveCardId(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md shadow-xl overflow-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold pr-4">{card.title}</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500">
                      <PencilIcon size={18} />
                    </button>
                    <button 
                      className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500"
                      onClick={() => setActiveCardId(null)}
                    >
                      <XIcon size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">
                    In list <span className="font-medium">{listWithCard.title}</span>
                  </p>
                </div>
                
                {card.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Description</h4>
                    <p className="text-surface-700 dark:text-surface-300 text-sm bg-surface-50 dark:bg-surface-700 p-3 rounded-lg">
                      {card.description}
                    </p>
                  </div>
                )}
                
                {card.labels && card.labels.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 flex items-center">
                      <TagIcon size={14} className="mr-1" />
                      Labels
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {card.labels.map(label => {
                        const labelInfo = availableLabels.find(l => l.id.toLowerCase() === label.toLowerCase());
                        return labelInfo ? (
                          <span 
                            key={label} 
                            className={`${labelInfo.color} text-white text-xs px-2 py-1 rounded flex items-center`}
                          >
                            {labelInfo.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                
                {card.dueDate && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-2 flex items-center">
                      <ClockIcon size={14} className="mr-1" />
                      Due Date
                    </h4>
                    <div className="text-sm bg-surface-50 dark:bg-surface-700 px-3 py-2 rounded-lg inline-flex items-center">
                      {new Date(card.dueDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between pt-2 border-t border-surface-200 dark:border-surface-700">
                  <button 
                    className="btn btn-outline text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30"
                    onClick={() => handleDeleteCard(listWithCard.id, card.id)}
                  >
                    <TrashIcon size={16} className="mr-1" />
                    Delete Card
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

export default MainFeature;