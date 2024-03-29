
import { Fragment } from 'react'
import useApi from '../../hooks/Api'
import useQueryParams from '../../hooks/Params'
import { StationPage } from '../../models/Page'
import StationsTable from './StationsTable'
import './Stations.scss'
import StationsFilterForm from '../form/StationsFilterForm'
import { StationsParams } from '../../models/Params'
import { CircularProgress, Stack, Typography } from '@mui/material'

/**
 * Defines a station page component, which will display the paginated data and the filtering form
 * @returns The station page component
 */
function Stations() {
    const {params, debouncedUpdateParams, clearParams} = useQueryParams<StationsParams>({
        page: 0,
        perPage: 10,
        name: '',
        address: '',
        city: '',
        operator: '',
        capacity: undefined
    })
    const {response, error, isLoading} = useApi<StationPage>({
        baseURL: `http://localhost:8080/stations`,
        params: params
    })


    console.log(response, error, isLoading)

    if(error && !response) {
        return (
            <Fragment>
                <Typography variant='h6'>An error occured. Please try reloading the page</Typography>
            </Fragment>
        )
    }
    else if(isLoading) {
        return (
            <Fragment>
                <CircularProgress />
            </Fragment>
        )
    }

    return (
        <Fragment>
            <Stack sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography variant='h2' className='title'>Bike stations</Typography>
                <StationsFilterForm params={params} updateParams={debouncedUpdateParams} clearParams={clearParams} key='form'/><br />
                <StationsTable
                    key='stations-table'
                    stations={response}
                    params={params as Required<StationsParams>}
                    updateParams={debouncedUpdateParams} />
            </Stack>
        </Fragment>
    )
}

export default Stations