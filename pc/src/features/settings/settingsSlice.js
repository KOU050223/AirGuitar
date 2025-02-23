import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: '',
  soundNames: [],
  soundFiles: [],
  soundPath: '',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action) => {
      const { mode, soundNames, soundFiles, soundPath } = action.payload;
      state.mode = mode;
      state.soundNames = soundNames;
      state.soundFiles = soundFiles;
      state.soundPath = soundPath;
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
