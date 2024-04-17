import { createSlice } from '@reduxjs/toolkit'

//Asetetaan objekti numeron sijasta?
export const timerSlice = createSlice({
  name: 'timer',
  initialState: {
    value: 0,
    active: false,
  },
  reducers: {
    createTimer: (state, action) => {
      state.value = action.payload
      state.active = true
    },
    stopTimer: state => {
      state.active = false
    },
    resetTimer: (state, action) => {
      state.value = action.payload
      state.active = true
    },
    decTimer: state => {
      if (state.value > 0) {
        state.value -= 1
      }
    },
    getTime: (state, action) => {
      action.payload = state.value
    },
    getActiveTimer: (state, action) => {
      action.payload = state.active
    },
  },
})

export const {
  createTimer,
  stopTimer,
  resetTimer,
  decTimer,
  getTime,
  getActiveTimer,
} = timerSlice.actions

export default timerSlice.reducer
