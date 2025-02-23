import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: '',
  soundNames: [],
  soundFiles: [],
  soundPath: '',
  isSound: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action) => {
      const { mode, soundNames, soundFiles, soundPath, isSound } = action.payload;
      state.mode = mode;
      state.soundNames = soundNames;
      state.soundFiles = soundFiles;
      state.soundPath = soundPath;
      state.isSound = isSound;
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
