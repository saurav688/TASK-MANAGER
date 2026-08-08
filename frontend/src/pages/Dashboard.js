import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import useTasks from '../hooks/useTasks';
import useToast from '../hooks/useToast';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import Toast from '../components/Toast';
import './Dashboard.css';

/* ── Stat icons ─────────────────────────────────────────── */
const IconTotal = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const IconDone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const isToday = (d) => {
  const t = new Date(d), n = new Date();
  return t.getDate() === n.getDate() && t.getMonth() === n.getMonth() && t.getFullYear() === n.getFullYear();
};

/* ── View config ──────────────────────────────────────────── */
const VIEW_META = {
  dashboard: { title: 'Dashboard', sub: 'Overview of all your tasks' },
  tasks:     { title: 'My Tasks',  sub: 'Stay organised and keep your work moving forward' },
  completed: { title: 'Completed', sub: 'Tasks you have finished' },
  pending:   { title: 'Pending',   sub: 'Tasks waiting to be done' },
};

const PRIORITY_TABS = [
  { key: '', label: 'All' },
  { key: 'high', label: '🔴 High' },
  { key: 'medium', label: '🟡 Medium' },
  { key: 'low', label: '🟢 Low' },
];

/* ── Dashboard ────────────────────────────────────────────── */
const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const { tasks, loading, createTask, updateTask, deleteTask, toggleStatus } = useTasks(addToast);

  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ── Derived counts ─────────────────────────────────────── */
  const counts = useMemo(() => ({
    dashboard: null,
    tasks:     tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending:   tasks.filter(t => t.status !== 'completed').length,
  }), [tasks]);

  const stats = useMemo(() => ({
    total:     tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending:   tasks.filter(t => t.status !== 'completed').length,
    dueToday:  tasks.filter(t => t.dueDate && isToday(t.dueDate) && t.status !== 'completed').length,
  }), [tasks]);

  /* ── Filtered tasks ─────────────────────────────────────── */
  const visibleTasks = useMemo(() => {
    let list = [...tasks];

    // view filter
    if (activeView === 'completed') list = list.filter(t => t.status === 'completed');
    else if (activeView === 'pending') list = list.filter(t => t.status !== 'completed');

    // priority tab
    if (filterPriority) list = list.filter(t => t.priority === filterPriority);

    // search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // sort client-side
    list.sort((a, b) => {
      if (sortBy === '-createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'createdAt')  return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === '-dueDate')   return new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
      if (sortBy === 'dueDate')    return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      if (sortBy === 'priority') {
        const o = { high: 0, medium: 1, low: 2 };
        return (o[a.priority] ?? 1) - (o[b.priority] ?? 1);
      }
      return 0;
    });

    return list;
  }, [tasks, activeView, filterPriority, searchQuery, sortBy]);

  const recentTasks = useMemo(() =>
    [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6),
    [tasks]
  );

  /* ── Handlers ────────────────────────────────────────────── */
  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit   = (task) => { setEditingTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); };

  const handleSave = async (data) => {
    if (editingTask) await updateTask(editingTask._id, data);
    else await createTask(data);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await deleteTask(deleteId); }
    catch (err) { addToast(err.message, 'error'); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const handleToggle = async (task) => {
    try { await toggleStatus(task); }
    catch (err) { addToast(err.message, 'error'); }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    setSearchQuery('');
    setFilterPriority('');
  };

  const currentMeta = VIEW_META[activeView];
  const showTaskList = activeView !== 'dashboard';

  /* ── Empty state config ──────────────────────────────────── */
  const emptyConfig = () => {
    if (searchQuery) return { icon: '🔍', title: 'No results found', subtitle: `No tasks match "${searchQuery}". Try a different search.` };
    if (activeView === 'completed') return { icon: '✅', title: 'No completed tasks yet', subtitle: 'Complete some tasks and they will appear here.' };
    if (activeView === 'pending')   return { icon: '⏳', title: 'No pending tasks', subtitle: "You're all caught up! Great work." };
    return { icon: '📋', title: 'No tasks yet', subtitle: 'Create your first task and start getting things done.', actionLabel: '+ Create Task', onAction: openCreate };
  };

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="dashboard-layout">
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        user={user}
        onLogout={logout}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        taskCounts={counts}
      />

      <div className="dashboard-main">
        <Navbar
          title={currentMeta.title}
          onSearch={setSearchQuery}
          user={user}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <main className="dashboard-content" id="main-content">

          {/* ── Dashboard overview ─────────────────────────── */}
          {activeView === 'dashboard' && (
            <div className="dashboard-overview">
              <div className="page-header">
                <h1 className="page-header-title">Good day, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="page-header-sub">Here's what's happening with your tasks today.</p>
              </div>

              <div className="stats-grid">
                <StatCard title="Total Tasks"   value={stats.total}     icon={<IconTotal />}    color="indigo"  delay={0}   subtitle="All tasks" />
                <StatCard title="Completed"     value={stats.completed} icon={<IconDone />}     color="emerald" delay={60}  subtitle="Tasks done" />
                <StatCard title="Pending"       value={stats.pending}   icon={<IconClock />}    color="amber"   delay={120} subtitle="In progress or pending" />
                <StatCard title="Due Today"     value={stats.dueToday}  icon={<IconCalendar />} color="red"     delay={180} subtitle="Need attention" />
              </div>

              <div className="section-header">
                <h2 className="section-title">Recent Tasks</h2>
                <button className="section-link" onClick={() => setActiveView('tasks')}>View all →</button>
              </div>

              {loading ? (
                <div className="tasks-grid">{Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>
              ) : recentTasks.length === 0 ? (
                <EmptyState icon="📋" title="No tasks yet" subtitle="Create your first task and start getting things done."
                  actionLabel="+ Create Task" onAction={openCreate} />
              ) : (
                <div className="tasks-grid">
                  {recentTasks.map((t, i) => (
                    <TaskCard key={t._id} task={t} delay={i * 40}
                      onEdit={openEdit} onDelete={setDeleteId} onToggle={handleToggle} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Task list views ─────────────────────────────── */}
          {showTaskList && (
            <div>
              <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h1 className="page-header-title">{currentMeta.title}</h1>
                  <p className="page-header-sub">{currentMeta.sub}</p>
                </div>
                <button className="btn-add-task" onClick={openCreate}>
                  <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span> Add Task
                </button>
              </div>

              {/* Toolbar */}
              <div className="tasks-toolbar">
                <div className="toolbar-left">
                  {/* Priority tabs */}
                  <div className="tab-filters" role="group" aria-label="Filter by priority">
                    {PRIORITY_TABS.map(tab => (
                      <button key={tab.key} className={`tab-btn${filterPriority === tab.key ? ' active' : ''}`}
                        onClick={() => setFilterPriority(tab.key)}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="toolbar-right">
                  <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)} aria-label="Sort tasks">
                    <option value="-createdAt">Newest first</option>
                    <option value="createdAt">Oldest first</option>
                    <option value="priority">Priority</option>
                    <option value="dueDate">Due date ↑</option>
                    <option value="-dueDate">Due date ↓</option>
                  </select>
                </div>
              </div>

              {/* Task count */}
              {!loading && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16, fontWeight: 500 }}>
                  {visibleTasks.length} task{visibleTasks.length !== 1 ? 's' : ''}{searchQuery ? ` matching "${searchQuery}"` : ''}
                </p>
              )}

              {/* List */}
              {loading ? (
                <div className="tasks-grid">{Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>
              ) : visibleTasks.length === 0 ? (
                <EmptyState {...emptyConfig()} />
              ) : (
                <div className="tasks-grid">
                  {visibleTasks.map((t, i) => (
                    <TaskCard key={t._id} task={t} delay={i * 30}
                      onEdit={openEdit} onDelete={setDeleteId} onToggle={handleToggle} />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {modalOpen && (
        <TaskModal task={editingTask} onClose={closeModal} onSave={handleSave} />
      )}
      {deleteId && (
        <ConfirmModal
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}

      {/* Floating add button on dashboard view */}
      {activeView === 'dashboard' && (
        <button
          onClick={openCreate}
          aria-label="Add new task"
          style={{
            position: 'fixed', bottom: 28, right: 28,
            width: 52, height: 52, borderRadius: '50%',
            background: 'var(--primary)', color: '#fff',
            border: 'none', fontSize: '1.5rem', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(99,102,241,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.15s, background 0.15s',
            zIndex: 50,
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >+</button>
      )}

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Dashboard;
