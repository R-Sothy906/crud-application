import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useTaskStore from '../../store/taskStore';
import Logout from '../auth/Logout.jsx';

const Task = () => {
  const {
    tasks,
    task,
    loading,
    error,
    fetchTasks,
    fetchTaskById,
    addTask,
    editTask,
    removeTask,
    clearError,
    clearTask,
  } = useTaskStore();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
  });

  const [localError, setLocalError] = useState(null);

  const showSuccess = (title, text = '') => {
    Swal.fire({
      icon: 'success',
      title,
      text,
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
      position: 'top-end',
      toast: true,
      background: '#ffffff',
      color: '#0f172a',
    });
  };

  const showError = (title, text = '') => {
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#4f46e5',
      borderRadius: '16px',
    });
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        await fetchTasks();
      } catch (err) {
        console.error('Failed to load tasks:', err);

        setLocalError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load tasks.'
        );
      }
    };

    loadTasks();

    return () => {
      clearError();
      clearTask();
    };
  }, [fetchTasks, clearError, clearTask]);

  const handleLoadTasks = async () => {
    setLocalError(null);
    clearError();

    try {
      Swal.fire({
        title: 'Loading Tasks...',
        text: 'Please wait while we get the latest data.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await fetchTasks();

      Swal.close();

      showSuccess(
        'Tasks Loaded!',
        'Your task list has been refreshed.'
      );
    } catch (err) {
      console.error('Failed to load tasks:', err);

      Swal.close();

      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to load tasks.';

      setLocalError(message);
      showError('Loading Failed', message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (localError) setLocalError(null);
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLocalError(null);
    clearError();

    if (!formData.title.trim()) {
      showError(
        'Missing Task Title',
        'Please enter a title for your task.'
      );
      return;
    }

    try {
      if (isEditing && selectedTaskId) {
        await editTask(selectedTaskId, formData);
        await fetchTasks();

        setIsEditing(false);
        setSelectedTaskId(null);

        setFormData({
          title: '',
          description: '',
          status: 'pending',
        });

        showSuccess(
          'Task Updated!',
          'Your task has been updated successfully.'
        );

        return;
      }

      await addTask(formData);
      await fetchTasks();

      setFormData({
        title: '',
        description: '',
        status: 'pending',
      });

      showSuccess(
        'Task Created!',
        'Your new task has been added successfully.'
      );
    } catch (err) {
      console.error('Operation failed:', err);

      const message =
        err.response?.data?.message ||
        err.message ||
        'Operation failed.';

      setLocalError(message);
      showError('Operation Failed', message);
    }
  };

  const handleEdit = (task) => {
    setIsEditing(true);
    setSelectedTaskId(task._id);

    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'pending',
    });

    document
      .querySelector('.task-form-container')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Task?',
      html: `
        <p style="color:#64748b">
          Are you sure you want to delete
          <strong style="color:#0f172a">
            "${title}"
          </strong>?
        </p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
      borderRadius: '20px',
    });

    if (!result.isConfirmed) return;

    try {
      setLocalError(null);
      clearError();

      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await removeTask(id);
      await fetchTasks();

      Swal.close();

      showSuccess(
        'Task Deleted!',
        `"${title}" has been removed successfully.`
      );
    } catch (err) {
      console.error('Delete failed:', err);

      Swal.close();

      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to delete task.';

      setLocalError(message);
      showError('Delete Failed', message);
    }
  };

  const handleViewTask = async (id) => {
    try {
      setLocalError(null);
      clearError();

      await fetchTaskById(id);
    } catch (err) {
      console.error('Fetch task failed:', err);

      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch task details.';

      setLocalError(message);
      showError('Unable to Load Task', message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedTaskId(null);

    setFormData({
      title: '',
      description: '',
      status: 'pending',
    });

    setLocalError(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };

      case 'in-progress':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
        };

      default:
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
        };
    }
  };

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === 'completed'
  ).length;

  const progressTasks = tasks.filter(
    (task) => task.status === 'in-progress'
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === 'pending'
  ).length;

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          <p className="mt-4 font-medium text-slate-500">
            Loading tasks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Task Manager
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  Manage your tasks and stay productive.
                </p>
              </div>
            </div>

            <Logout />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Tasks</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {totalTasks}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <p className="mt-1 text-3xl font-bold text-amber-600">
                  {pendingTasks}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">In Progress</p>
                <p className="mt-1 text-3xl font-bold text-blue-600">
                  {progressTasks}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3"
                  />
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="mt-1 text-3xl font-bold text-emerald-600">
                  {completedTasks}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {(error || localError) && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <span className="mt-0.5 text-red-500">⚠</span>
              <p className="text-sm font-medium text-red-700">
                {error || localError}
              </p>
            </div>

            <button
              onClick={() => {
                clearError();
                setLocalError(null);
              }}
              className="font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        <div className="task-form-container mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                {isEditing ? '✎' : '+'}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isEditing ? 'Edit Task' : 'Create New Task'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {isEditing
                    ? 'Update your task information.'
                    : 'Add a new task to your list.'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Task Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="What do you need to do?"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add some details..."
                  rows="4"
                  disabled={loading}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? 'Processing...'
                  : isEditing
                    ? 'Update Task'
                    : 'Create Task'}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="rounded-xl bg-slate-100 px-7 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Your Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep track of everything you need to accomplish.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="whitespace-nowrap text-sm font-medium text-slate-500">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>

            <button
              type="button"
              onClick={handleLoadTasks}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all duration-200 hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h5M20 20v-5h-5M5.5 9A7 7 0 0117.5 6.5L20 9M18.5 15A7 7 0 016.5 17.5L4 15"
                />
              </svg>

              {loading ? 'Loading...' : 'Load Tasks'}
            </button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
              ✓
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No tasks yet
            </h3>

            <p className="mt-2 text-slate-500">
              Create your first task using the form above.
            </p>

            <button
              onClick={handleLoadTasks}
              disabled={loading}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              <svg
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h5M20 20v-5h-5M5.5 9A7 7 0 0117.5 6.5L20 9M18.5 15A7 7 0 016.5 17.5L4 15"
                />
              </svg>

              {loading ? 'Loading...' : 'Load Tasks Again'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task, index) => {
              const statusStyle = getStatusStyle(task.status);

              return (
                <div
                  key={task._id || task.id || `task-${index}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-slate-900">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        #{task._id?.slice(-6) || 'TASK'}
                      </p>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                      />
                      {task.status || 'pending'}
                    </span>
                  </div>

                  <p className="mt-4 min-h-[42px] line-clamp-2 text-sm text-slate-500">
                    {task.description || 'No description provided.'}
                  </p>

                  <div className="my-5 border-t border-slate-100" />

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleViewTask(task._id)}
                      disabled={loading}
                      className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleEdit(task)}
                      disabled={loading}
                      className="rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(task._id, task.title)
                      }
                      disabled={loading}
                      className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {task && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={clearTask}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-100">
                    Task Details
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {task.title}
                  </h2>
                </div>

                <button
                  onClick={clearTask}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-xl transition hover:bg-white/20"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </p>

                <p className="mt-2 leading-relaxed text-slate-700">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </p>

                <span
                  className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    getStatusStyle(task.status).badge
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      getStatusStyle(task.status).dot
                    }`}
                  />
                  {task.status || 'pending'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Created</p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Updated</p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {task.updatedAt
                      ? new Date(task.updatedAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <button
                onClick={clearTask}
                className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
