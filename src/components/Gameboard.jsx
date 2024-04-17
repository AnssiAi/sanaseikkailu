import { useEffect, useState } from 'react'
import { getRandomInt, shuffle } from '../utils'
import { wordList } from '../wordList'
import { incByStreak } from './Score/scoreSlice'
import { incStreak, resetStreak } from './Score/streakSlice'
import { createTimer, stopTimer, resetTimer } from './Timer/timerSlice'
import Timer from './Timer/Timer'
import Score from './Score/Score'
import { useSelector, useDispatch } from 'react-redux'

function GameBoard() {
  const [game, setGame] = useState(0)
  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)
  const [firstWords, setFirstWords] = useState([])
  const [secondWords, setSecondWords] = useState([])

  const dispatch = useDispatch()
  const streak = useSelector(state => state.streak.value)

  //Nämä tilaan?
  useEffect(() => {
    const len = wordList.length

    let words = []
    let fi = []
    let se = []

    for (let i = 0; i < 5; i++) {
      const index = getRandomInt(len)
      words = words.concat(wordList[index])
    }
    //Tehtävä kieliriippumattomaksi
    words.forEach((word, index) => {
      const firstObj = {
        list: 'first',
        key: 'fi' + index,
        match: index,
        word: word.fin,
        complete: false,
      }
      const secondObj = {
        list: 'second',
        key: 'se' + index,
        match: index,
        word: word.sve,
        complete: false,
      }

      fi = fi.concat(firstObj)
      se = se.concat(secondObj)
    })

    setFirstWords(shuffle(fi))
    setSecondWords(shuffle(se))

    dispatch(createTimer(30))
  }, [game])

  useEffect(() => {
    if (first && second) {
      checkMatch()
    }
  }, [first, second])

  const wordClickHandler = (e, word) => {
    e.preventDefault()
    if (word.list === 'first') {
      if (first === word) {
        setFirst(null)
      } else {
        setFirst(word)
      }
    } else {
      if (second === word) {
        setSecond(null)
      } else {
        setSecond(word)
      }
    }
  }

  const checkMatch = () => {
    if (first.match === second.match) {
      dispatch(resetTimer(30))
      dispatch(incByStreak(streak))
      dispatch(incStreak())
      first.complete = true
      second.complete = true
    } else {
      dispatch(resetTimer(30))
      dispatch(resetStreak())
    }
    setFirst(null)
    setSecond(null)
  }

  const newGameHandler = e => {
    e.preventDefault()
    dispatch(resetTimer(30))
    setGame(game + 1)
  }

  const endGameHandler = e => {
    e.preventDefault()
    dispatch(stopTimer())
  }

  return (
    <>
      <Timer />
      <Score />
      <p>Pelilauta</p>
      <div id='firstRow'>
        {firstWords.map(word => (
          <button
            key={word.key}
            disabled={word.complete}
            onClick={e => wordClickHandler(e, word)}
          >
            {word.word}
          </button>
        ))}
      </div>
      <div id='secondRow'>
        {secondWords.map(word => (
          <button
            key={word.key}
            disabled={word.complete}
            onClick={e => wordClickHandler(e, word)}
          >
            {word.word}
          </button>
        ))}
      </div>
      <button onClick={e => newGameHandler(e)}>Uusi peli</button>
      <button onClick={e => endGameHandler(e)}>Lopeta peli</button>
    </>
  )
}

export default GameBoard
