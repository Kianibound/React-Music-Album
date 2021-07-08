import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from '@fortawesome/free-solid-svg-icons'

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  setSongInfo,
  songInfo,
  songs,
  setCurrentSong,
  setSongs,
}) => {
  const activeLibraryHandler = (nextPrev) => {
    const newSongs = songs.map((song) => {
      if (song.id === nextPrev.id) {
        return {
          ...song,
          active: true,
        }
      } else {
        return {
          ...song,
          active: false,
        }
      }
    })
    setSongs(newSongs)
  }
  const playSongHandler = () => {
    console.log(audioRef)
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(!isPlaying)
    } else {
      audioRef.current.play()
      setIsPlaying(!isPlaying)
    }
  }

  const getTime = (time) => {
    return Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2)
  }
  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value
    setSongInfo({ ...songInfo, currentTime: e.target.value })
  }

  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    if (direction === 'skip-forward') {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length])
      activeLibraryHandler(songs[(currentIndex + 1) % songs.length])
    }
    if (direction === 'skip-back') {
      if ((currentIndex - 1) % songs.length === -1) {
        await setCurrentSong(songs[songs.length - 1])
        activeLibraryHandler(songs[songs.length - 1])
        return
      }
      await setCurrentSong(songs[(currentIndex - 1) % songs.length])
      activeLibraryHandler(songs[(currentIndex - 1) % songs.length])
    }
    if (isPlaying) audioRef.current.play()
  }

  return (
    <div className='player'>
      <div className='time-control'>
        <p>{getTime(songInfo.currentTime)}</p>
        <input
          min={0}
          max={songInfo.duration || 0}
          value={songInfo.currentTime}
          onChange={dragHandler}
          type='range'
        />
        <p>{songInfo.duration ? getTime(songInfo.duration) : '0:0'}</p>
      </div>
      <div className='play-control'>
        <FontAwesomeIcon
          className='skip-back svg'
          size='2x'
          icon={faAngleLeft}
          onClick={() => skipTrackHandler('skip-back')}
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className='play svg'
          size='2x'
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          className='skip-forward svg'
          size='2x'
          icon={faAngleRight}
          onClick={() => skipTrackHandler('skip-forward')}
        />
      </div>
    </div>
  )
}

export default Player
