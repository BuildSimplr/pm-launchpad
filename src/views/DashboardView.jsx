import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  Target,
  ListTodo,
  FileText,
  Activity,
  Sparkles,
  Calendar,
  Trash2
} from 'lucide-react';

const DashboardView = () => {
  const [okrs, setOkrs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const okrData = JSON.parse(localStorage.getItem('pmLite_okrs')) || [];
      const taskData = JSON.parse(localStorage.getItem('pmLite_backlog_tasks')) || [];
      const noteData = JSON.parse(localStorage.getItem('pmLiteNotes')) || [];
      const activity = JSON.parse(localStorage.getItem('pmLite_activity_log')) || [];
      const email = localStorage.getItem('userEmail') || 'Product Manager';

      setOkrs(okrData);
      setTasks(taskData);
      setNotes(noteData);
      setRecentActivity(activity.slice(0, 5));
      setUserEmail(email);
    } catch (error) {
      console.warn('Failed to load dashboard data:', error);
    }
  }, []);

  // Calculate metrics
  const metrics = useMemo(() => {
    const completedTasks = tasks.filter(t => t.status === 'done' || t.status === 'Done').length;
    const totalTasks = tasks.length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const inProgressTasks = tasks.filter(t => t.status === 'in-progress' || t.status === 'In Progress').length;
    const todoTasks = tasks.filter(t => t.status === 'todo' || t.status === 'To Do' || !t.status).length;

    return {
      completedTasks,
      totalTasks,
      taskCompletionRate,
      inProgressTasks,
      todoTasks,
      okrCount: okrs.length,
      noteCount: notes.length
    };
  }, [tasks, okrs, notes]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserName = () => {
    if (!userEmail) return 'there';
    const name = userEmail.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleClearActivity = () => {
    if (window.confirm('Clear all activity logs?')) {
      localStorage.removeItem('pmLite_activity_log');
      setRecentActivity([]);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const statCards = [
    {
      label: 'Objectives',
      value: metrics.okrCount,
      icon: Target,
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      link: '/app/okr',
      subtitle: 'OKRs tracked'
    },
    {
      label: 'Tasks',
      value: metrics.totalTasks,
      icon: ListTodo,
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      link: '/app/backlog',
      subtitle: `${metrics.completedTasks} completed`
    },
    {
      label: 'Notes',
      value: metrics.noteCount,
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50',
      link: '/app/notes',
      subtitle: 'Meeting notes'
    }
  ];

  const quickActions = [
    { label: 'New OKR', icon: Target, path: '/app/okr', color: 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200' },
    { label: 'Add Task', icon: ListTodo, path: '/app/backlog', color: 'text-blue-600 bg-blue-100 hover:bg-blue-200' },
    { label: 'New Note', icon: FileText, path: '/app/notes', color: 'text-amber-600 bg-amber-100 hover:bg-amber-200' }
  ];

  return (
    <motion.div
      className="p-6 space-y-8 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {getGreeting()}, {getUserName()}! <span className="inline-block animate-pulse">👋</span>
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            <Sparkles size={14} />
            PM Lite Pro
          </span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((stat, idx) => (
          <Link key={idx} to={stat.link}>
            <motion.div
              className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
              <ArrowRight size={18} className="absolute bottom-4 right-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Progress & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Progress */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Task Progress
            </h2>
            <span className="text-2xl font-bold text-blue-600">{metrics.taskCompletionRate}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${metrics.taskCompletionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          {/* Task Breakdown */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-400">{metrics.todoTasks}</p>
              <p className="text-xs text-gray-500 mt-1">To Do</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">{metrics.inProgressTasks}</p>
              <p className="text-xs text-gray-500 mt-1">In Progress</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">{metrics.completedTasks}</p>
              <p className="text-xs text-gray-500 mt-1">Completed</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Plus size={20} className="text-purple-500" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                onClick={() => navigate(action.path)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl font-medium transition-all ${action.color}`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <action.icon size={20} />
                {action.label}
                <ArrowRight size={16} className="ml-auto opacity-50" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Activity size={20} className="text-purple-500" />
            Recent Activity
          </h2>
          {recentActivity.length > 0 && (
            <button
              onClick={handleClearActivity}
              className="text-sm text-gray-400 hover:text-red-500 transition flex items-center gap-1"
            >
              <Trash2 size={14} />
              Clear
            </button>
          )}
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <Clock size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No recent activity yet</p>
            <p className="text-gray-400 text-xs mt-1">Start by creating an OKR or adding a task</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity size={14} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{item.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.p variants={itemVariants} className="text-center text-gray-400 text-sm">
        Dashboard syncs with your OKRs, backlog, and notes in real-time
      </motion.p>
    </motion.div>
  );
};

export default DashboardView;
