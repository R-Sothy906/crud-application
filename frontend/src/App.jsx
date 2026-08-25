// src/App.jsx - Web3 Modern Design
import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskSearch from './components/TaskSearch';
import { get } from './api/helper';
import { Zap, Layers, Activity, Wallet } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await get('/tasks');
      setTasks(data.data || data);
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // Simulate wallet connection
    setTimeout(() => setIsConnected(true), 1000);
  }, []);

  const handleTaskCreated = () => {
    setEditingTask(null);
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f36] to-[#0a0e1a]">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent pointer-events-none" />
      
      {/* Glowing Orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header - Web3 Style */}
        <header className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl">
                  <Zap className="text-white" size={28} />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  TaskChain
                </h1>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Activity size={14} className="text-green-400" />
                  <span className="text-green-400">●</span> Decentralized Task Management
                </p>
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
                <Layers size={16} className="text-purple-400" />
                <span className="text-xs text-gray-400">Network</span>
                <span className="text-xs font-mono text-green-400">● Mainnet</span>
              </div>
              <button 
                className={`group relative px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  isConnected 
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 hover:shadow-lg hover:shadow-green-500/20'
                    : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                  <span>{isConnected ? '0x8f...3a4b' : 'Connect Wallet'}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Total</span>
                <span className="text-2xl font-bold text-white">{stats.total}</span>
              </div>
              <div className="mt-1 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: '100%' }} />
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-yellow-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Pending</span>
                <span className="text-2xl font-bold text-yellow-400">{stats.pending}</span>
              </div>
              <div className="mt-1 h-1 bg-yellow-500 rounded-full" style={{ width: stats.total ? (stats.pending/stats.total)*100 : 0 }} />
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-blue-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">In Progress</span>
                <span className="text-2xl font-bold text-blue-400">{stats.inProgress}</span>
              </div>
              <div className="mt-1 h-1 bg-blue-500 rounded-full" style={{ width: stats.total ? (stats.inProgress/stats.total)*100 : 0 }} />
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-green-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Completed</span>
                <span className="text-2xl font-bold text-green-400">{stats.completed}</span>
              </div>
              <div className="mt-1 h-1 bg-green-500 rounded-full" style={{ width: stats.total ? (stats.completed/stats.total)*100 : 0 }} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Task Search */}
          <TaskSearch />

          {/* Task Form */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 hover:border-purple-500/30 transition-all">
            <TaskForm
              onTaskCreated={handleTaskCreated}
              taskToEdit={editingTask}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          {/* Task List */}
          <TaskList
            tasks={tasks}
            loading={loading}
            onRefresh={fetchTasks}
            onEdit={handleEditTask}
          />
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-500 border-t border-white/5 pt-8">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-purple-500 rounded-full" />
              <span>© 2026 TaskChain</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">⚡ Powered by Web3</span>
              <span className="text-xs">🔒 Secure</span>
              <span className="text-xs">🌐 Decentralized</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-400">●</span>
              <span className="text-xs">All systems operational</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;