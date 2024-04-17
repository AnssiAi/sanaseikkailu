import GameBoard from './components/Gameboard'
import Menu from './components/Menu'

function App() {
  //Palautetaan menu + gameboard
  //Aloita peli?
  return (
    <div id='content'>
      <Menu />
      <GameBoard />
    </div>
  )
}

export default App
