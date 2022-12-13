import { foods } from "./get-food.js"
import { utilities } from "./utilities.js"
import { declared } from "./const-vars.js"
import { exchange } from "./exchange.js"

const Utilities = utilities()
const Exchange = exchange()

export function matches() {
    function findMatches(foodToMatch, foods) {
        try {
            return foods.filter(food => {
                const regex = new RegExp(foodToMatch, 'gi')
                if (food.description.match(regex)) return food.description
            })
        }
        catch(e) {
            console.error(e)
        }
    }

    function displayMatches() {
        const matchArray = findMatches(this.value, foods)
        const sortedArray = matchArray.sort(food => {
            const regex = new RegExp(`^${this.value}`, 'gi')
            if (food.description.match(regex)) return -1
            return 1
        })
    
        if (sortedArray.length === 0 && this === declared.foodToChangeInput) {
            declared.foodToChangeInputSuggestions.innerHTML = '<li>Nenhum alimento encontrado</li>'
            return
        }
        if (sortedArray.length === 0 && this === declared.foodChoosenInput) {
            declared.foodChoosenSuggestions.innerHTML = '<li>Nenhum alimento encontrado</li>'
            return
        }
    
        if (this.value.length === 0 && this === declared.foodToChangeInput) return Utilities.deleteFirstInputListSuggestion()
        if (this.value.length === 0 && this === declared.foodChoosenInput) return Utilities.deleteSecondInputListSuggestion()
    
        if (this === declared.foodToChangeInput) {
            Utilities.deleteSecondInputListSuggestion()
          
            const html = sortedArray.map(food => {
              const li = document.createElement('li')
              li.innerText = food.description
              li.addEventListener('click', event => Exchange.handleClickFirstInputListSuggestions(event.target.innerText))
              
              return li
            })
            declared.foodToChangeInputSuggestions.replaceChildren(...html)
        } else if (this === declared.foodChoosenInput) {
            Utilities.deleteFirstInputListSuggestion()

            const html = sortedArray.map(food => {
                const li = document.createElement('li')
                li.innerText = food.description
                li.addEventListener('click', event => Exchange.handleClickSecondInputListSuggestions(event.target.innerText))

                return li
            })
            declared.foodChoosenSuggestions.replaceChildren(...html)
        }
    }

    return {
        findMatches,
        displayMatches
    }
}
