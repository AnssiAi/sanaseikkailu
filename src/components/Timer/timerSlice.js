import { createSlice } from '@reduxjs/toolkit'

export const timerSlice = createSlice({
  name: 'timer',
  initialState: {
    value: 30,
  },
  reducers: {
    resetTimer: state => {
      state.value = 30
    },
    decTimer: state => {
      state.value -= 1
    },
  },
})

export const { resetTimer, decTimer } = timerSlice.actions

export default timerSlice.reducer
