import axios from "axios";

const getAll = () => {
  const request = axios.get("http://localhost:3001/api/all-persons");
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post("http://localhost:3001/api/persons", newObject);
  return request.then((response) => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(
    `http://localhost:3001/api/persons/${id}`,
    newObject
  );
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`http://localhost:3001/api/persons/${id}`);
  return request;
};

export default { getAll, create, update, deletePerson };
