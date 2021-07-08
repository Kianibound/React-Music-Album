import React, { useState, useRef } from 'react'
import Player from './components/Player'
import Song from './components/Song'
import data from './components/data'
import Library from './components/library'
import Nav from './components/nav'
import './styles/app.scss'

function App() {
  const [Songs, setSongs] = useState(data())
  const [currentSong, setCurrentSong] = useState(Songs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef()
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
  })
  const [libraryStatus, setLibraryStatus] = useState(false)
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime
    const duration = e.target.duration
    setSongInfo({ ...songInfo, currentTime: current, duration })
  }
  const songEndHandler = async () => {
    let currentIndex = Songs.findIndex((song) => song.id === currentSong.id)
    await setCurrentSong(Songs[(currentIndex + 1) % Songs.length])
    if (isPlaying) audioRef.current.play()
  }
  return (
    <div className={`App ${libraryStatus ? 'library-active' : ''}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        audioRef={audioRef}
        setSongInfo={setSongInfo}
        songInfo={songInfo}
        songs={Songs}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
      />
      <Library
        setCurrentSong={setCurrentSong}
        songs={Songs}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setSongs={setSongs}
        libraryStatus={libraryStatus}
      />
      <audio
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        ref={audioRef}
        src={currentSong.audio}
        onEnded={songEndHandler}
      ></audio>
    </div>
  )
}

export default App
