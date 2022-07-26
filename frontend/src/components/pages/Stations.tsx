import { Box, Collapse, Divider, IconButton, Paper, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from 'react'

interface StationRow {
    id: number,
    name_fi: string,
    name_se: string,
    name_en: string,
    address_fi: string,
    address_se: string,
    city_fi: string,
    city_se: string,
    operator: string,
    capacity: number
}

const StationsRow = (station: StationRow) => {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{"& > *":{borderBottom: 'unset'}}}>
                <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                </TableCell>
                <TableCell align='right'>{station.id}</TableCell>
                <TableCell align='right'>{station.name_fi}</TableCell>
                <TableCell align='right'>{station.name_se}</TableCell>
                <TableCell align='right'>{station.name_en}</TableCell>
                <TableCell align='right'>{station.address_fi}</TableCell>
                <TableCell align='right'>{station.address_se}</TableCell>
                <TableCell align='right'>{station.city_fi}</TableCell>
                <TableCell align='right'>{station.city_se}</TableCell>
                <TableCell align='right'>{station.operator}</TableCell>
                <TableCell align='right'>{station.capacity}</TableCell>
            </TableRow>
        </React.Fragment>
    )
}


export const StationsTable = () => {
    return (
        <React.Fragment>
            <Typography variant="h4" noWrap component="div" align='center' sx={{mb: "10px"}}>
                Stations list
            </Typography>
            <Divider  sx={{mb: "10px"}}/>
            <Typography variant='body1' paragraph sx={{wordWrap: "normal", mt: "10px", mb: "20px"}}>
                Here you can take a look at all the available stations.
            </Typography>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label='stations'>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell colSpan={3} align='center'>Name</TableCell>
                            <TableCell colSpan={2} align='center'>Address</TableCell>
                            <TableCell colSpan={2} align='center'>City</TableCell>
                            <TableCell colSpan={2}></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name (FI)</TableCell>
                            <TableCell>Name (SE)</TableCell>
                            <TableCell>Name (EN)</TableCell>
                            <TableCell>Address (FI)</TableCell>
                            <TableCell>Address (SE)</TableCell>
                            <TableCell>City (FI)</TableCell>
                            <TableCell>City (SE)</TableCell>
                            <TableCell>Operator</TableCell>
                            <TableCell>Capacity</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        </React.Fragment>
        
    )
}