import { configureStore } from '@reduxjs/toolkit'
import timerReducer from '../components/Timer/timerSlice'
import scoreReducer from '../components/Score/scoreSlice'
import streakReducer from '../components/Score/streakSlice'

export default configureStore({
  reducer: {
    timer: timerReducer,
    score: scoreReducer,
    streak: streakReducer,
  },
})
