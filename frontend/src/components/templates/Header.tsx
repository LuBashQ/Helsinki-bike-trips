import {
    AppBar,
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@mui/material';
import React from 'react';
import {LocationCity, PedalBike} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import {useNavigate} from 'react-router-dom';
import {Footer} from './Footer';

interface HeaderProps {
    drawerWidth: number
}


export const Header = ({drawerWidth}: HeaderProps) => {
    const navigate = useNavigate();

    const goToStations = () => {
        navigate('/stations')
    }

    const goToTrips = () => {
        navigate('/trips')
    }

    const goToHome = () => {
        navigate('/')
    }


    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                <ListItemButton key="Home" onClick={goToHome}>
                    <ListItemIcon>
                        <HomeIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton key="Stations" onClick={goToStations}>
                    <ListItemIcon>
                        <LocationCity color="secondary"/>
                    </ListItemIcon>
                    <ListItemText primary="Stations"/>
                </ListItemButton>
                <ListItemButton key="Trips" onClick={goToTrips}>
                    <ListItemIcon>
                        <PedalBike color="secondary"/>
                    </ListItemIcon>
                    <ListItemText primary="Trips"/>
                </ListItemButton>
            </List>
            <List style={{position: "fixed", bottom: 0}}>
                <ListItem>
                    <Footer/>
                </ListItem>
            </List>
        </div>
    )

    return (
        <Box sx={{display: "flex"}}>
            <AppBar
                position="fixed"
                sx={{
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                    ml: {sm: `calc(${drawerWidth}px)`}
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Helsinki bike trips
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                aria-label="navbar"
            >
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    )
}