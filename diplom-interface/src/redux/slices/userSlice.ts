import { PayloadAction } from '@reduxjs/toolkit';
import { HouseProject } from './houseProjectSlice';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../api/api';
import { getUserFromLS } from 'utils/getUserFromLS';

export type Request = HouseProject & {
  houseProjectId: number,
  userId: number,
  userPhone: string,
  contentText: string,
  dateCreating?: Date,
  userLogin?: string,
}

export type User = {
  id: number | null,
  login: string | null,
  password: string | null,
  role: string | null,
  email: string | null,
  phoneNumber: string | null,
  requests: Request[],
  favorites: HouseProject[]
}

// Регистрация пользователя
type RegUserArgs = {
  login: string,
  password: string,
  email: string,
  phoneNumber: string,
  role: string
}
export const regUser = createAsyncThunk('user/regUser', async (params: RegUserArgs) => {
  const { login, password, email, phoneNumber, role } = params;
  try {
    const user = (await userAPI.registerUser(login, password, email, phoneNumber, role)).data;
    return user;
  } catch (error: any) {
    return error.response.data;
  }
});

// Авторизация пользователя
type AuthUserArgs = {
  login: string,
  password: string
}
export const authUser = createAsyncThunk('user/authUser', async (params: AuthUserArgs) => {
  const { login, password } = params;
  try {
    const user = (await userAPI.authorizateUser(login, password)).data;
    return user;
  } catch (error: any) {
    return error.response.data;
  }
});

// Обновление информации о пользователе
export const updateUser = createAsyncThunk('user/updateUser', async (params: User) => {
  try {
    const user = (await userAPI.updateUser(params)).data;
    return user;
  } catch (error: any) {
    return error.response.data;
  }
})

// Добавление проекта в избранное
export const addFavorite = createAsyncThunk('user/addFavorite', async (params: {id: number, name: string, description: string, area: number, price: number, images: string[], userId: number }) => {
  try {
    const houseProject = (await userAPI.addFavorite(params));
    return houseProject;
  } catch (error: any) {
    return error.response.data;
  }
});

// Удаление проекта из избранного
export const removeFavorite = createAsyncThunk('user/removeFavorite', async (params: {id: number, userId: number}) => {
  try {
    const houseProject = (await userAPI.removeFavorite(params));
    return houseProject;
  } catch (error: any) {
    return error.response.data;
  }
});

// Добавление запроса на строительство
export const addRequest = createAsyncThunk('user/addRequest', async (params: Request) => {
  try {
    const request = (await userAPI.addRequest(params));
    return request;
  } catch (error: any) {
    return error.response.data;
  }
});


const initialState: User = getUserFromLS();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
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
  extraReducers: (builder) => {
    builder.addCase(regUser.fulfilled, (state, action) => {
      if (action.payload?.login && action.payload?.role === "User") {
        userSlice.caseReducers.setUser(state, action)
      }
    });
    builder.addCase(authUser.fulfilled, (state, action) => {
      if (action.payload?.login) {
        userSlice.caseReducers.setUser(state, action)
      }
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      if (action.payload?.id) {
        state.login = action.payload.login;
        state.email = action.payload.email;
        state.phoneNumber = action.payload.phoneNumber;
      }
    });

    builder.addCase(addFavorite.fulfilled, (state, action) => {
      if (action.payload?.id) {
      state.favorites = [...state.favorites, action.payload];
    }
  });
    builder.addCase(removeFavorite.fulfilled, (state, action) => {
      if (action.payload?.id) {
        state.favorites = state.favorites.filter(el => el.id !== action.payload.id);
      }
    });
    builder.addCase(addRequest.fulfilled, (state, action) => {
      if (action.payload?.id) {
        state.requests = [...state.requests, action.payload];
      }
    });
  }
});

export const {setUser, removeUser} = userSlice.actions;

export default userSlice.reducer;
