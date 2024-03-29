import { Button, CircularProgress, Grid, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { Fragment, useState } from 'react'
import Flag from 'react-world-flags'
import useApi from '../../../hooks/Api'
import {Station} from '../../../models/Station'
import { StationStatistics } from '../../../models/Statistics'
import { constructCity, Data } from '../base'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Station.scss'
import L from 'leaflet'
import marker from './marker.svg'
import {useParams} from 'react-router-dom'
import {Link} from 'react-router-dom'
import AdornedTextField from '../../form/AdornedTextField'
import useQueryParams from '../../../hooks/Params'
import NumbersIcon from '@mui/icons-material/Numbers';

/**
 * Fetches the map marker and sets its size
 * @returns The map marker icon
 */
const getMarker = () => {
    return L.icon({
        iconUrl: marker,
        iconSize: L.point(40,40)
    })
}

/**
 * Displays a station's statistics in a table
 * @param stats The trips statistics
 * @param inbound Inbound or outbound trips should be displayed
 * @returns A component which will show either outbound or inbound statistics for a station
 */
const TripsData = (stats: StationStatistics, inbound = true) => {
    return (
        <Fragment>
            <TableRow>
                <TableCell rowSpan={8} colSpan={2}><strong>{inbound ? 'Arriving' : 'Departing'} trips</strong></TableCell>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell align='right' colSpan={2}>{inbound ? stats.totalInbound : stats.totalOutbound}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell><strong>Average distance</strong></TableCell>
                <TableCell align='right' colSpan={2}>{inbound ? stats.averageDistanceInbound : stats.averageDistanceOutbound} m</TableCell>
            </TableRow>
            <TableRow>
                <TableCell rowSpan={6}><strong>Top 5</strong></TableCell>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell align='right'><strong>Total trips</strong></TableCell>
            </TableRow>
            {inbound ?
                stats.topInbound.map(s => {
                    return (
                        <TableRow key={s.departure_station}>
                            <TableCell><Link to={`/stations/${s.departure_station}`}><p className="station-column-single-name">
                                            {s.departure_station}
                                        </p></Link></TableCell>
                            <TableCell align='right'>{s.total}</TableCell>
                        </TableRow>
                    )
                }) :
                stats.topOutbound.map(s => {
                    return (
                        <TableRow key={s.return_station}>
                            <TableCell><Link to={`/stations/${s.return_station}`}><p className="station-column-single-name">
                                            {s.return_station}
                                        </p></Link></TableCell>
                            <TableCell align='right'>{s.total}</TableCell>
                        </TableRow>
                    )
                })}
        </Fragment>
    )
}

/**
 * Structures station data into components to make it easy to insert into the table
 * @param station The station
 * @returns An object of components
 */
const createData = (station: Station): Data => {
    return {
        id: station.id,
        name: <p className="station-column-multiple-names">
            <span className="station-text">{station.name_fi}</span><Flag code='fin' height={12} className='flag'/><br/>
            <span className="station-text">{station.name_se}</span><Flag code='swe' height={12} className='flag'/><br/>
            <span className="station-text">{station.name_en}</span><Flag code='gbr' height={12} className='flag'/>
        </p>,
        address: <p className="station-column-multiple-names">
            <span className="station-text">{station.address_fi}</span><Flag code='fin' height={12} className='flag'/><br/>
            <span className="station-text">{station.address_se}</span><Flag code='swe' height={12} className='flag'/>
        </p>,
        city: <p className="station-column-multiple-names">
            {constructCity(station, 'fi')}<br/>
            {constructCity(station, 'se')}
        </p>,
        operator: <p className="station-column-single-name">
            {station.operator}
        </p>,
        capacity: <p className="station-column-single-name">
            {station.capacity}
        </p>
    }
}

/**
 * Displays inbound and outbound statistics about a station
 * @param stats The statistics
 * @returns A component which will show inbound and outbound statistics
 */
const StationStats = (stats?: StationStatistics) => {
    if(!stats) return (<></>)

    return (
        <Fragment>
            {TripsData(stats)}
            {TripsData(stats, false)}
        </Fragment>
    )
}

/**
 * Displays a stations' statistics and general information
 * @param station The station
 * @param stats The stations's statistics
 * @returns A table displaying information and statistics about a station
 */
const StationData = (station?: Station, stats?: StationStatistics, month?: number) => {
    if(!station) return (<></>)

    const s = createData(station)
    
    return (
            <Table stickyHeader sx={{width: '70%'}}>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2}><strong>Name</strong></TableCell>
                        <TableCell align='right' colSpan={3}>{s.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}><strong>Address</strong></TableCell>
                        <TableCell align='right' colSpan={3}>{s.address}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}><strong>Month</strong></TableCell>
                        <TableCell align='center' colSpan={3}>{!month ? 'total' : month}</TableCell>
                    </TableRow>
                    {StationStats(stats)}
                </TableBody>
            </Table>
    )
}

/**
 * Displays a map with a marker centered at the position of the station
 * @param station The station
 * @returns A map component showing where the station in on the map
 */
const Map = (station?: Station) => {
    if(!station) return (<><p>Could not fetch station. Please try again</p></>)

    return (
        <MapContainer center={[station.y, station.x]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[station.y, station.x]} icon={getMarker()}>
                <Popup>
                    <p>{station.address_fi}</p>
                </Popup>
            </Marker>
        </MapContainer>
    )
}

interface StationQueryParams {
    month?: number
}

/**
 * Defines a station component, which will display its information and statistics
 * @returns The station page component
 */
export default function StationPage() {

    const params = useParams()
    const queryParams = useQueryParams<StationQueryParams>({
        month: undefined
    })

    const [month, setMonth] = useState(0)

    const handleState = (newMonth: number) => {
        setMonth(newMonth)
    }

    const station = useApi<Station>({
        baseURL: `http://localhost:8080/stations/${params.id}`,
    })

    const statistics = useApi<StationStatistics>({
        baseURL: `http://localhost:8080/stations/${params.id}/stats`,
        params: queryParams.params
    })

    if(station.isLoading) {
        return (
            <Fragment>
                <CircularProgress />
            </Fragment>
        )
    }

    return (
        <Fragment>
            <Typography variant='h3' sx={{mt: 1, textAlign: 'center'}}>
                Station {params.id}
            </Typography>
            <Stack sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle'}}>
                <Grid container sx={{width: '25%'}}>
                    <Grid item>
                        <AdornedTextField 
                            id='month'
                            label='Month' 
                            onTextChange={(e) => {handleState(+e.target.value)}}
                            adornmentImage={<NumbersIcon />}
                            type={'number'}
                            value={month <= 0 ? undefined : month} 
                        />
                    </Grid>
                    <Grid item>
                        <Button variant='contained' onClick={() => {queryParams.debouncedUpdateParams({month: month})}} size='small' color='primary'>
                            Filter
                        </Button>
                    </Grid>
                </Grid>
                <Grid container>
                <Grid item md={5} sx={{mt: 2}}>
                    {Map(station.response)}
                </Grid>
                <Grid item md={7} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2}}>
                    {StationData(station.response, statistics.response, month)}
                </Grid>
            </Grid>
            </Stack>
        </Fragment>
    )
}
