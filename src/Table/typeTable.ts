export interface ICountryTable {
    name: IName
    region: string
    population: number
    area: number
    flags: string[]
}

interface IName {
    common: string
}
