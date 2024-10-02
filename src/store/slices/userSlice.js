import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  uid: null,
  firstName: null,
  lastName: null,
  email: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.uid = action.payload.uid;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
    },
    clearUser(state) {
      state.uid = null;
      state.firstName = null;
      state.lastName = null;
      state.email = null;
    },
  },
});

export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
