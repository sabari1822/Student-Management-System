import { useState, useEffect } from 'react';
import {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  searchStudents
} from "./service/StudentService";
import StudentTable from "./components/StudentTable";
import StudentForm from "./components/StudentForm";

const DEPARTMENTS = [
  "Computer Science",
  "Information Science",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering"
];

function App() {
  const [students, setStudents]             = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm]             = useState(false);
  const [notification, setNotification]     = useState(null);

  // Search state (sidebar) — backed by real API params
  const [searchName, setSearchName] = useState('');
  const [searchDept, setSearchDept] = useState('');

  /* ── Data fetching ─────────────────────────── */
  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data);
    } catch {
      showAlert('error', 'Cannot connect to backend. Ensure Spring Boot & MySQL are running.');
    }
  };

  /* ── Notifications ─────────────────────────── */
  const showAlert = (type, message) => {
    setNotification({ type, message });
    if (type === 'success') setTimeout(() => setNotification(null), 4500);
  };

  /* ── Search ────────────────────────────────── */
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await searchStudents(searchName, searchDept);
      setStudents(res.data);
    } catch {
      showAlert('error', 'Search failed.');
    }
  };

  const handleReset = () => {
    setSearchName('');
    setSearchDept('');
    fetchStudents();
  };

  /* ── CRUD ──────────────────────────────────── */
  const handleDeleteStudent = async (id) => {
    if (!window.confirm(`Delete student with USN ${id}?`)) return;
    try {
      await deleteStudent(id);
      showAlert('success', `Student USN ${id} deleted.`);
      fetchStudents();
      if (editingStudent?.usn === id) { setEditingStudent(null); setShowForm(false); }
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleEditStudent = (data) => {
    setEditingStudent(data);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setShowForm(false);
  };

  const handleAddStudent = async (student) => {
    try {
      if (editingStudent) {
        await updateStudent(student);
        showAlert('success', `"${student.name}" updated.`);
      } else {
        await addStudent(student);
        showAlert('success', `"${student.name}" registered.`);
      }
      setSearchName('');
      setSearchDept('');
      const res = await getAllStudents();
      setStudents(res.data);
      setEditingStudent(null);
      setShowForm(false);
      return { success: true };
    } catch (err) {
      const status = err.response?.status;
      let message = 'An error occurred.';
      let errors  = {};
      if (status === 400) {
        errors  = err.response?.data?.errors || {};
        message = err.response?.data?.message || 'Validation failed.';
      } else if (status === 409) {
        message = 'A student with this USN already exists.';
        errors  = { usn: 'USN already registered.' };
      } else {
        message = err.response?.data?.message || err.message || message;
      }
      return { success: false, message, errors };
    }
  };

  return (
    <div className="app-shell">

      {/* ── TOP HEADER ── */}
      <header className="top-header">
        <div className="top-header-logo">StudentDB</div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'normal' }}>
          Academic Record &amp; Administration System
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="app-body">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="sidebar">

          {/* Quick Search — name + department only, both backed by backend API */}
          <div className="sidebar-section-title">Quick search</div>
          <form className="quick-search-area" onSubmit={handleSearch}>
            <input
              className="quick-search-input"
              placeholder="Full Name"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
            />
            <select
              className="quick-search-input"
              value={searchDept}
              onChange={e => setSearchDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="quick-search-buttons">
              <button type="submit" className="btn-search">Search</button>
              <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
            </div>
          </form>

          <div className="nav-divider" />

          {/* Only the one real section */}
          <div className="sidebar-section-title">Management</div>
          <ul className="nav-list">
            <li className="nav-item active">Students management</li>
          </ul>
        </aside>

        {/* ── MAIN AREA ── */}
        <main className="main-area">

          {/* Toolbar */}
          <div className="breadcrumb-bar">
            <div className="breadcrumb">
              <span className="breadcrumb-icon">🏠</span>
              <span className="breadcrumb-text">HOME</span>
              <span style={{ color: 'var(--text-light)', margin: '0 0.25rem' }}>/</span>
              <span style={{ color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 500 }}>Students</span>
            </div>
            <div className="breadcrumb-bar-actions">
              <button
                className="btn-add-student"
                onClick={() => { setEditingStudent(null); setShowForm(true); }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Student
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="content-body">

            {/* Alert */}
            {notification && (
              <div className={`alert-banner ${notification.type}`}>
                <span>{notification.message}</span>
                <button className="alert-close" onClick={() => setNotification(null)}>×</button>
              </div>
            )}

            {/* Student table — the only real content */}
            <StudentTable
              datas={students}
              handleDeleteStudent={handleDeleteStudent}
              handleEditStudent={handleEditStudent}
            />
          </div>
        </main>
      </div>

      {/* ── STUDENT FORM MODAL ── */}
      {showForm && (
        <StudentForm
          editingStudent={editingStudent}
          onAddStudent={handleAddStudent}
          onCancelEdit={handleCancelEdit}
        />
      )}
    </div>
  );
}

export default App;
