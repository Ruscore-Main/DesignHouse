import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../api/api';

// Регистрация пользователя
export const regUser = createAsyncThunk('user/regUser', async (params) => {
  const { login, password, email, phoneNumber } = params;
  try {
    const user = (await userAPI.registerUser(login, password, email, phoneNumber)).data;
    return user;
  } catch (error) {
    return error.response.data;
  }
});

// Авторизация пользователя
export const authUser = createAsyncThunk('user/authUser', async (params) => {
  const { login, password } = params;
  try {
    const user = (await userAPI.authorizateUser(login, password)).data;
    return user;
  } catch (error) {
    return error.response.data;
  }
});

// Обновление информации о пользователе
export const updateUser = createAsyncThunk('user/updateUser', async (params) => {
  try {
    const user = (await userAPI.updateUser(params)).data;
    return user;
  } catch (error) {
    return error.response.data;
  }
})

// Добавление проекта в избранное
export const addFavorite = createAsyncThunk('user/addFavorite', async (params) => {
  try {
    const houseProject = (await userAPI.addFavorite(params));
    return houseProject;
  } catch (error) {
    return error.response.data;
  }
});

// Удаление проекта из избранного
export const removeFavorite = createAsyncThunk('user/removeFavorite', async (params) => {
  try {
    const houseProject = (await userAPI.removeFavorite(params));
    return houseProject;
  } catch (error) {
    return error.response.data;
  }
});

// Добавление запроса на строительство
export const addRequest = createAsyncThunk('user/addRequest', async (params) => {
  try {
    const request = (await userAPI.addRequest(params));
    return request;
  } catch (error) {
    return error.response.data;
  }
});


const initialState = {
  id: null,
  login: null,
  password: null,
  role: null,
  email: null,
  phoneNumber: null,
  requests: [],
  favorites: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.login = action.payload.login;
      state.password = action.payload.password;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.requests = action.payload.requests;
      state.favorites = action.payload.favorites;
    },
    removeUser(state) {
      state.id = null;
      state.login = null;
      state.password = null;
      state.role = null;
      state.email = null;
      state.phoneNumber = null;
      state.requests = [];
      state.favorites = [];
    }
  },
  extraReducers: {
    [regUser.fulfilled]: (state, action) => {
      if (action.payload?.login) {
        userSlice.caseReducers.setUser(state, action)
      }
    },
    [authUser.fulfilled]: (state, action) => {
      if (action.payload?.login) {
        userSlice.caseReducers.setUser(state, action)
      }
    },
    [updateUser.fulfilled]: (state, action) => {
      debugger;
      if (action.payload?.id) {
        state.login = action.payload.login;
        state.email = action.payload.email;
        state.phoneNumber = action.payload.phoneNumber;
      }
    },
    [addFavorite.fulfilled]: (state, action) => {
        if (action.payload?.id) {
        state.favorites = [...state.favorites, action.payload];
      }
    },
    [removeFavorite.fulfilled]: (state, action) => {
      if (action.payload?.id) {
        debugger;
        state.favorites = state.favorites.filter(el => el.id !== action.payload.id);
      }
    },
    [addRequest.fulfilled]: (state, action) => {
      if (action.payload?.id) {
        state.requests = [...state.requests, action.payload];
      }
    }
  },
});

export const {setUser, removeUser} = userSlice.actions;

export default userSlice.reducer;
