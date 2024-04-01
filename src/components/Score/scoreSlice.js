import { createSlice } from '@reduxjs/toolkit'

export const scoreSlice = createSlice({
  name: 'score',
  initialState: {
    value: 0,
  },
  reducers: {
    decScore: state => {
      state.value -= 1
    },
    incByStreak: (state, action) => {
      state.value += action.payload
    },
  },
})

export const { decScore, incByStreak } = scoreSlice.actions

export default scoreSlice.reducer
