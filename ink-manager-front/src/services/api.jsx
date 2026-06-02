import axios from 'axios';

const api = axios.create({
  // Alinhe com seu dupla a porta que o C# vai rodar (ex: 5000, 7000, 5123)
  baseURL: 'http://localhost:5000/api', 
});

export default api;