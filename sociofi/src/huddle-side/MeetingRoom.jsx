import { useRoom } from '@huddle01/react'
import React from 'react'

const MeetingRoom = () => {

    const { joinRoom , leaveRoom} = useRoom();

    const handleJoin = async () => {
        try {
            await joinRoom("roomId");
            
        } catch (error) {
            console.log(error)
        }
    }

    const handleLeave = async () => {
        try {
            leaveRoom();
            
        } catch (error) {
            console.log(error)
        }
    }   
  return (
    <div>MeetingRoom

        <button onClick={handleJoin}>Join Room</button>
        <button onClick={handleLeave}>Leave Room</button>
    </div>
  )
}

export default MeetingRoom