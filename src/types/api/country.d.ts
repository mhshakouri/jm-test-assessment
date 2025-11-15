import { Currency } from "./currency"
import { Flag } from "./flag"
import { Language } from "./language"
import { Region } from "./regions"


interface Country {
    name: string
    nativeName: string
    population: number | 'N/A'
    region: Lowercase<Region>
    subregion: string
    capital: string
    flags: Flag
    topLevelDomain: string[]
    currencies: Currency[]
    languages: Language[]
    borders: string[]
    alpha3Code: string
    needFullDetails: boolean
}

export type {
    Country,
}