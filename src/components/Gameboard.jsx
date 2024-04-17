import { useEffect, useState } from 'react'
import { getRandomInt, shuffle } from '../utils'
import { wordList } from '../wordList'
import { incByStreak } from './Score/scoreSlice'
import { incStreak, resetStreak } from './Score/streakSlice'
import {
  createTimer,
  stopTimer,
  resetTimer,
  setInterval,
} from './Timer/timerSlice'
import Timer from './Timer/Timer'
import Score from './Score/Score'
import { useSelector, useDispatch } from 'react-redux'

function GameBoard() {
  const [isActive, setActive] = useState(false)
  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)
  const [firstWords, setFirstWords] = useState([])
  const [secondWords, setSecondWords] = useState([])

  const dispatch = useDispatch()
  const streak = useSelector(state => state.streak.value)

  useEffect(() => {
    if (first && second) {
      checkMatch()
    }
  }, [first, second])

  //Nämä tilaan?
  const setupGame = () => {
    //Tullaan hakemaan tietokannasta
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
  }

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
    //Haetaan indeksit listalta
    //Haetaan uusi sana
    //Asetetaan haettuihin indekseihin
    if (first.match === second.match) {
      dispatch(resetTimer())
      dispatch(incByStreak(streak))
      dispatch(incStreak())
      first.complete = true
      second.complete = true
    } else {
      dispatch(resetTimer())
      dispatch(resetStreak())
    }
    setFirst(null)
    setSecond(null)
  }

  const startGameHandler = e => {
    e.preventDefault()
    const timer = parseInt(e.target.timer.value)
    dispatch(setInterval(timer))
    dispatch(createTimer(timer))
    setActive(true)
    setupGame()
  }

  const endGameHandler = e => {
    e.preventDefault()
    dispatch(stopTimer())
    setActive(false)
  }

  return (
    <>
      {isActive ? (
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
          <button onClick={e => endGameHandler(e)}>Lopeta peli</button>
        </>
      ) : (
        <>
          <form
            onSubmit={e => {
              startGameHandler(e)
            }}
          >
            <h3>Kielivalinnat tähän</h3>
            <h3>Valitse ajastin</h3>
            <div>
              <input type='radio' name='timer' value='60' />
              <label>60s</label>
              <input type='radio' name='timer' value='30' />
              <label>30s</label>
              <input type='radio' name='timer' value='15' />
              <label>15s</label>
            </div>
            <button type='submit'>Aloita peli</button>
          </form>
        </>
      )}
    </>
  )
}

export default GameBoard
