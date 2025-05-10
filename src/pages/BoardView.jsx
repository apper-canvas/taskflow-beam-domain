import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function BoardView({ darkMode, setDarkMode }) {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);


  // Define icons
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const LayoutGridIcon = getIcon('LayoutGrid');
  const UserIcon = getIcon('User');
  const SettingsIcon = getIcon('Settings');
  const LogOutIcon = getIcon('LogOut');
  const PlusIcon = getIcon('Plus');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');

  useEffect(() => {
    // Load board data
    const storedBoards = JSON.parse(localStorage.getItem('boards')) || [];
    const selectedBoard = storedBoards.find(b => b.id === boardId);
    
    if (!selectedBoard) {
      toast.error('Board not found');
      navigate('/');
      return;
    }
    
    setBoard(selectedBoard);
    
    // Load or initialize columns
  }, [boardId, navigate]);
  


  
  if (!board) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              onClick={() => navigate('/')}
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
      
      {/* Board Header */}
      <div className={`py-6 ${board.background}`}>
        <div className="container mx-auto px-4">
          <button 
            onClick={() => navigate('/')}
            className="mb-4 flex items-center text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-3 py-1.5"
          >
            <ArrowLeftIcon size={16} className="mr-1" />
            <span>Back to Boards</span>
          </button>
          <h2 className="text-3xl font-bold text-white mb-4">{board.title}</h2>
        </div>
      </div>
      
      {/* Board Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64 bg-surface-100 dark:bg-surface-800 rounded-lg">
          <p className="text-lg text-surface-600 dark:text-surface-400">Board content will be displayed here</p>
        </div>
      </div>
    </div>
  );
}


export default BoardView;