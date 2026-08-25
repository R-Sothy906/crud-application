// src/components/TaskList.jsx - Web3 Style
import React from 'react';
import { Edit2, Trash2, RefreshCw, Calendar, Hash, ExternalLink } from 'lucide-react';
import { del } from '../api/helper';

function TaskList({ tasks, loading, onRefresh, onEdit }) {
  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this task from the chain?')) {
      return;
    }

    try {
      await del(`/tasks/${id}`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete task');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'badge-pending',
      'in-progress': 'badge-in-progress',
      'completed': 'badge-completed'
    };
    return badges[status] || 'badge-pending';
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="glass-card p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-2xl opacity-20 animate-pulse" />
            <RefreshCw className="animate-spin text-purple-400" size={48} />
          </div>
          <p className="text-gray-400 mt-4">Syncing with blockchain...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="glass-card text-center py-16">
        <div className="text-7xl mb-4 opacity-50">📋</div>
        <h3 className="text-2xl font-semibold text-gray-200">No Tasks on Chain</h3>
        <p className="text-gray-400 mt-2">Deploy your first task to the network</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
          <span className="text-xs text-gray-400">Ready to deploy</span>
          <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-200">
            📦 Task Pool
          </h3>
          <span className="bg-purple-500/20 text-purple-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-500/30">
            {tasks.length} assets
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="p-2.5 text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-xl transition-all"
          title="Sync with chain"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      
      <div className="grid gap-4">
        {tasks.map((task, index) => (
          <div
            key={task._id}
            className="group bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/5 hover:border-purple-500/30 transition-all duration-300 fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-200 text-base">
                    {task.title}
                  </h4>
                  <span className={`badge ${getStatusBadge(task.status)}`}>
                    {task.status || 'pending'}
                  </span>
                </div>
                {task.description && (
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 font-mono bg-black/20 px-3 py-1 rounded-full">
                    <Hash size={12} className="text-purple-400" />
                    {task._id.slice(0, 8)}...{task._id.slice(-6)}
                  </span>
                  {task.createdAt && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-black/20 px-3 py-1 rounded-full">
                      <Calendar size={12} className="text-blue-400" />
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                    Verified
                  </span>
                </div>
              </div>
              
              <div className="flex gap-1 ml-auto sm:ml-0">
                <button
                  onClick={() => onEdit(task)}
                  className="p-2.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all"
                  title="Edit task"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Delete task"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  className="p-2.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  title="View on chain"
                >
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;