/**
 * Models a station contained in the database
 */
 export interface stations {
    id: number
    name_fi: string
    name_se: string
    name_en: string
    address_fi: string
    address_se: string
    city_fi: string | undefined
    city_se: string | undefined
    operator: string | undefined
    capacity: number | undefined
    x: number
    y: number
}