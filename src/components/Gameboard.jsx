import { useEffect, useState } from 'react'
import { getRandomInt, shuffle } from '../utils'
import { wordList } from '../wordList'

function GameBoard() {
  const [game, setGame] = useState(0)
  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)
  const [firstWords, setFirstWords] = useState([])
  const [secondWords, setSecondWords] = useState([])
  const [streak, setStreak] = useState(0)
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(30)

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
  }, [game])

  useEffect(() => {
    if (first && second) {
      checkMatch()
    }
  }, [first, second])

  let timer = setInterval(() => {
    if (time === 0) {
      if (streak > 0) {
        setStreak(streak - 1)
      }
      clearInterval(timer)
      setTime(30)
    } else {
      setTime(time - 1)
    }
  }, 1000)

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
      setScore(score + streak)
      setStreak(streak + 1)
      first.complete = true
      second.complete = true
    } else {
      setStreak(0)
    }
    setFirst(null)
    setSecond(null)
  }

  const newGameHandler = e => {
    e.preventDefault()
    setGame(game + 1)
  }

  return (
    <>
      <h2>{time}</h2>
      <p>Putki: {streak}</p>
      <p>Pisteet: {score}</p>
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
    </>
  )
}

export default GameBoard
