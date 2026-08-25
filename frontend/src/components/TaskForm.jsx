// src/components/TaskForm.jsx - Refined Web3 Style
import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle, AlertCircle, Sparkles, Plus, Edit3 } from 'lucide-react';
import { post, put } from '../api/helper';

function TaskForm({ onTaskCreated, taskToEdit, onCancelEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  
  const isEditing = !!taskToEdit;

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        status: taskToEdit.status || 'pending'
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = isEditing 
        ? await put(`/tasks/${taskToEdit._id}`, formData)
        : await post('/tasks', formData);
      
      // Simulate transaction hash
      const hash = '0x' + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      setTxHash(hash);
      
      setSuccess(true);
      setFormData({ title: '', description: '', status: 'pending' });
      
      setTimeout(() => {
        if (onTaskCreated) onTaskCreated();
        if (isEditing && onCancelEdit) onCancelEdit();
      }, 1500);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', status: 'pending' });
    setError('');
    setSuccess(false);
    setTxHash('');
    if (onCancelEdit) onCancelEdit();
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: '⏳', color: 'yellow' },
    { value: 'in-progress', label: 'In Progress', icon: '🔄', color: 'blue' },
    { value: 'completed', label: 'Completed', icon: '✅', color: 'green' }
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className={`
              p-2 rounded-xl 
              ${isEditing 
                ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                : 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30'
              }
            `}>
              {isEditing ? (
                <Edit3 size={20} className="text-blue-400" />
              ) : (
                <Plus size={20} className="text-green-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isEditing ? 'Edit Task' : 'Create New Task'}
              </h3>
              <p className="text-sm text-gray-400">
                {isEditing ? 'Update task details on the blockchain' : 'Deploy a new task to the network'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 animate-shake">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
            <button 
              onClick={() => setError('')} 
              className="text-red-400/50 hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4 animate-slideDown">
          <div className="flex items-start gap-3">
            <CheckCircle size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-green-400 text-sm font-medium">
                Task {isEditing ? 'updated' : 'created'} successfully!
              </p>
              {txHash && (
                <div className="mt-2 flex items-center gap-2 bg-black/30 rounded-lg px-3 py-1.5">
                  <span className="text-xs text-gray-400">Tx:</span>
                  <span className="text-xs font-mono text-green-400/70 truncate">
                    {txHash}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Task Title <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:bg-white/10 transition-all outline-none"
                placeholder="Enter task title..."
                required
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-xs text-gray-500">required</span>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description <span className="text-gray-500 text-xs font-normal">(optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:bg-white/10 transition-all outline-none resize-none"
              placeholder="Add a detailed description..."
              rows="3"
              disabled={loading}
            />
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    relative cursor-pointer p-3 rounded-xl border-2 transition-all text-center
                    ${formData.status === option.value 
                      ? `border-${option.color}-500/50 bg-${option.color}-500/10 shadow-lg shadow-${option.color}-500/10`
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={formData.status === option.value}
                    onChange={handleChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">{option.icon}</span>
                    <span className={`
                      text-xs font-medium
                      ${formData.status === option.value 
                        ? `text-${option.color}-400`
                        : 'text-gray-400'
                      }
                    `}>
                      {option.label}
                    </span>
                  </div>
                  {formData.status === option.value && (
                    <div className={`
                      absolute -top-1 -right-1 w-3 h-3 rounded-full 
                      bg-${option.color}-500 border-2 border-[#0a0e1a]
                    `} />
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={loading}
            className={`
              flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
              ${isEditing 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-600/20'
              }
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}
            `}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                {isEditing ? (
                  <>
                    <Edit3 size={18} />
                    Update Task
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Task
                  </>
                )}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white font-medium transition-all"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;