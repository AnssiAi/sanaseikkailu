import { useSelector } from 'react-redux'

function Score() {
  const streak = useSelector(state => state.streak.value)
  const score = useSelector(state => state.score.value)

  return (
    <div>
      <h3>{streak}</h3>
      <h4>{score}</h4>
    </div>
  )
}

export default Score
