function StudentTable({ datas, handleDeleteStudent, handleEditStudent }) {

  const getGenderLabel = (gender) => {
    if (!gender) return '—';
    const g = gender.toLowerCase();
    if (g === 'male')   return <span className="status-M">Male</span>;
    if (g === 'female') return <span className="status-F">Female</span>;
    return gender;
  };

  const getCgpaStyle = (cgpa) => {
    if (cgpa >= 9.0) return { color: '#7950f2', fontWeight: 700 };
    if (cgpa >= 7.0) return { color: '#3b82f6', fontWeight: 600 };
    if (cgpa >= 5.0) return { color: '#f59e0b' };
    return { color: '#ef4444' };
  };

  return (
    <div className="table-section">
      <div className="table-scroll">
        <table className="students-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>USN</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>CGPA</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {datas.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <div className="empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                      stroke="#d0d5e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ margin: '0 auto 0.5rem', display: 'block' }}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <strong>No students found</strong>
                    <p>Add a new student or adjust the search filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              datas.map((data, idx) => (
                <tr key={data.usn}>
                  <td className="col-num">{idx + 1}</td>
                  <td><strong style={{ color: 'var(--text-dark)' }}>{data.usn}</strong></td>
                  <td>{data.name}</td>
                  <td>{data.department}</td>
                  <td>{getGenderLabel(data.gender)}</td>
                  <td style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>{data.email}</td>
                  <td>{data.phoneNumber}</td>
                  <td>
                    <span style={getCgpaStyle(data.cgpa)}>
                      {data.cgpa !== undefined && data.cgpa !== null
                        ? Number(data.cgpa).toFixed(2)
                        : '—'}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn-row-edit"
                        onClick={() => handleEditStudent(data)}
                        title="Edit student"
                      >Edit</button>
                      <button
                        className="btn-row-delete"
                        onClick={() => handleDeleteStudent(data.usn)}
                        title="Delete student"
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;