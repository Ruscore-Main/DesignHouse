import { User, Request } from './../redux/slices/userSlice';
import { HouseProject } from './../redux/slices/houseProjectSlice';
import { SortItem } from './../components/SortPopup';
import axios from "axios";

const BASE_URL = "https://localhost:44336/api/";

const houseProjectInstance = axios.create({
  baseURL: BASE_URL + "project",
});

const userInstance = axios.create({
  baseURL: BASE_URL + "user/",
});

const adminInstance = axios.create({
  baseURL: BASE_URL + "admin/",
});

// https://localhost:44336/api/project?page=1&limit=5&sort=name&category=%D0%9E%D0%B4%D0%BD%D0%BE%D1%8D%D1%82%D0%B0%D0%B6%D0%BD%D1%8B%D0%B5&searchValue=%D0%B4
export const houseProjectsAPI = {
  getProjects(page: number, sortType: SortItem, category: string | null, searchValue: string, isPublished: string | null, limit = 6) {
    let fetchURL = `?page=${page}&limit=${limit}&sort=${sortType.sort}`;

    if (category !== null) {
      fetchURL += `&category=${category}`;
    }
    if (isPublished !== null) {
      fetchURL += `&isPublished=${isPublished}`;
    }
    if (searchValue !== "") {
      fetchURL += `&searchValue=${searchValue}`;
    }

    return houseProjectInstance.get(fetchURL).then(({ data }) => data);
  },

  getFullProject(id: number) {
    return houseProjectInstance.get(`/${id}`).then(({ data }) => data);
  },

  addProject(houseProject: FormData) {
    return houseProjectInstance.post('', houseProject).then(({ data }) => data);
  },

  updateProject(houseProject: FormData) {
    return houseProjectInstance.put('', houseProject).then(({ data }) => data);
  },

  deleteProject(houseProject: HouseProject) {
    return houseProjectInstance
      .delete(`${houseProject.id}`)
      .then(({ data }) => data);
  },
};

export const userAPI = {
  registerUser(login: string, password: string, email: string, phoneNumber: string, role: string) {
    return userInstance.post("registration", {
      login,
      password,
      email,
      phoneNumber,
      role
    });
  },
  authorizateUser(login: string, password: string) {
    return userInstance.post("authorization", { login, password });
  },
  updateUser(user: User) {
    return userInstance.post("update", user);
  },
  addFavorite(houseProject: {id: number, userId: number}) {
    return userInstance
      .post("addFavorite", houseProject)
      .then(({ data }) => data);
  },
  removeFavorite(houseProject: {id: number, userId: number}) {
    return userInstance
      .post("removeFavorite", houseProject)
      .then(({ data }) => data);
  },
  addRequest(request: Request) {
    return userInstance.post("request", request).then(({ data }) => data);
  },
};

export const adminAPI = {
  getRequests({ page, category, searchValue, limit }: Record<string, string>) {
    let fetchURL = `request?page=${page}&limit=${limit}`;

    if (category !== null) {
      fetchURL += `&category=${category}`;
    }
    if (searchValue !== "") {
      fetchURL += `&searchValue=${searchValue}`;
    }
    return adminInstance.get(fetchURL).then(({ data }) => data);
  },

  deleteRequest(request: Request) {
    return adminInstance.delete(`request?id=${request.id}`).then(({ data }) => data);
  },

  getUsers({page, role, searchValue, limit}: Record<string, string>) {
    let fetchURL = `users?page=${page}&limit=${limit}`;

    if (role !== null) {
      fetchURL += `&role=${role}`;
    }
    if (searchValue !== "") {
      fetchURL += `&searchValue=${searchValue}`;
    }
    return adminInstance.get(fetchURL).then(({ data }) => data);
  },
  deleteUser(user: User) {
    return adminInstance.delete(`users?id=${user.id}`).then(({ data }) => data);
  }
};
