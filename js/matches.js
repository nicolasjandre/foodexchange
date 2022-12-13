import { foods } from "./get-food.js"
import { utilities } from "./utilities.js"
import { declared } from "./const-vars.js"

const Utilities = utilities()

export function matches() {
    function findMatches(foodToMatch, foods) {
        foodToMatch = foodToMatch
        
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
        if (this.value.length === 0 && this === declared.foodChoosenInput) return Utilities.deleteSecondInputListSuggdeleteFirstInputListSuggestion()
    
        if (this === declared.foodToChangeInput) {
            Utilities.deleteSecondInputListSuggestion()
            const html = sortedArray.map(food => {
                
                return `<li onclick="handleClickFirstInputListSuggestions(this.innerText)">${food.description}</li>`
            }).join('')
    
            declared.foodToChangeInputSuggestions.innerHTML = html
        } else if (this === declared.foodChoosenInput) {
            Utilities.deleteFirstInputListSuggestion()
            const html = sortedArray.map(food => {
                return `<li onclick="handleClickSecondInputListSuggestions(this.innerText)">${food.description}</li>`
            }).join('')
    
            declared.foodChoosenSuggestions.innerHTML = html
        }
    }

    return {
        findMatches,
        displayMatches
    }
}
