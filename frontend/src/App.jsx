import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { Home } from './pages/Home'
import { HowToPlay } from './pages/HowToPlay'
import { Navbar } from './components/Navbar'
const App = () => {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/how-to-play" element={<HowToPlay/>}/>
    </Routes>
    </>
  )
}

export default App;