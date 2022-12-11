export const foods = []

const endpoint = 'https://raw.githubusercontent.com/danperrout/tabelataco/master/public/TACO.json'

fetch(endpoint)
.then(data => data.json())
.then(data => foods.push(...data))