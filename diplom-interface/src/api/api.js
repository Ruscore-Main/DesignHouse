import axios from 'axios';

const BASE_URL = "https://localhost:44336/api/project";

const houseProjectInstance = axios.create({
    baseURL: BASE_URL
});


// https://localhost:44336/api/project?page=1&limit=5&sort=name&category=%D0%9E%D0%B4%D0%BD%D0%BE%D1%8D%D1%82%D0%B0%D0%B6%D0%BD%D1%8B%D0%B5&searchValue=%D0%B4
export const houseProjectsAPI = {
    getProjects(page, sortType, category, searchValue) {
        let fetchURL = `?page=${page}&limit=5&sort=${sortType.sort}`
      
        if (category !== null) {
          fetchURL += `&category=${category}`;
        }
        if (searchValue !== '') {
          fetchURL += `&searchValue=${searchValue}`;
        }
  
        return houseProjectInstance.get(fetchURL).then(({data}) => data)
    },

    getFullProject(id) {
        return houseProjectInstance.get(`/${id}`).then(({data}) => data)
    }
}