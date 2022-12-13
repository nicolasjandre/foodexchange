export const foods = []

const endpoint = 'https://raw.githubusercontent.com/danperrout/tabelataco/master/public/TACO.json'

async function getFoods() {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    data.forEach(food => food.description = food.description.replace(new RegExp(",", "g"), ''))
    foods.push(...data);
  } catch (error) {
    console.error(error);
  }
}

getFoods();