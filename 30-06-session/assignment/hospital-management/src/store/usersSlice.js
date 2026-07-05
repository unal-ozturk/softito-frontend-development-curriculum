import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../lib/api';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (role = null) => {
    let endpoint = '/users';
    if (role) {
      endpoint += `?role=${role}`;
    }
    const response = await api.get(endpoint);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (JSON.stringify(state.list) !== JSON.stringify(action.payload)) {
          state.list = action.payload;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
