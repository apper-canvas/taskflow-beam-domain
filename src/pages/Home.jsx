import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home({ darkMode, setDarkMode }) {
  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem('boards')) || [
      { id: '1', title: 'Product Roadmap', background: 'bg-gradient-to-r from-purple-500 to-indigo-600' },
      { id: '2', title: 'Marketing Campaign', background: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
      { id: '3', title: 'Design Sprints', background: 'bg-gradient-to-r from-emerald-500 to-green-500' },
    ]
  );
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  
  // Define all icons
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const PlusIcon = getIcon('Plus');
  const LayoutGridIcon = getIcon('LayoutGrid');
  const XIcon = getIcon('X');
  const SettingsIcon = getIcon('Settings');
  const LogOutIcon = getIcon('LogOut');
  const UserIcon = getIcon('User');
  const CheckIcon = getIcon('Check');
  
  useEffect(() => {
    localStorage.setItem('boards', JSON.stringify(boards));
  }, [boards]);
  
  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      const backgroundOptions = [
        'bg-gradient-to-r from-purple-500 to-indigo-600',
        'bg-gradient-to-r from-blue-500 to-cyan-500',
        'bg-gradient-to-r from-emerald-500 to-green-500',
        'bg-gradient-to-r from-yellow-500 to-orange-500',
        'bg-gradient-to-r from-rose-500 to-pink-500',
      ];
      
      const newBoard = {
        id: Date.now().toString(),
        title: newBoardTitle.trim(),
        background: backgroundOptions[Math.floor(Math.random() * backgroundOptions.length)]
      };
      
      setBoards([...boards, newBoard]);
      setNewBoardTitle('');
      setIsCreatingBoard(false);
      toast.success(`Board "${newBoardTitle}" created successfully!`);
    }
  };
  
  const handleBoardSelect = (boardId) => {
    const selectedBoard = boards.find(board => board.id === boardId);
    if (selectedBoard) {
      toast.info(`Board "${selectedBoard.title}" selected`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-surface-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div 
              className="text-primary w-10 h-10 flex items-center justify-center rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LayoutGridIcon size={26} />
            </motion.div>
            <h1 className="text-xl md:text-2xl font-bold text-surface-800 dark:text-white mb-0">TaskFlow</h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              className="p-2 rounded-full text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white focus:outline-none"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </button>
            
            <div className="relative group">
              <button className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center focus:outline-none">
                <UserIcon size={16} className="text-surface-600 dark:text-surface-300" />
              </button>
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-surface-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center space-x-2">
                  <SettingsIcon size={16} />
                  <span>Settings</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center space-x-2">
                  <LogOutIcon size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold mb-0">Your Boards</h2>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreatingBoard(true)}
            >
              <PlusIcon size={18} className="mr-1" />
              <span>Create Board</span>
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards.map((board) => (
              <motion.div
                key={board.id}
                className={`${board.background} rounded-xl p-6 shadow-card h-40 cursor-pointer flex flex-col justify-between transition-transform`}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBoardSelect(board.id)}
              >
                <h3 className="text-white font-bold text-xl">{board.title}</h3>
                <div className="mt-4 flex justify-end">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg py-1 px-3 text-xs text-white">
                    View Board
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Create Board Modal */}
        {isCreatingBoard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Create New Board</h3>
                <button 
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700" 
                  onClick={() => setIsCreatingBoard(false)}
                >
                  <XIcon size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateBoard}>
                <div className="mb-4">
                  <label htmlFor="boardTitle" className="block text-sm font-medium mb-1">Board Title</label>
                  <input
                    id="boardTitle"
                    type="text"
                    className="input"
                    placeholder="Enter board title"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setIsCreatingBoard(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!newBoardTitle.trim()}
                  >
                    <CheckIcon size={18} className="mr-1" />
                    Create Board
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        
        {/* Main Feature */}
        <MainFeature />
      </main>
    </div>
  );
}

export default Home;