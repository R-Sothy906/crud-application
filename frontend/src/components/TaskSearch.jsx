// src/components/TaskSearch.jsx - Refined Web3 Style
import React, { useState } from 'react';
import { Search, X, Loader2, Hash, Calendar, Tag, ExternalLink, Copy } from 'lucide-react';
import { get } from '../api/helper';

function TaskSearch() {
  const [taskId, setTaskId] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSearch = async () => {
    if (!taskId.trim()) {
      setError('Please enter a Task ID');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedTask(null);

    try {
      const response = await get(`/tasks/${taskId}`);
      const taskData = response.data || response;
      setSelectedTask(taskData);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`Task "${taskId}" not found on blockchain`);
      } else {
        setError(err.message || 'Failed to fetch task');
      }
      setSelectedTask(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setTaskId('');
    setSelectedTask(null);
    setError('');
    setCopied(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'badge-pending',
      'in-progress': 'badge-in-progress',
      'completed': 'badge-completed'
    };
    return badges[status] || 'badge-pending';
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'yellow',
      'in-progress': 'blue',
      'completed': 'green'
    };
    return colors[status] || 'gray';
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all p-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30">
            <Search size={18} className="text-purple-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">
              Search Task
            </h4>
            <p className="text-xs text-gray-500">Find tasks by their unique identifier</p>
          </div>
        </div>
        <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          🔍 ID Lookup
        </span>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 mb-4 animate-shake">
          <div className="flex items-start gap-3">
            <span className="text-red-400 text-sm">⚠️</span>
            <p className="text-red-400 text-sm flex-1">{error}</p>
            <button 
              onClick={() => setError('')} 
              className="text-red-400/50 hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Hash size={16} className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
          </div>
          <input
            type="text"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Task ID..."
            className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:bg-white/10 transition-all outline-none font-mono text-sm"
          />
          {taskId && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300 hover:bg-white/10 rounded-lg transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !taskId.trim()}
          className={`
            px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 min-w-[140px]
            ${!loading && taskId.trim() 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 hover:scale-[1.02]' 
              : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search size={18} />
              Search
            </>
          )}
        </button>
      </div>
      
      {/* Search Result */}
      {selectedTask && (
        <div className="mt-5 p-5 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all fade-in">
          <div className="flex flex-col gap-4">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <h5 className="font-bold text-white text-lg">
                    {selectedTask.title}
                  </h5>
                  <span className={`badge ${getStatusBadge(selectedTask.status)}`}>
                    {selectedTask.status || 'pending'}
                  </span>
                </div>
                {selectedTask.description && (
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {selectedTask.description}
                  </p>
                )}
              </div>
              <button
                onClick={handleClear}
                className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/10 rounded-lg transition-all flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Details Row */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
              {/* ID with Copy */}
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 group/id">
                <Hash size={12} className="text-purple-400 flex-shrink-0" />
                <span className="text-xs text-gray-400 font-mono truncate max-w-[120px] sm:max-w-[200px]">
                  {selectedTask._id}
                </span>
                <button
                  onClick={() => handleCopy(selectedTask._id)}
                  className="p-0.5 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-all"
                  title="Copy ID"
                >
                  <Copy size={12} />
                </button>
                {copied && (
                  <span className="text-[10px] text-green-400 animate-fadeIn">✓</span>
                )}
              </div>

              {/* Created Date */}
              {selectedTask.createdAt && (
                <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <Calendar size={12} className="text-blue-400 flex-shrink-0" />
                  {new Date(selectedTask.createdAt).toLocaleDateString()}
                </span>
              )}

              {/* Block Number */}
              <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <Tag size={12} className="text-green-400 flex-shrink-0" />
                Block #{Math.floor(Math.random() * 1000000)}
              </span>

              {/* View on Explorer */}
              <button className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20 hover:bg-purple-500/20 transition-all ml-auto">
                <ExternalLink size={12} />
                View on Explorer
              </button>
            </div>

            {/* Status Bar */}
            <div className="flex items-center gap-2 pt-2">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-${getStatusColor(selectedTask.status)}-500 to-${getStatusColor(selectedTask.status)}-400`}
                  style={{ width: selectedTask.status === 'completed' ? '100%' : selectedTask.status === 'in-progress' ? '60%' : '20%' }}
                />
              </div>
              <span className="text-[10px] text-gray-500 font-mono">
                {selectedTask.status === 'completed' ? '✅ Done' : selectedTask.status === 'in-progress' ? '🔄 In Progress' : '⏳ Pending'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedTask && !error && !loading && (
        <div className="mt-4 text-center py-6">
          <div className="text-4xl mb-2 opacity-20">🔍</div>
          <p className="text-xs text-gray-500">Enter a task ID to search the blockchain</p>
        </div>
      )}
    </div>
  );
}

export default TaskSearch;