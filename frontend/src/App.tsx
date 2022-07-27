import React from 'react';
import './App.css';
import {Header} from './components/templates/Header';
import {BrowserRouter as Router, Route, Routes,} from "react-router-dom";
import {Home} from './components/pages/Home';
import {Box, Toolbar, Typography} from '@mui/material';
import {Stations} from './components/pages/Stations';

function App() {

    const drawerWidth = 240;

    return (
        <div className='app'>
            <Router>

                <Header drawerWidth={drawerWidth}/>

      <Box
          component="main"
          sx={{position: "relative", left: drawerWidth, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
      >
          <Toolbar/>
          <Typography component="div" sx={{mr: "10%", ml: "10%", mt: "10px"}}>
              <Routes>
                  <Route path="/" element={<Home/>}></Route>
                  <Route path="/stations" element={<Stations/>}></Route>
                  <Route path="/trips"></Route>
                  <Route path="/stations/:stationId"></Route>
              </Routes>
          </Typography>


      </Box>

      </Router>

    </div>
  );
}

export default App;
