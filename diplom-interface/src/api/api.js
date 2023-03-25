import axios from 'axios';

const BASE_URL = "https://localhost:44336/api/";

const houseProjectInstance = axios.create({
    baseURL: BASE_URL + 'project/'
});

const userInstance = axios.create({
  baseURL: BASE_URL + 'user/'
})


// https://localhost:44336/api/project?page=1&limit=5&sort=name&category=%D0%9E%D0%B4%D0%BD%D0%BE%D1%8D%D1%82%D0%B0%D0%B6%D0%BD%D1%8B%D0%B5&searchValue=%D0%B4
export const houseProjectsAPI = {
    getProjects(page, sortType, category, searchValue) {
        let fetchURL = `?page=${page}&limit=5&sort=${sortType.sort}`;
      
        if (category !== null) {
          fetchURL += `&category=${category}`;
        }
        if (searchValue !== '') {
          fetchURL += `&searchValue=${searchValue}`;
        }
  
        return houseProjectInstance.get(fetchURL).then(({data}) => data);
    },

    getFullProject(id) {
        return houseProjectInstance.get(`/${id}`).then(({data}) => data);
    }
}

export const userAPI = {
  registerUser (login, password, email, phoneNumber) {
    return userInstance.post('registration', {login, password, email, phoneNumber});
  },
  authorizateUser(login, password) {
    return userInstance.post('authorization', {login, password});
  },
  updateUser(user) {
    return userInstance.post('update', user);
  },
  addFavorite (houseProject) {
    return userInstance.post('addFavorite', houseProject).then(({data}) => data);
  },
  removeFavorite(houseProject) {
    return userInstance.post('removeFavorite', houseProject).then(({data}) => data);
  }
}