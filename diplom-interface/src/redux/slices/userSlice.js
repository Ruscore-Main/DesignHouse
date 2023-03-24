import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../api/api';

export const regUser = createAsyncThunk('user/regUser', async (params) => {
  const { login, password, email, phoneNumber } = params;
  try {
    const user = (await userAPI.registerUser(login, password, email, phoneNumber)).data;
    return user;
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
  reducers: {},
  extraReducers: {
    [regUser.fulfilled]: (state, action) => {
        state.id = action.payload.id;
        state.login = action.payload.login;
        state.password = action.payload.password;
        state.role = action.payload.role;
        state.email = action.payload.email;
        state.phoneNumber = action.payload.phoneNumber;
        state.requests = action.payload.requests;
        state.favorites = action.payload.favorites;
      },
  },
});

export default userSlice.reducer;
