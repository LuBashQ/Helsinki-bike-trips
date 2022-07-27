import {
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import React, {useEffect} from 'react'
import axios from 'axios';
import {StationSearch} from './StationSearch';

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
    capacity: number,
    x: number,
    y: number
}

interface TableProps {
    page: number,
    perPage: number,
    stationsPage: StationRow[],
    changePage: (event: unknown, newPage: number) => void,
    changePerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
}

interface Column {
    id: string
    label: string,
}

const columns: readonly Column[] = [
    {id: "id", label: "ID"},
    {id: "name_fi", label: "Name (FI)"},
    {id: "name_se", label: "Name (SE)"},
    {id: "name_en", label: "Name (EN)"},
    {id: "address_fi", label: "Address (FI)"},
    {id: "address_se", label: "Address (SE)"},
    {id: "city_fi", label: "City (FI)"},
    {id: "city_se", label: "City (SE)"},
    {id: "operator", label: "Operator"},
    {id: "capacity", label: "Capacity"},
]


const StationsTable = ({page, perPage, stationsPage, changePage, changePerPage}: TableProps) => {
    return (
        <React.Fragment>
            <TableContainer component={Paper} sx={{maxHeight: 500, width: "100%"}}>
                <Table stickyHeader aria-label='stations'>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell colSpan={3} align='center'>Name</TableCell>
                            <TableCell colSpan={2} align='center'>Address</TableCell>
                            <TableCell colSpan={2} align='center'>City</TableCell>
                            <TableCell colSpan={2}></TableCell>
                        </TableRow>
                        {columns.map(
                            column => (
                                <TableCell
                                    key={column.id}
                                    align="center"
                                    style={{wordWrap: "break-word", overflowWrap: "break-word", width: "10%"}}
                                >{column.label}</TableCell>
                            )
                        )}
                    </TableHead>
                    <TableBody>
                        {stationsPage
                            .map(station => (
                                <TableRow key={station.id}>
                                    <TableCell align="center" width="10%">{station.id}</TableCell>
                                    <TableCell align="center" width="10%">{station.name_fi}</TableCell>
                                    <TableCell align="center" width="10%">{station.name_se}</TableCell>
                                    <TableCell align="center" width="10%">{station.name_en}</TableCell>
                                    <TableCell align="center" width="10%">{station.address_fi}</TableCell>
                                    <TableCell align="center" width="10%">{station.address_se}</TableCell>
                                    <TableCell align="center" width="10%">{station.city_fi}</TableCell>
                                    <TableCell align="center" width="10%">{station.city_se}</TableCell>
                                    <TableCell align="center" width="10%">{station.operator}</TableCell>
                                    <TableCell align="center" width="10%">{station.capacity}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                rowsPerPage={perPage}
                count={stationsPage.length}
                page={page}
                onPageChange={changePage}
                onRowsPerPageChange={changePerPage}
                component="span"
            />
        </React.Fragment>
    )
}

export const Stations = () => {

    const [filters, setFilters] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);
    const [stationsPage, setStationsPage] = React.useState<StationRow[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            console.log(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/stations?page=${page}&perPage=${perPage}${filters}`)
            const res = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/stations?page=${page}&perPage=${perPage}${filters}`);
            setStationsPage(res.data.data);
            console.log(res.data.data);
        }

        fetchData();
    }, [page, perPage, filters])


    const changePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    }

    const changePerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(1);
        setPerPage(+event.target.value);
    }

    return (
        <React.Fragment>
            <Typography variant="h4" noWrap component="div" align='center' sx={{mb: "10px"}}>
                Stations list
            </Typography>
            <Divider sx={{mb: "10px"}}/>
            <Typography variant='body1' paragraph sx={{wordWrap: "normal", mt: "10px", mb: "20px"}}>
                Here you can take a look at and search for stations.
            </Typography>
            <StationSearch setFilters={setFilters}/>
            <StationsTable page={page} perPage={perPage} stationsPage={stationsPage} changePage={changePage}
                           changePerPage={changePerPage}/>
        </React.Fragment>
    )
}