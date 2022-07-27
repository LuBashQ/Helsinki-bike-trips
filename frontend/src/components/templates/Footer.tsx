import {Box, Grid, IconButton, Typography} from '@mui/material';
import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import {LinkedIn} from '@mui/icons-material';

const Copyright = () => {
    return (
        <Typography variant="body2" color="secondary">
            {'Cristian Nicolae Lupascu ©️ '}
            {new Date().getFullYear()}
        </Typography>
    )
}

const Icons = () => {
    return (
        <Grid className="footer-icon-grid"
              container
              alignItems="center"
              justifyContent="center"
              direction="row"
              rowSpacing={2}
        >
            <Grid item>
                <IconButton
                    size="small"
                    edge="start"
                    color="inherit"
                    aria-label="github"
                    onClick={() => window.open("https://github.com/LuBashQ")}
                    >
                        <GitHubIcon />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton
                        size="small"
                        edge="start"
                        color="inherit"
                        aria-label="linkedin"
                        onClick={() => window.open("https://www.linkedin.com/in/cristian-nicolae-lupascu-b5143a161/")}
                    >
                        <LinkedIn />
                    </IconButton>
                </Grid>
        </Grid>
    )
}

export const Footer = () => {
    return (
        <Box>
            <Copyright/>
            <Icons/>
        </Box>
    );
}