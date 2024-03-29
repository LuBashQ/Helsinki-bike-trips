import '../base'
import {IError} from '../../src/models/errors'
import {BaseTestInstance, page, perPage, testPagination} from '../base'
import {TripsPage} from '../../src/models/page'
import {TripParameters} from '../../src/models/parameters/trip'
import {AppDataSource} from '../../src/database'

/**
 * Defines the test instance for Trips model
 */
class TripsTestInstance extends BaseTestInstance {
    /**
   * Constructs a new test instance
   */
    constructor() {
        super('trips', '/trips')
    }
}

const testInstance = new TripsTestInstance()

beforeAll(async () => {
    await AppDataSource.initialize()
})

afterAll(async () => {
    await AppDataSource.destroy()
})

describe('Trips', () => {
    testPagination(testInstance)

    test('Should return a list of trips satisfying distance parameter',
        async () => {
            const parameters: TripParameters = {
                distance: 4.604,
                page: page,
                perPage: perPage,
            }

            const {response} = await testInstance.
                makeRequestWithParameters(undefined, parameters)
            expect(response.statusCode).toEqual(200)

            const stations: TripsPage = response.body
            expect(stations.data.length).toBeGreaterThan(0)
            stations.data.forEach((s) => expect(s.distance).toEqual(4604))
        })

    test('Should return a 400 bad parameter error when distance query parameter is out of bounds',
        async () => {
            const parameters: TripParameters = {
                distance: -1,
                page: page,
                perPage: perPage,
            }
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters)
            expect(response.statusCode).toBe(400)

            testInstance.verifyBadParameter(response.body as IError, 'distance', (parameters.distance as number) * 1000,
                '>= 0', fullUrl, response.statusCode)
        })

    test('Should return a list of station satisfying duration parameter', async () => {
        const parameters: TripParameters = {
            duration: 18.9,
            page: page,
            perPage: perPage,
        }

        const {response} = await testInstance.makeRequestWithParameters(undefined, parameters)
        expect(response.statusCode).toEqual(200)

        const stations: TripsPage = response.body
        expect(stations.data.length).toBeGreaterThan(0)
        stations.data.forEach((s) => expect(s.duration).toEqual(18.9 * 60))
    })

    test('Should return a 400 bad parameter error when distance query parameter is out of bounds',
        async () => {
            const parameters: TripParameters = {
                duration: -1,
                page: page,
                perPage: perPage,
            }
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters)
            expect(response.statusCode).toBe(400)

            testInstance.verifyBadParameter(response.body as IError, 'duration', (parameters.duration as number) * 60,
                '>= 0', fullUrl, response.statusCode)
        })

    test('Should return a list of station satisfying departure parameter', async () => {
        const parameters: TripParameters = {
            departure: 501,
            page: page,
            perPage: perPage,
        }
        const {response} = await testInstance.makeRequestWithParameters(undefined, parameters)
        expect(response.statusCode).toEqual(200)

        const stations: TripsPage = response.body
        expect(stations.data.length).toBeGreaterThan(0)
        stations.data.forEach((s) => expect(s.departure_station.id).toEqual(501))
    })

    test('Should return a 400 bad parameter error when departure query parameter is not a valid station id',
        async () => {
            const parameters: TripParameters = {
                departure: 99999,
                page: page,
                perPage: perPage,
            }
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters)
            expect(response.statusCode).toEqual(400)

            testInstance.verifyBadParameter(response.body as IError, 'departure', parameters.departure,
                'that the referenced station exists', fullUrl, response.statusCode)
        })

    test('Should return a list of station satisfying return parameter', async () => {
        const parameters: TripParameters = {
            return: 501,
            page: page,
            perPage: perPage,
        }
        const {response} = await testInstance.makeRequestWithParameters(undefined, parameters)
        expect(response.statusCode).toEqual(200)

        const stations: TripsPage = response.body
        expect(stations.data.length).toBeGreaterThan(0)
        stations.data.forEach((s) => expect(s.return_station.id).toEqual(501))
    })

    test('Should return a 400 bad parameter error when return query parameter is not a valid station id',
        async () => {
            const parameters: TripParameters = {
                return: 99999,
                page: page,
                perPage: perPage,
            }
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters)
            expect(response.statusCode).toEqual(400)

            testInstance.verifyBadParameter(response.body as IError, 'return', parameters.return,
                'that the referenced station exists', fullUrl, response.statusCode)
        })
    
    test('Should return a list of stations with departure time starting from a valid value',
        async () => {
            const parameters: TripParameters = {
                page: page,
                perPage: perPage,
                departureTime: new Date(2021, 5, 1, 0, 0, 0)
            }
            const {response} = await testInstance.makeRequestWithParameters(undefined, parameters)
            expect(response.statusCode).toEqual(200)
            const trips: TripsPage = response.body

            expect(trips.data.length).toBeGreaterThan(0)
            trips.data.forEach(trip => expect(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                Date.parse(trip.departure_time.toString())).toBeGreaterThanOrEqual(Date.parse(parameters.departureTime!.toString())))

        })
    
    test('Should return a list of stations with return time at most a valid value',
        async () => {
            const parameters: TripParameters = {
                page: page,
                perPage: perPage,
                returnTime: new Date(2021, 6, 31, 0, 0, 0)
            }
            const {response} = await testInstance.makeRequestWithParameters(undefined, parameters)
            expect(response.statusCode).toEqual(200)
            const trips: TripsPage = response.body

            expect(trips.data.length).toBeGreaterThan(0)
            trips.data.forEach(trip => expect(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                Date.parse(trip.departure_time.toString())).toBeGreaterThanOrEqual(Date.parse(parameters.departureTime!.toString())))
        })
})
