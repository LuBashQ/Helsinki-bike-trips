import React from 'react';
import './App.css';
import { Header } from './components/templates/Header';
import { Footer } from './components/templates/Footer';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Home } from './components/pages/Home';
import { Box, Toolbar, Typography } from '@mui/material';
import { StationsTable } from './components/pages/Stations';

function App() {

  const drawerWidth = 240;

  return (
    <div className='app'>
      <Router>

      <Header drawerWidth={drawerWidth}/>

      <Box 
        component="main"
        sx={{ position: "fixed", left: drawerWidth, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Typography paragraph sx={{mr: "20%", ml: "20%", mt: 10}}>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/stations" element={<StationsTable />}></Route>
            <Route path="/trips"></Route>
            <Route path="/stations/:stationId"></Route>
          </Routes>
        </Typography>
      
      </Box>

      <Footer />

      </Router>
      

    </div>
  );
}

export default App;
