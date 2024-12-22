import React from 'react';
import { DataProvider } from './DataContext';
import Home from './Home';
import Room from './Room'
import {Route, BrowserRouter, Link, Routes} from 'react-router-dom'
function App() {
  return (
    <DataProvider>
      <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/room' element={<Room/>}/>
      </Routes>  
    </BrowserRouter>
    </DataProvider>
  );
}

export default App;
