import React, { useRef, useEffect, useState } from 'react'
import { resetRoom } from './state'
import { createSocketConnectionInstance } from './connection'
const RoomComponent = (props) => {
    let socketInstance = useRef(null);    
    useEffect(() => {
        startConnection();
    }, []);
    const startConnection = () => {
        params = {quality: 12}
        socketInstance.current = createSocketConnectionInstance({
            // updateInstance: updateFromInstance,
            params
        });
    }
    const handleDisconnect = () => {
        if (socketInstance.current) {
            socketInstance.current.destoryConnection();
            resetRoom()
        }
    }
    const [mediaType, setMediaType] = useState(false);    
    const toggleScreenShare = (displayStream ) => {
        const { reInitializeStream, toggleVideoTrack } = socketInstance.current;
        displayStream === 'displayMedia' && toggleVideoTrack({
            video: false, audio: true
        });
        reInitializeStream(false, true, displayStream).then(() => {
            setMediaType(!mediaType)
        });
    }
    return (
        <React.Fragment>
            <div id="room-container"></div>
            <button onClick={handleDisconnect}>Disconnect</button>
            <button 
                onClick={() => toggleScreenShare (mediaType ? 
                'userMedia' : 'displayMedia')}
            >
            {mediaType ? 'screen sharing' : 'stop sharing'}</button>
        </React.Fragment>
    )
}

export default RoomComponent;