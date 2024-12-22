import { useState, useEffect, useContext, createContext } from "react";

// Создаем контекст для управления состоянием
const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // Состояния для интерфейса и логики
  const [isRoomModalLobbyVisible, setIsRoomModalLobbyVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState('');
  const [ws, setWs] = useState(null);
  const [isRoomModalOnlineVisible, setIsRoomModalOnlineVisible] = useState(true);
  const [room, setRoom] = useState({ players: [] });
  const [name, setName] = useState('');
  const [countDown,setCountDown]=useState(3)
  const [isCountDownGoing,setIsCountDownGoing]=useState(false)
  const [error,setError]=useState('')
  const [soloMode,setSoloMode]=useState(false)
  const handleSoloModeClick = () => {
    setIsRoomModalLobbyVisible(true);
    let roomID = 1;
    setSoloMode(true);
    setRoom(prevRoom => ({
      ...prevRoom,
      roomID,
      players: [{ name: 'You', time: null, score: null, isReady: false }],
      targets: [], 
    }));
  };

  if(soloMode&&room.players[0].isReady){
    room.targets=createTargets()
  }
  useEffect(() => {
    console.log(room)
  }, [room])
  
  function createTargets() {
    return Array.from({ length: 3000 }, () => [  // Генерация 10 целей
      Math.floor(Math.random() * 100),        // x: от 0 до 500
      Math.floor(Math.random() * 100)         // y: от 0 до 500
    ]);
  }
  useEffect(() => {
    let interval;
    if(isCountDownGoing&&countDown>0){
     interval= setInterval(() => {
        setCountDown((prev)=>prev-1)
      }, 1000);
    }
  
    return () => clearInterval(interval)
  }, [setCountDown,isCountDownGoing,countDown])
  
  useEffect(() => {
    // Подключаемся к серверу WebSocket
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);
  
    // Обработка входящих сообщений
    socket.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.status==='error'){
          setError(response.message)
        }
        if (response.method === 'createRoom' && response.status === 'success') {
          console.log('Комната успешно создана', response);
          if (response.room) {
            setRoom(response.room);
            setIsRoomModalLobbyVisible(true);
          }
        }

        if (response.method === 'changeRoom' && response.status === 'success') {
          console.log('Обновлено состояние комнаты', response);
          setRoom(response.room);
          setIsRoomModalLobbyVisible(true);
          const readyPlayerCount=response.room.players.filter(player=>player.isReady===true).length
          if(readyPlayerCount===response.room.players.length){
            setIsRoomModalOnlineVisible(false)
            setCountDown(3)
            setIsCountDownGoing(true)
          }
        }
      } catch (error) {
        console.error('Ошибка при обработке сообщения:', error);
      }
    };
    // Закрываем соединение при размонтировании компонента
    return () => {
      socket.close();
    };
  }, []);

  /**
   * Присоединение к комнате
   * @param {string} roomID - ID комнаты
   * @param {string} name - Имя игрока
   */
  const joinRoom = (roomID, name) => {
    setName(name);
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        method: "joinRoom",
        roomID:roomID,
        player: name,
      }));
      console.log(`Пытаемся присоединиться: ${name} в ${roomID}`);
    }
  };

  /**
   * Создание новой комнаты
   * @param {string} name - Имя игрока
   */
  const createRoom = (name) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        method: "createRoom",
        player: name,
      }));
      setName(name);
      console.log(`Комната создается игроком: ${name}`);
    }
  };

  const finishGame = (newScore, newTime) => {
    if (soloMode) {
      handleSoloModeEnd(newScore, newTime);
    } else {
      handleMultiplayerModeEnd(newScore, newTime);
    }
    setIsRoomModalOnlineVisible(true);
  };
  
  // Отдельная функция для обработки окончания игры в одиночном режиме
  const handleSoloModeEnd = (newScore, newTime) => {
    let roomID = 1;
    switchIsReady();
    setRoom((prevRoom) => ({
      ...prevRoom,
      roomID,
      players: [{ name: 'You', time: newTime, score: newScore, isReady: false }],
      targets: [],
    }));
  };
  
  // Отдельная функция для обработки окончания игры в многопользовательском режиме
  const handleMultiplayerModeEnd = (newScore, newTime) => {
    const message = {
      method: 'finishGame',
      player: name,
      roomID: room.roomID,
      newScore,
      newTime,
    };
    ws.send(JSON.stringify(message));
    console.log(`newTime: ${newTime}`);
    console.log(`newScore: ${newScore}`);
  };
  

  /**
   * Переключение статуса готовности игрока
   */
  const switchIsReady = () => {
    if(soloMode){
      room.players[0].isReady=!room.players[0].isReady
      if(room.players[0].isReady){
        setIsRoomModalOnlineVisible(false)
        setCountDown(3)
        setIsCountDownGoing(true)
      }
    }else{
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          method: "switchIsReady",
          roomID: room.roomID,
          player: name,
        }));
  
        console.log(`Переключаем готовность для игрока ${name}`);
        // Оптимистичное обновление интерфейса
        setRoom((prevRoom) => ({
          ...prevRoom,
          players: prevRoom.players.map(player =>
            player.name === name ? { ...player, isReady: !player.isReady } : player
          ),
        }));
      }
    }
  
  };

  return (
    <DataContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        player,
        setPlayer,
        createRoom,
        isRoomModalOnlineVisible,
        setIsRoomModalOnlineVisible,
        room,
        isRoomModalLobbyVisible,
        switchIsReady,
        joinRoom,
        countDown,
        finishGame,
        error,
        setError,
        handleSoloModeClick,
        soloMode
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Хук для упрощенного доступа к контексту
export const useData = () => useContext(DataContext);
