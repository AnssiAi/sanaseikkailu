import { resetTimer, decTimer } from './timerSlice'
import { useSelector, useDispatch } from 'react-redux'
import { decStreak } from '../Score/streakSlice'

function Timer() {
  const time = useSelector(state => state.timer.value)
  const dispatch = useDispatch()

  let timer = setTimeout(() => {
    if (time > 0) {
      dispatch(decTimer())
    } else {
      dispatch(decStreak())
      dispatch(resetTimer())
    }
  }, 1000)

  return (
    <>
      <h2>{time}</h2>
    </>
  )
}

export default Timer
