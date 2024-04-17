import { resetTimer, decTimer, getTime, getActiveTimer } from './timerSlice'
import { useSelector, useDispatch } from 'react-redux'
import { decStreak } from '../Score/streakSlice'
import { useEffect } from 'react'

function Timer() {
  const time = useSelector(state => state.timer.value)
  const dispatch = useDispatch()

  //Jos käytetään useEffect sisällä dependecy pohjainen muutos luo useita päällekkäisiä timereita
  //Rekursiivinen timer?
  useEffect(() => {
    let timer = setInterval(() => {
      const active = dispatch(getActiveTimer())
      if (active.payload === false) {
        clearInterval(timer) //Tätä ei pystytä käyttämään tämän hookin ulkopuolelta
      }
      const current = dispatch(getTime())
      if (current.payload > 0) {
        dispatch(decTimer())
      } else {
        dispatch(decStreak())
        dispatch(resetTimer(30))
      }
    }, 1000)
  }, [])

  return (
    <>
      <h2>{time}</h2>
    </>
  )
}

export default Timer
