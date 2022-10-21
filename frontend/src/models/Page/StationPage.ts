import { stations } from "../Station"

export interface StationPage {
    page: number
    perPage: number
    total: number
    data: stations[]
}