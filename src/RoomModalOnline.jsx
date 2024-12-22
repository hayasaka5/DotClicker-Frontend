import styles from './RoomModalOnline.module.scss'
import { useData } from './DataContext';
import { useState } from 'react';
import { useEffect } from 'react';
function RoomModalOnline(){
    const {createRoom, isRoomModalLobbyVisible, room, switchIsReady,joinRoom,error,setError,soloMode} = useData()
    const players=room.players||[]
    const [createPlayer, setCreatePlayer]=useState('')
    const [joinPlayer, setJoinPlayer]=useState('')
    const [joinRoomID,setJoinRoomID]=useState('')
    const [createError,setCreateError]=useState('')
    const [joinError,setJoinError]=useState('')
    const handleJoinRoom=()=>{
        // setError('')
        if(joinPlayer.length>4){
          joinRoom(joinRoomID,joinPlayer)
        }if (joinPlayer.length<3) {
            setError('Invalid name')
        } else {
            joinRoom(joinRoomID,joinPlayer)
        }
    }
    const handleCreateRoom=()=>{
        if(createPlayer.length>3){
            createRoom(createPlayer)
            setCreateError('')
        }else{
            setCreateError('Invalid name')
        }
        
    }
    const getInputData = (event,hook)=>{
        hook(event.target.value)
    }
    useEffect(() => {
    console.log(room)
    }, [room])
    
    return(
        <div className={styles.RoomModalOnline}>
           <div className={styles.left}></div>
            {isRoomModalLobbyVisible ? <div className={styles.roomModalLobby}>
              {/* {players[0].isReady||'xddd'} */}
                <table>
                <thead>
                <tr>
                    <th className={styles.bigText}>Room</th>
                    <th>Time</th>
                    <th>Score</th>
                    <th>Play</th>
                </tr>
                </thead>
                <tbody>
             {players.map((player)=>(
                <tr key={player.name}>
                    <td >{player.name}</td>
                    <td>{player.time===null ? '-' : player.time}</td>
                    <td>{player.score===null ? '-':player.score}</td>
                    {/* <td>{player.isReady ? 'ready' : 'not ready'}</td> */}
                    <td>
                 <div
                    className={`${styles.playCircle} ${
                     player?.isReady ? styles['playCircle--ready'] : styles['playCircle--notReady']
                         }`}
                        ></div>
                            </td>
                </tr>
             ))}
             
             </tbody>
            </table>
            {/* <table >
                    <tbody>
                    <tr className={styles.bottom}>
                <td >
                RoomID: {room.roomID}
                </td>
                <td></td>
                <td></td>
                <td>
                <div className={styles.circle}>Play</div>
                </td>
             </tr>
                    </tbody>
            </table> */}
            <div className={styles.bottom}>
                {soloMode ? 'Solo mode' : <div>RoomID: {room.roomID}</div>}
             <div className={styles.circle} onClick={switchIsReady}>Play</div>
            </div>
            </div> 
            
            :<div className={styles.middleLeftWrap}><div className={styles.middle}>
            <a className={styles.bigText}>Online</a>
            Name 
            <input type="text" name="" id="" onChange={(event)=>getInputData(event,setJoinPlayer)} value={joinPlayer}/>
            RoomID
            <input type="number" onChange={(event)=>getInputData(event,setJoinRoomID)} value={joinRoomID}/>
            <a className={styles.error}>{error}</a>
            <label>Name</label>
            <input type="text" onChange={(event)=>getInputData(event,setCreatePlayer)} value={createPlayer}/>
            <a className={styles.error}>{createError}</a>
           </div>
           <div className={styles.right}>
            <div className={styles.circle} onClick={handleJoinRoom}>
                Join
            </div>
            <div className={styles.circle} onClick={handleCreateRoom}>
                Create
      
            </div>
             
           </div></div> }
            
           
           </div>
        
    )
}
export default RoomModalOnline;