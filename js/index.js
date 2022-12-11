import { foods } from "./get-food.js"

const foodToChangeInput = document.querySelector('[placeholder="Alimento para troca"]')
const gramsInput = document.querySelector('input.number-input')
const foodChoosenInput = document.querySelector('[placeholder="Alimento desejado"]')
const sectionResults = document.querySelector('section.results')
const foodToChangeInputSuggestions = document.querySelector('ul.foodToChangeSuggestions')
const foodChoosenSuggestions = document.querySelector('ul.foodChoosenSuggestions')
const button = document.querySelector('button')
const focusCarbDiv = document.querySelector('div.carb')
const focusProtDiv = document.querySelector('div.prot')
const focusKcalDiv = document.querySelector('div.kcal')
let foodToChange = {}
let foodChoosen = {}


events()
removeAllTables()

function findMatches(foodToMatch, foods) {
    //ignoring accents to find wrong digited foods
    foodToMatch = foodToMatch
    
    try {
        return foods.filter(food => {
            const regex = new RegExp(foodToMatch, 'gi')
            if (food.description.match(regex)) return food.description
        })
    }
    catch(e) {
        
    }
}

function displayMatches() {
    const matchArray = findMatches(this.value, foods)
    const sortedArray = matchArray.sort(food => {
        const regex = new RegExp(`^${this.value}`, 'gi')
        if (food.description.match(regex)) return -1
        return 1
    })

    if (sortedArray.length === 0 && this === foodToChangeInput) {
        foodToChangeInputSuggestions.innerHTML = '<li>Nenhum alimento encontrado</li>'
        return
    }
    if (sortedArray.length === 0 && this === foodChoosenInput) {
        foodChoosenSuggestions.innerHTML = '<li>Nenhum alimento encontrado</li>'
        return
    }

    if (this.value.length === 0 && this === foodToChangeInput) return deleteFirstInputLi()
    if (this.value.length === 0 && this === foodChoosenInput) return deleteSecondInputLi()

    if (this === foodToChangeInput) {
        deleteSecondInputLi()
        const html = sortedArray.map(food => {
            
            return `<li ontouchstart="handleClickFirstInput(this.innerText)", onclick="handleClickFirstInput(this.innerText)">${food.description}</li>`
        }).join('')

        foodToChangeInputSuggestions.innerHTML = html
    } else if (this === foodChoosenInput) {
        deleteFirstInputLi()
        const html = sortedArray.map(food => {
            return `<li ontouchstart="handleClickSecondInput(this.innerText)", onclick="handleClickSecondInput(this.innerText)">${food.description}</li>`
        }).join('')

        foodChoosenSuggestions.innerHTML = html
    }
}


function handleClickFirstInput(innerText, event) {
    event = event || window.event
    if (event.type !== 'click') event.preventDefault()
    
    deleteFirstInputLi()
    deleteSecondInputLi()

    const foodToChangeValue = findMatches(innerText, foods)

    foodToChange = {
        energy_kcal: foodToChangeValue[0].energy_kcal.toFixed(),
        carbohydrate_g: foodToChangeValue[0].carbohydrate_g.toFixed(),
        protein_g: foodToChangeValue[0].protein_g.toFixed(),
        lipid_g: foodToChangeValue[0].lipid_g.toFixed(),
        description: foodToChangeValue[0].description
    }

    foodToChangeInput.value = `${foodToChange.description}`
    
}

function handleClickSecondInput(innerText, event) {
    event = event || window.event
    if (event.type !== 'click') event.preventDefault()
    
    deleteFirstInputLi()
    deleteSecondInputLi()
    
    const foodChoosenValue = findMatches(innerText, foods)
    
    foodChoosen = {
        energy_kcal: foodChoosenValue[0].energy_kcal.toFixed(),
        carbohydrate_g: foodChoosenValue[0].carbohydrate_g.toFixed(),
        protein_g: foodChoosenValue[0].protein_g.toFixed(),
        lipid_g: foodChoosenValue[0].lipid_g.toFixed(),
        description: foodChoosenValue[0].description
    }

    foodChoosenInput.value = `${foodChoosen.description}`
}

function handleClickChange(event) {
    event = event || window.event
    if (event.type !== 'click') event.preventDefault()

    foodExchange()
}

function events() {
    button.addEventListener('click', handleClickChange)
    button.addEventListener('touchstart', handleClickChange)
    window.handleClickFirstInput = (innerText) => handleClickFirstInput(innerText)
    window.handleClickSecondInput = (innerText) => handleClickSecondInput(innerText)

    foodToChangeInput.addEventListener('change', displayMatches)
    foodToChangeInput.addEventListener('keyup', displayMatches)
    foodToChangeInput.addEventListener('change', deleteSecondInputLi)
    foodToChangeInput.addEventListener('keyup', deleteSecondInputLi)
    
    gramsInput.addEventListener('focus', deleteFirstInputLi)
    gramsInput.addEventListener('focus', deleteSecondInputLi)
    
    foodChoosenInput.addEventListener('change', displayMatches)
    foodChoosenInput.addEventListener('keyup', displayMatches)
    foodChoosenInput.addEventListener('change', deleteFirstInputLi)
    foodChoosenInput.addEventListener('keyup', deleteFirstInputLi)

    focusCarbDiv.addEventListener('click', focusCarb)
    focusProtDiv.addEventListener('click', focusProt)
    focusKcalDiv.addEventListener('click', focusKcal)
    focusCarbDiv.addEventListener('touchstart', focusCarb)
    focusProtDiv.addEventListener('touchstart', focusProt)
    focusKcalDiv.addEventListener('touchstart', focusKcal)
}

function deleteFirstInputLi() {
    foodToChangeInputSuggestions.innerHTML = ''
}

function deleteSecondInputLi() {
    foodChoosenSuggestions.innerHTML = ''
}

function foodExchange() {

    if (foodToChangeInput.value === "" || foodChoosenInput.value === "" || gramsInput.value === "" || gramsInput.value === 0) {
        emptyInputErrorModal()
        return
    }
    if (focusProtDiv.classList[1] === undefined && focusCarbDiv.classList[1] === undefined && focusKcalDiv.classList[1] === undefined) {
        noPriorityChosenErrorModal()
        return
    }
    //food 1
    const foodToChangeGrams = Number(gramsInput.value)

    const foodToChangeRecalc = {
        energy_kcal: (foodToChangeGrams * foodToChange.energy_kcal / 100).toFixed(2),
        carbohydrate_g: (foodToChangeGrams * foodToChange.carbohydrate_g / 100).toFixed(1),
        protein_g: (foodToChangeGrams * foodToChange.protein_g / 100).toFixed(1),
        lipid_g: (foodToChangeGrams * foodToChange.lipid_g / 100).toFixed(1)
    }

    if (focusProtDiv.classList[1] === 'active') {
        const necessaryProtein = (foodToChangeGrams * foodToChange.protein_g / 100).toFixed()
        const gramsNeedToAchieveThisProtein = (necessaryProtein / foodChoosen.protein_g * 100).toFixed()

        const foodChoosenRecalc = {
            energy_kcal: (gramsNeedToAchieveThisProtein * foodChoosen.energy_kcal / 100).toFixed(2),
            carbohydrate_g: (gramsNeedToAchieveThisProtein * foodChoosen.carbohydrate_g / 100).toFixed(1),
            protein_g: (gramsNeedToAchieveThisProtein * foodChoosen.protein_g / 100).toFixed(1),
            lipid_g: (gramsNeedToAchieveThisProtein * foodChoosen.lipid_g / 100).toFixed(1)
        }

        displayExchange(foodToChangeRecalc, foodChoosenRecalc, foodToChangeGrams, gramsNeedToAchieveThisProtein)
    }
    if (focusCarbDiv.classList[1] === 'active') {
        const necessaryCarb = (foodToChangeGrams * foodToChange.carbohydrate_g / 100).toFixed()
        const gramsNeedToAchieveThisCarb = (necessaryCarb / foodChoosen.carbohydrate_g * 100).toFixed()

        const foodChoosenRecalc = {
            energy_kcal: (gramsNeedToAchieveThisCarb * foodChoosen.energy_kcal / 100).toFixed(2),
            carbohydrate_g: (gramsNeedToAchieveThisCarb * foodChoosen.carbohydrate_g / 100).toFixed(1),
            protein_g: (gramsNeedToAchieveThisCarb * foodChoosen.protein_g / 100).toFixed(1),
            lipid_g: (gramsNeedToAchieveThisCarb * foodChoosen.lipid_g / 100).toFixed(1)
        }

        displayExchange(foodToChangeRecalc, foodChoosenRecalc, foodToChangeGrams, gramsNeedToAchieveThisCarb)
    }
    if (focusKcalDiv.classList[1] === 'active') {
        const necessaryKcal = (foodToChangeGrams * foodToChange.energy_kcal / 100).toFixed()
        const gramsNeedToAchieveThisKcal = (necessaryKcal / foodChoosen.energy_kcal * 100).toFixed()

        const foodChoosenRecalc = {
            energy_kcal: (gramsNeedToAchieveThisKcal * foodChoosen.energy_kcal / 100).toFixed(2),
            carbohydrate_g: (gramsNeedToAchieveThisKcal * foodChoosen.carbohydrate_g / 100).toFixed(1),
            protein_g: (gramsNeedToAchieveThisKcal * foodChoosen.protein_g / 100).toFixed(1),
            lipid_g: (gramsNeedToAchieveThisKcal * foodChoosen.lipid_g / 100).toFixed(1)
        }

        displayExchange(foodToChangeRecalc, foodChoosenRecalc, foodToChangeGrams, gramsNeedToAchieveThisKcal)
    }
}

function focusCarb(event) {
    event = event || window.event
    if (event.type !== 'click') event.preventDefault()

    focusCarbDiv.classList.toggle('active')
    focusProtDiv.classList.remove('active')
    focusKcalDiv.classList.remove('active')
}

function focusProt(event) {
    event = event || window.event
    if (event.type !== 'click') event.preventDefault()

    focusProtDiv.classList.toggle('active')
    focusCarbDiv.classList.remove('active')
    focusKcalDiv.classList.remove('active')
}

function focusKcal(event) {
    event = event || window.event
    if (event.type !== 'click') event.preventDefault()

    focusKcalDiv.classList.toggle('active')
    focusProtDiv.classList.remove('active')
    focusCarbDiv.classList.remove('active')
}

function noPriorityChosenErrorModal() {
    document.querySelector('.noPriorityChosenErrorModal').classList.add('active')
    setTimeout(() => document.querySelector('.noPriorityChosenErrorModal').classList.remove('active'), 3000)
}

function emptyInputErrorModal() {
    document.querySelector('.emptyInputErrorModal').classList.add('active')
    setTimeout(() => document.querySelector('.emptyInputErrorModal').classList.remove('active'), 3000)
}

function displayExchange(food1, food2, food1Grams, food2Grams) {
    sectionResults.classList.add('active');

    sectionResults.innerHTML = `
        <div class="tables">
            <div class="close">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.96585 3.56633L21.4016 21.7802Z" fill="#FF0000"/>
                    <path d="M3.96585 3.56633L21.4016 21.7802" stroke="#FF0000" stroke-width="3.23162" stroke-linecap="round"/>
                    <path d="M3.96585 21.7802L21.4016 3.56633Z" fill="#FF0000"/>
                    <path d="M3.96585 21.7802L21.4016 3.56633" stroke="#FF0000" stroke-width="3.23162" stroke-linecap="round"/>
                </svg>                        
            </div>
            <table>
                    <caption>${food1Grams}g de ${foodToChange.description}</caption>
                    <colgroup>
                        <col class="firstColumn">
                        <col class="secondColumn">
                        <col class="thirdColumn">
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Prot</th>
                            <th>Carb</th>
                            <th>Gordura</th>
                        </tr>
            
                        <tr>
                            <td>${food1.protein_g}</td>
                            <td>${food1.carbohydrate_g}</td>
                            <td>${food1.lipid_g}</td>
                        </tr>
            
                        <tr>
                            <td colspan="4">Calorias: ${food1.energy_kcal}</td>
                        </tr>
                    </thead>   
                </table>

                <div class="exchangeSvg">
                    <svg width="173" height="177" viewBox="0 0 173 177" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M62.8494 16.3873C62.8446 16.3223 62.8439 16.2577 62.8376 16.193C62.82 16.016 62.7889 15.8397 62.7592 15.6631C62.7446 15.5773 62.735 15.4916 62.7173 15.4062C62.688 15.262 62.6472 15.1186 62.6095 14.9751C62.5791 14.8576 62.5521 14.7397 62.5161 14.6239C62.4798 14.5081 62.4345 14.3933 62.3927 14.2778C62.3419 14.1378 62.2928 13.9975 62.2344 13.8599C62.2244 13.8364 62.2178 13.8115 62.2071 13.7876C62.1684 13.6991 62.1206 13.6182 62.0795 13.5311C62.0166 13.3997 61.9551 13.2684 61.8849 13.1401C61.8157 13.0146 61.74 12.8957 61.666 12.7743C61.6176 12.6959 61.5758 12.615 61.5243 12.5382C61.5081 12.514 61.489 12.4926 61.4724 12.4684C61.3819 12.336 61.284 12.2098 61.1872 12.084C61.1243 12.0024 61.0635 11.9198 60.9974 11.8409C60.8906 11.7137 60.7779 11.5938 60.6638 11.4735C60.5968 11.4026 60.5318 11.3303 60.4626 11.2626C60.3458 11.1485 60.2241 11.042 60.101 10.9359C60.0243 10.8699 59.9503 10.8017 59.8715 10.7385C59.7512 10.6424 59.6274 10.5535 59.5026 10.465C59.4124 10.4011 59.3246 10.3354 59.2323 10.2752C59.1127 10.1968 58.9892 10.1266 58.8655 10.0554C58.7621 9.99521 58.6594 9.93368 58.5533 9.87837C58.4326 9.81545 58.3082 9.76048 58.1844 9.70344C58.0714 9.65158 57.959 9.59731 57.8439 9.55064C57.7153 9.49878 57.5843 9.45557 57.4529 9.41028C57.3388 9.37122 57.2254 9.32869 57.1089 9.29447C56.9603 9.25056 56.8092 9.21668 56.6575 9.18073C56.5728 9.16103 56.4894 9.13406 56.4034 9.11678L56.2855 9.09327C56.2844 9.09327 56.2844 9.09327 56.2837 9.09327L11.3475 0.15607C6.98811 -0.710615 2.7539 2.11968 1.88721 6.47765C1.02052 10.8356 3.85013 15.0712 8.20879 15.9379L32.8742 20.8438C12.4268 36.9178 0 61.7111 0 88.5016C0 122.71 20.2587 153.667 51.6112 167.366C52.6597 167.824 53.7525 168.041 54.8283 168.041C57.929 168.041 60.8837 166.238 62.205 163.215C63.984 159.144 62.1262 154.4 58.0541 152.621C32.5631 141.483 16.0916 116.314 16.0916 88.502C16.0916 66.4501 26.4531 46.0686 43.4487 33.0161L37.9827 60.496C37.1161 64.8539 39.9457 69.0895 44.3043 69.9562C44.8336 70.0613 45.3622 70.1121 45.8818 70.1121C49.642 70.1121 53.0026 67.463 53.7642 63.6346L62.7263 18.5777C62.7294 18.5611 62.7305 18.5438 62.7339 18.5279C62.7671 18.3568 62.7885 18.184 62.8107 18.0108C62.8214 17.9261 62.8369 17.8417 62.8449 17.7567C62.8625 17.5648 62.8684 17.3709 62.8729 17.1773C62.8746 17.1109 62.8809 17.0442 62.8805 16.9778C62.8784 16.7818 62.8643 16.5847 62.8494 16.3873Z" fill="url(#paint0_linear_133_3)"/>
                        <path d="M172.055 88.5016C172.055 54.2933 151.796 23.3374 120.444 9.63707C116.373 7.85841 111.63 9.71658 109.851 13.788C108.072 17.8593 109.93 22.6024 114.001 24.3821C139.492 35.5211 155.964 60.6899 155.964 88.5023C155.964 110.552 145.605 130.932 128.612 143.984L134.078 116.506C134.945 112.148 132.115 107.912 127.757 107.045C123.398 106.176 119.164 109.008 118.296 113.366L109.333 158.423C109.33 158.44 109.329 158.456 109.326 158.473C109.292 158.645 109.27 158.82 109.248 158.995C109.237 159.078 109.222 159.16 109.214 159.243C109.196 159.438 109.19 159.633 109.186 159.829C109.185 159.893 109.178 159.958 109.179 160.022C109.18 160.221 109.193 160.421 109.209 160.62C109.214 160.683 109.214 160.746 109.22 160.807C109.238 160.987 109.27 161.166 109.3 161.346C109.314 161.429 109.323 161.512 109.34 161.594C109.37 161.742 109.412 161.888 109.451 162.035C109.481 162.149 109.506 162.264 109.542 162.376C109.578 162.496 109.625 162.614 109.669 162.733C109.718 162.869 109.766 163.005 109.823 163.138C109.833 163.163 109.84 163.189 109.851 163.213C109.936 163.407 110.027 163.595 110.124 163.778C110.125 163.779 110.125 163.78 110.126 163.781C110.243 164 110.37 164.209 110.505 164.413C110.515 164.429 110.523 164.446 110.534 164.462C110.55 164.486 110.569 164.508 110.586 164.532C110.707 164.71 110.834 164.881 110.968 165.047C110.99 165.074 111.011 165.102 111.034 165.129C111.354 165.514 111.704 165.864 112.083 166.178C112.117 166.206 112.151 166.233 112.185 166.26C112.348 166.391 112.514 166.514 112.685 166.631C112.719 166.655 112.754 166.68 112.789 166.703C112.99 166.835 113.196 166.96 113.408 167.073C113.438 167.09 113.47 167.104 113.502 167.121C113.68 167.213 113.861 167.299 114.046 167.379C114.109 167.406 114.173 167.432 114.237 167.457C114.419 167.53 114.604 167.597 114.793 167.657C114.831 167.669 114.87 167.684 114.909 167.696C115.139 167.765 115.372 167.822 115.608 167.871C115.624 167.874 115.639 167.88 115.655 167.883L160.712 176.844C161.241 176.949 161.77 177 162.29 177C166.05 177 169.411 174.351 170.172 170.523C171.039 166.165 168.209 161.929 163.851 161.062L139.182 156.156C159.629 140.083 172.055 115.291 172.055 88.5016Z" fill="url(#paint1_linear_133_3)"/>
                        <defs>
                        <linearGradient id="paint0_linear_133_3" x1="31.4403" y1="0" x2="31.4403" y2="168.041" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#EB7B13"/>
                        <stop offset="1" stop-color="#EC583C"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_133_3" x1="140.615" y1="8.96218" x2="140.615" y2="177" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#EB7B13"/>
                        <stop offset="1" stop-color="#EC583C"/>
                        </linearGradient>
                        </defs>
                    </svg>
                </div>

                <table>
                    <caption>${food2Grams}g de ${foodChoosen.description}</caption>
                    <colgroup>
                        <col class="firstColumn">
                        <col class="secondColumn">
                        <col class="thirdColumn">
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Prot</th>
                            <th>Carb</th>
                            <th>Gordura</th>
                        </tr>
            
                        <tr>
                            <td>${food2.protein_g}</td>
                            <td>${food2.carbohydrate_g}</td>
                            <td>${food2.lipid_g}</td>
                        </tr>
            
                        <tr>
                            <td colspan="4">Calorias: ${food2.energy_kcal}</td>
                        </tr>
                    </thead>   
                </table>
            </div>
    `
    const closeBtn = document.querySelector('.close')
    closeBtn.addEventListener('click', closeResultModal)
    closeBtn.addEventListener('touchstart', closeResultModal)
}

function removeAllTables() {
    sectionResults.innerHTML = ""
}

function closeResultModal(event) {
    console.log('oi')
    event = event || window.event
    if (event.type !== 'click') event.preventDefault()

    sectionResults.classList.remove('active')
}