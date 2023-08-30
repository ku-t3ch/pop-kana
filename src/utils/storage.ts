export const setFacultyId = (facultyId: string) => {
  localStorage.setItem("faculty-id", facultyId);
};

export const getFacultyId = () => {
  return localStorage.getItem("faculty-id");
};

export const resetFacultyId = () => {
  localStorage.removeItem("faculty-id");
};
