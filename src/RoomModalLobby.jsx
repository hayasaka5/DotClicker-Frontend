import { useData } from './DataContext'
import styles from './RoomModalLobby.module.scss'
function RoomModalLobby(){
    const {room}=useData()
    const players=room?.players||[]
    return(
        <div className={styles.RoomModalLobby}>
        <div className={styles.left}>

        </div>
        <div className={styles.right}>
      
            <table>
                <thead>
                <tr>
                    <th>Room</th>
                    <th>Time</th>
                    <th>Score</th>
                    <th>Play</th>
                </tr>
                </thead>
                <tbody>
             {players.map((player)=>{(
                <tr key={player.name}>
                    <td>{player.time}</td>
                    <td>{player.score}</td>
                </tr>
             )})}</tbody>
            </table>
        </div>
        </div>
    )
}
export default RoomModalLobby