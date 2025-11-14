import { Currency } from "./currency"
import { Flag } from "./flag"
import { Language } from "./language"
import { Region } from "./regions"


interface Country {
    name: string
    capital: string
    population: number
    region: Region
    flags: Flag
    independent: boolean
}

interface CountryDetails {
    name: string
    nativeName: string
    population: number
    region: Region
    subregion: string
    capital: string
    flags: Flag
    topLevelDomain: string[]
    currencies: Currency[]
    languages: Language[]
    borders: string[]
}

export type {
    Country,
    CountryDetails
}