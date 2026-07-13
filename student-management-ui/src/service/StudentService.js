import axios from 'axios';
const BASE_URL="http://localhost:8080/students";

const getAllStudents=()=>{
    return axios.get(BASE_URL);
}

const searchStudents = (name, department) => {
    const params = {};
    if (name) params.name = name;
    if (department) params.department = department;
    return axios.get(BASE_URL, { params });
};

const addStudent=(student)=>{
    return axios.post(BASE_URL,student);
}

const updateStudent=(student)=>{
    return axios.put(BASE_URL,student);
}

const deleteStudent=(id)=>{
    return axios.delete(`${BASE_URL}/${id}`);
}
const getStudentById = (id) => {
    return axios.get(`${BASE_URL}/${id}`);
};

export {
    getAllStudents,
    searchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById
};