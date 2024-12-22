import { useState, useEffect, useRef } from 'react';
import styles from './Room.module.scss';
import RoomModalOnline from './RoomModalOnline';
import { useData } from './DataContext';
import NotAvailable from './NotAvailable';
function Room() {
  const { finishGame, isRoomModalOnlineVisible, countDown, room } = useData();
  const [isPlaying, setIsPlaying] = useState(false);
  const [circles, setCircles] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [lives, setLives] = useState(6);
  const canvasRef = useRef(null);

  const scoreRef = useRef(score);
  const timerRef = useRef(timer);
  const intervalRef = useRef(1000);
  const gameIntervalIdRef = useRef(null);

  // Синхронизация рефов с состоянием
  useEffect(() => {
    scoreRef.current = score;
    timerRef.current = timer;
  }, [score, timer]);

  // Завершение игры
  const handleGameOver = () => {
    const finalScore = scoreRef.current;
    const finalTimer = timerRef.current;

    setIsPlaying(false);
 
    finishGame(finalScore, finalTimer);
    resetGame();
  };

  // Сброс состояния игры
  const resetGame = () => {
    setCircles([]);
    setScore(0);
    setTimer(0);
    setLives(6);
    intervalRef.current = 1000; // Сброс интервала
    clearInterval(gameIntervalIdRef.current); // Очищаем игровой таймер
    gameIntervalIdRef.current = null;
  };

  // Генерация круга внутри canvas
  const addCircleFromTarget = (targetIndex) => {
    if (!room?.targets || targetIndex >= room.targets.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const [xPercent, yPercent] = room.targets[targetIndex];

    const x = (xPercent / 100) * canvas.clientWidth;
    const y = (yPercent / 100) * canvas.clientHeight;

    setCircles((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${targetIndex}`,
        x: Math.min(Math.max(0, x), canvas.clientWidth),
        y: Math.min(Math.max(0, y), canvas.clientHeight),
        time: 6,
        size: 40,
      },
    ]);
  };

  // Удаление истёкших кругов и обновление жизней
  const removeExpiredCirclesAndUpdateLives = (circles) => {
    const activeCircles = circles.filter((circle) => circle.time > 0);
    const expiredCount = circles.length - activeCircles.length;

    if (expiredCount > 0) {
      setLives((prev) => {
        const newLives = prev - expiredCount;
        if (newLives <= 0) handleGameOver();
        return Math.max(newLives, 0);
      });
    }

    return activeCircles;
  };

  // Обработчик клика по кругу
  const handleCircleClick = (id) => {
    setCircles((prev) => prev.filter((circle) => circle.id !== id));
    setScore((prev) => prev + 1);
  };

  // Основная игровая логика
  useEffect(() => {
    if (isPlaying) {
      let targetIndex = 0;

      // Функция спауна круга
      const spawnCircle = () => {
        if (targetIndex < room?.targets?.length) {
          addCircleFromTarget(targetIndex);
          targetIndex++;
        }

        // Уменьшение интервала для повышения сложности
        intervalRef.current = Math.max(350, intervalRef.current - 30);
      };

      // Установка интервала для спауна кругов
      gameIntervalIdRef.current = setInterval(() => {
        spawnCircle();

        setCircles((prev) =>
          removeExpiredCirclesAndUpdateLives(
            prev.map((circle) => ({ ...circle, time: circle.time - 1 }))
          )
        );

        setTimer((prev) => prev + 1);
      }, intervalRef.current);

      return () => clearInterval(gameIntervalIdRef.current);
    }
  }, [isPlaying, room?.targets]);

  // Запуск игры при окончании отсчёта
  useEffect(() => {
    if (countDown === 0 && !isPlaying) {
      resetGame();
      setIsPlaying(true);
    }
  }, [countDown]);

  // Анимация кругов
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setCircles((prev) =>
        prev.map((circle) => ({
          ...circle,
          size: circle.time > 3
            ? Math.min(circle.size + 2, 80)
            : Math.max(circle.size - 2, 10),
        }))
      );
    }, 100);

    return () => clearInterval(animationInterval);
  }, [circles]);

  return (
    <div className={styles.room}>
      <div className={styles.stats}>
        <span>Time: {timer} Score: {score} Lives: {lives/2}</span> <div className={styles.lives}>
        <div className={styles.lives}>
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className={lives/2 > index ? styles.redLive : styles.whiteLive}
      />
    ))}
  </div>
       </div>
      </div>
      <div className={styles.canvas} ref={canvasRef}>
        {isPlaying &&
          circles.map((circle) => (
            <div
              key={circle.id}
              style={{
                position: 'absolute',
                left: `${circle.x}px`,
                top: `${circle.y}px`,
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                borderRadius: '50%',
                backgroundColor: '#CD3535',
                transform: 'translate(-50%, -50%)',
                transition: 'width 0.1s, height 0.1s',
              }}
              onClick={() => handleCircleClick(circle.id)}
            />
          ))}
      </div>
      {countDown > 0 && (
        <div className={styles.countDownOverlay}>{countDown}</div>
      )}
      {isRoomModalOnlineVisible && (
        <div className={styles.overlay}>
          <RoomModalOnline />
        </div>
      )}
      <div className={styles.NotAvailableWrap}><NotAvailable/></div> 
    </div>
  );
}

export default Room;
