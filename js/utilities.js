import { declared } from "./const-vars.js"
import { matches } from "./matches.js"
import { exchange } from "./exchange.js"

const Matches = matches()
const Exchange = exchange()

export function utilities() {

    function events() {
        removeAllTables()

        declared.button.addEventListener('click', Exchange.handleClickExchangeButton)
        declared.button.addEventListener('touchstart', Exchange.handleClickExchangeButton)
        
        declared.foodChoosenInput.addEventListener('keyup', Matches.displayMatches)
        
        declared.foodToChangeInput.addEventListener('keyup', Matches.displayMatches)
    
        declared.foodToChangeInput.addEventListener('change', utilities.deleteSecondInputListSuggestion)
        declared.foodToChangeInput.addEventListener('keyup', utilities.deleteSecondInputListSuggestion)
        
        declared.gramsInput.addEventListener('focus', utilities.deleteFirstInputListSuggestion)
        declared.gramsInput.addEventListener('focus', utilities.deleteSecondInputListSuggestion)
        
        declared.foodChoosenInput.addEventListener('change', utilities.deleteFirstInputListSuggestion)
        declared.foodChoosenInput.addEventListener('keyup', utilities.deleteFirstInputListSuggestion)
    
        declared.focusCarbDiv.addEventListener('click', Exchange.handleClickFocusCarb)
        declared.focusProtDiv.addEventListener('click', Exchange.handleClickFocusProt)
        declared.focusKcalDiv.addEventListener('click', Exchange.handleClickFocusKcal)
        declared.focusCarbDiv.addEventListener('touchstart', Exchange.handleClickFocusCarb)
        declared.focusProtDiv.addEventListener('touchstart', Exchange.handleClickFocusProt)
        declared.focusKcalDiv.addEventListener('touchstart', Exchange.handleClickFocusKcal)
    }
    
    function removeAllTables() {
        declared.sectionResults.innerHTML = ""
    }

    function closeResultModal(event) {
        event = event || window.event
        if (event.type !== 'click') event.preventDefault()
    
        declared.sectionResults.classList.remove('active')
        document.querySelector('body').style.overflow = "auto"
    }

    function noPriorityChosenErrorModal() {
        document.querySelector('.noPriorityChosenErrorModal').classList.add('active')
        setTimeout(() => document.querySelector('.noPriorityChosenErrorModal').classList.remove('active'), 3000)
    }
    
    function emptyInputErrorModal() {
        document.querySelector('.emptyInputErrorModal').classList.add('active')
        setTimeout(() => document.querySelector('.emptyInputErrorModal').classList.remove('active'), 3000)
    }

    function deleteFirstInputListSuggestion() {
        declared.foodToChangeInputSuggestions.innerHTML = ''
    }
    
    function deleteSecondInputListSuggestion() {
        declared.foodChoosenSuggestions.innerHTML = ''
    }

    return {
        events,
        removeAllTables,
        closeResultModal,
        noPriorityChosenErrorModal,
        emptyInputErrorModal,
        deleteFirstInputListSuggestion,
        deleteSecondInputListSuggestion
    }
}