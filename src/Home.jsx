import React from 'react';
import { useData } from './DataContext';
import styles from './Home.module.scss'
import { useNavigate } from "react-router-dom";
import NotAvailable from './NotAvailable';
const Home = () => {
  const navigate=useNavigate()
  const { handleSoloModeClick} = useData(); // Получаем данные из контекста
  return (
    <div className={styles.home}>
        <div className={styles.header}><a className={styles.logo}>DotClicker</a><a href='https://github.com/hayasaka5?tab=repositories'>GitHub</a></div>
      <div className={styles.onlineCircle} onClick={()=>navigate('/room')}>Online mode</div>
      <div className={styles.bottom}>
        <div className={styles.text}>
         <h1 className={styles.bigText}>DotClicker</h1> <p>This game lets you sharpen your aim by clicking on circles in solo mode or challenge your friends in thrilling online competitions!</p>
        </div>
        <div className={styles.soloCircle} onClick={()=>{handleSoloModeClick();navigate('/room')}}>Solo mode</div>
        </div>
       <div className={styles.NotAvailableWrap}><NotAvailable/></div> 
    </div>
  );
};

export default Home;
