import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: '',
  soundNames: [],
  soundFiles: [],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action) => {
      const { mode, soundNames, soundFiles } = action.payload;
      state.mode = mode;
      state.soundNames = soundNames;
      state.soundFiles = soundFiles;
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
