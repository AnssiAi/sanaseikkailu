import { useState, useEffect } from 'react'

function Timer() {
  const [time, setTime] = useState(30)

  let timer = setInterval(() => {
    if (time === 0) {
      clearInterval(timer)
      setTime(30)
    } else {
      setTime(time - 1)
    }
  }, 1000)

  return (
    <>
      <h2>{time}</h2>
    </>
  )
}

export default Timer
