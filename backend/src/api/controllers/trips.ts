import {BaseController} from './base'
import {trips} from '../../models/trips'
import {AppDataSource} from '../../database'
import {Request, Response} from 'express'
import {TripParameters} from '../../models/parameters/trip'
import {TripsPage} from '../../models/page'

export class TripsController extends BaseController<trips> {
    constructor() {
        super(AppDataSource.getRepository('trips'))
    }

    /**
     * Returns the total amount of trips
     */
    getTripCount = async () => {
        return await this.repository
            .createQueryBuilder('getTripCount')
            .cache(true)
            .getCount()
    }

    /**
     * Returns a list containing all station ids
     */
    getStationIds = async () => {
        return (await AppDataSource.getRepository('stations')
            .createQueryBuilder('getStationIds')
            .select('ID')
            .cache(true)
            .getRawMany()).map(data => data.id)
    }

    /**
     * Returns all trips from the database.
     *
     * The trips are fetched using pagination, using the **required** query parameters `page` and `perPage`.
     *
     * The trips can be searched and filtered.
     */
    getTrips = () => {
        return async (req: Request, res: Response) => {
            const parameters = new TripParameters(
                req.query.page as number | undefined,
                req.query.perPage as number | undefined,
                parseInt(req.query.departure as string),
                parseInt(req.query.return as string),
                parseFloat(req.query.distance as string),
                parseFloat(req.query.duration as string),
                req.query.departureTime ? new Date(req.query.departureTime as string) : undefined,
                req.query.returnTime ? new Date(req.query.returnTime as string) : undefined,
            )


            const tripsCount = await this.getTripCount()
            const stationIds: number[] = await this.getStationIds()

            const builder = this.repository.createQueryBuilder('getAllStations').cache(true)

            switch (this.paginate<trips>(req, res, parameters, builder, tripsCount)) {
            case -1:
                return this.badParameterError(req, res, 'page', parameters.page, '>= 1')
            case -2:
                return this.badParameterError(req, res, 'perPage', parameters.perPage, `1 <= perPage <= ${tripsCount}`)
            default:
                break
            }

            builder.innerJoinAndSelect('getAllStations.departure_station', 'departureStation')
            builder.innerJoinAndSelect('getAllStations.return_station', 'returnStation')

            if (parameters.distance) {
                if (parameters.distance < 0)
                    return this.badParameterError(req, res, 'distance', parameters.distance, '>= 0')
                builder.andWhere('distance = :distance',
                    {distance: parameters.distance})
            }

            if (parameters.duration) {
                if (parameters.duration < 0)
                    return this.badParameterError(req, res, 'duration', parameters.duration, '>= 0')
                builder.andWhere('duration = :duration',
                    {duration: parameters.duration})
            }

            if (parameters.departure) {
                if (!stationIds.includes(parameters.departure))
                    return this.badParameterError(req, res, 'departure', parameters.departure, 'that the referenced station exists')
                builder.andWhere('departure_station = :departure_station',
                    {departure_station: parameters.departure})
            }

            if (parameters.return) {
                if (!stationIds.includes(parameters.return))
                    return this.badParameterError(req, res, 'return', parameters.return, 'that the referenced station exists')
                builder.andWhere('return_station = :return_station',
                    {return_station: parameters.return})
            }

            if(parameters.departureTime) {
                builder.andWhere('departure_time >= :departure_time', {departure_time: parameters.departureTime})
            }

            if(parameters.returnTime) {
                builder.andWhere('return_time <= :return_time', {return_time: parameters.returnTime})
            }

            const response = await builder.getManyAndCount()

            this.sendResult(res, new TripsPage(
                response[0],
                parameters.page as number,
                parameters.perPage as number,
                response[1]
            ))

        }
    }

}

/**
 * This is a workaround for swagger-express, because it needs that the name of the method is exactly the same that's
 * written in the `operationId` field in the .yaml files.
 */
const tripsController = new TripsController()

export const getTrips = tripsController.getTrips()