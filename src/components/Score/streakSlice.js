import { createSlice } from '@reduxjs/toolkit'

export const streakSlice = createSlice({
  name: 'streak',
  initialState: {
    value: 0,
  },
  reducers: {
    incStreak: state => {
      state.value += 1
    },
    decStreak: state => {
      state.value -= 1
    },
    resetStreak: state => {
      state.value = 0
    },
  },
})

export const { incStreak, decStreak, resetStreak } = streakSlice.actions

export default streakSlice.reducer
