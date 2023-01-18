import axios from "axios"
import * as cheerio from "cheerio"

async function main() {

    const BASE_URL = 'https://www.ufc.com.br'
    const FUTURE_EVENTS_SELECTOR = '.l-listing__group:nth-child(1) > li' 
    const PASTED_EVENTS_SELECTOR = '.l-listing__group:nth-child(2) > li' 

    const html = await axios.get(`${BASE_URL}/events`)
    const $ = cheerio.load(html.data)

    const upAndComingEventsList = $('.l-listing__group').get(0)
    const pastEventsList = $('.l-listing__group').get(1)

    const pastEventsLinks = $(pastEventsList).find('h3').find('a').map((i, element) => $(element).attr('href')).toArray()

    const [ lastPPV ] = getLastPPVAndFightNight(pastEventsLinks)

    const links = $('.l-listing__group:nth-child(1) > li ').map((i, element) => {
        const event = $(element)
        const link = event.find('h3').find('a')
        return link.attr('href') 
    })

    const fightNights = links.toArray().filter(link => link.includes('night')).filter(link => link.split('-'))
    const PPVs = links.toArray().filter(link => !link.includes('night')).filter(ppv => Number(ppv.replace(/\D/g, '')) > lastPPV)

    return lastPPV

}

function getLastPPVAndFightNight(allFights: Array<string>) {
    const PPVs = allFights.filter(link => !link.includes('night'))
    const fightNights = allFights.filter(link => link.includes('night'))

    const [ lastPPV ] = PPVs.map(link => Number(link.replace(/\D/g, ''))).sort().reverse()
    const lastFightNight = fightNights.map(getDateFromFightNightSlug).sort()

    return [lastPPV, fightNights]
}

function getDateFromFightNightSlug(fullLink: string) {
    const [year, day, month] = fullLink.split('-').reverse()

    const MONTH_TO_NUMBER_MAP = {
        "january": 1,
        "february": 2,
        "march": 3,
        "april": 4,
        "may": 5,
        "june": 6,
        "july": 7,
        "august": 8,
        "september": 9,
        "october": 10,
        "november": 11,
        "december": 12
    }

    const formatedMonth = MONTH_TO_NUMBER_MAP[month]

    return new Date(year, formatedMonth, day)

}

main().then(console.log)