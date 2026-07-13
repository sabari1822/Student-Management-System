import { useState, useEffect } from "react";

const DEPARTMENTS = [
  "Computer Science",
  "Information Science",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering"
];

const initialStudentState = {
  usn: "",
  name: "",
  department: "",
  gender: "",
  email: "",
  phoneNumber: "",
  cgpa: ""
};

function StudentForm({ onAddStudent, editingStudent, onCancelEdit }) {
  const [student, setStudent]           = useState(initialStudentState);
  const [errors, setErrors]             = useState({});
  const [generalError, setGeneralError] = useState("");
  const [submitting, setSubmitting]     = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setStudent({
        usn:         editingStudent.usn ?? "",
        name:        editingStudent.name ?? "",
        department:  editingStudent.department ?? "",
        gender:      editingStudent.gender ?? "",
        email:       editingStudent.email ?? "",
        phoneNumber: editingStudent.phoneNumber ?? "",
        cgpa:        editingStudent.cgpa !== undefined ? editingStudent.cgpa : ""
      });
    } else {
      setStudent(initialStudentState);
    }
    setErrors({});
    setGeneralError("");
  }, [editingStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsed = value;
    if (name === "usn")  parsed = value === "" ? "" : (parseInt(value, 10) || "");
    if (name === "cgpa") parsed = value === "" ? "" : value;
    setStudent(prev => ({ ...prev, [name]: parsed }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!student.usn)                                        e.usn         = "USN is required (positive integer).";
    if (!student.name || student.name.trim().length < 2)    e.name        = "Name must be at least 2 characters.";
    if (!student.department)                                 e.department  = "Department is required.";
    if (!student.gender)                                     e.gender      = "Gender is required.";
    if (!student.email)                                      e.email       = "Email is required.";
    if (!/^[0-9]{10}$/.test(student.phoneNumber))           e.phoneNumber = "Phone must be exactly 10 digits.";
    const cgpaNum = parseFloat(student.cgpa);
    if (student.cgpa === "" || isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10)
                                                             e.cgpa        = "CGPA must be between 0.00 and 10.00.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) { setErrors(clientErrors); return; }

    setSubmitting(true);
    const payload = { ...student, cgpa: parseFloat(student.cgpa) };
    const result  = await onAddStudent(payload);
    setSubmitting(false);

    if (result && !result.success) {
      if (result.errors && Object.keys(result.errors).length > 0) setErrors(result.errors);
      else setGeneralError(result.message);
    }
  };

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onCancelEdit();
  };

  return (
    <div className="modal-overlay" onClick={handleBackdrop}>
      <div className="modal-card" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {editingStudent ? "Edit Student Details" : "Register New Student"}
          </h2>
          <button className="modal-close" onClick={onCancelEdit} title="Close">&times;</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {generalError && (
            <div className="alert-banner error" style={{ marginBottom: '1rem' }}>
              <span>{generalError}</span>
              <button className="alert-close" onClick={() => setGeneralError("")}>&times;</button>
            </div>
          )}

          <form id="student-form" onSubmit={handleSubmit} noValidate>

            {/* Row 1: USN + Name */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">USN (Seat Number)</label>
                <input
                  type="number"
                  name="usn"
                  className="form-control"
                  placeholder="e.g. 101"
                  value={student.usn}
                  onChange={handleChange}
                  disabled={!!editingStudent}
                  min="1"
                />
                {errors.usn && <span className="error-text">{errors.usn}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Sabari"
                  value={student.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
            </div>

            {/* Row 2: Department + Gender */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select name="department" className="form-control" value={student.department} onChange={handleChange}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <span className="error-text">{errors.department}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-control" value={student.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="error-text">{errors.gender}</span>}
              </div>
            </div>

            {/* Row 3: Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="e.g. sabari@domain.com"
                value={student.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Row 4: Phone + CGPA */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="10-digit number"
                  maxLength="10"
                  value={student.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">CGPA (0.00 – 10.00)</label>
                <input
                  type="number"
                  name="cgpa"
                  className="form-control"
                  placeholder="e.g. 8.75"
                  min="0"
                  max="10"
                  step="0.01"
                  value={student.cgpa}
                  onChange={handleChange}
                />
                {errors.cgpa && <span className="error-text">{errors.cgpa}</span>}
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-cancel-modal" onClick={onCancelEdit}>Cancel</button>
          <button
            type="submit"
            form="student-form"
            className="btn-primary-modal"
            disabled={submitting}
          >
            {submitting ? "Saving…" : (editingStudent ? "Save Changes" : "Register Student")}
          </button>
        </div>

      </div>
    </div>
  );
}

export default StudentForm;