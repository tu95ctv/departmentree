import Axios from 'axios';
import React from 'react';
import Room from './Room'
import { useSnapshot, setState } from './state'
function Home(props) {
    const { room_id } = useSnapshot()
    const handleJoin = () => {
        Axios.get(`http://localhost:5000/join`).then(res => {
           console.log('dataaa', res.data.link)
           setState({
               room_id: res.data.link,
               quality: 12
           })
        })
    }

    return (
        <React.Fragment>
            <If condition={!Boolean(room_id)}>
                <button onClick={handleJoin}>join</button>
            </If>
            <If condition={Boolean(room_id)}>
                <Room />
            </If>
        </React.Fragment>
    )
}

export default Home;