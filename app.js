
const workButtonElement = document.getElementById("workButton")
const bankButtonElement = document.getElementById("bankButton")
const workBalanceText = document.getElementById("workBalance")
const buyButtonElement = document.getElementById("buyButton")

const bankBalanceText = document.getElementById("bankBalance")
const loanAmountText = document.getElementById("loanAmount")
const loanButtonElement = document.getElementById("loanButton")
const repayButtonElement = document.getElementById("repayButton")
const remainingLoanText = document.getElementById("loanTitle")

const laptopSelectElement = document.getElementById("laptops")
const laptopTitleText = document.getElementById("laptopTitle")
const laptopDescriptionText = document.getElementById("laptopDescription")
const laptopPriceText = document.getElementById("laptopPrice")
const laptopSpecsText = document.getElementById("laptopSpecs")
const laptopSpecListElement = document.getElementById("specList")
const imageSectionElement = document.getElementById("imageSection")

//Variables
let laptops = []
//Laptop price variable
let laptopPrice

//Work balance variable
let workBalance = 0
//Bank balance variable
let bankBalance = 0
//Loan variable
let loanAmount = 0

//Initializing balances for html
workBalanceText.innerHTML = workBalance.toFixed(2) + " kr"
bankBalanceText.innerHTML = bankBalance.toFixed(2) + " kr"

//getting data from api with fetch
fetch("https://hickory-quilled-actress.glitch.me/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToSelect(laptops))
    .then(() => updateLaptopView())


//This function updates work and bank balances into html
const updateBalances = () => {
    workBalanceText.innerHTML = workBalance.toFixed(2) + " kr"
    bankBalanceText.innerHTML = bankBalance.toFixed(2) + " kr"
    if (loanAmount > 0) loanAmountText.innerHTML = loanAmount.toFixed(2) + " kr"
}

//This function sets loan elements visible and invisible
const updateLoanVisibility = (isVisible) => {
    if (isVisible) {
        repayButton.style.display = "block"
        remainingLoanText.style.display = "block"
        loanAmountText.style.display = "block"
    } else {
        repayButton.style.display = "none"
        remainingLoanText.style.display = "none"
        loanAmountText.style.display = "none"
    }

}

//Functionality of work button
workButtonElement.onclick = function () {
    workBalance += 100
    updateBalances()
}

let listItem = document.createElement('li');

//Functionality of laptop select element, setting and showing the laptop values for HTML
const updateLaptopView = () => {

    let selectedLaptop = laptopSelectElement.value - 1
    laptopPrice = laptops[selectedLaptop].price

    laptopTitleText.innerHTML = laptops[selectedLaptop].title
    laptopDescriptionText.innerHTML = laptops[selectedLaptop].price.toFixed(2) + " kr"
    laptopPriceText.innerHTML = laptops[selectedLaptop].description

    let listLength = laptops[selectedLaptop].specs.length
    laptopSpecListElement.innerHTML = "";
    imageSectionElement.innerHTML = `<img src="https://hickory-quilled-actress.glitch.me/${laptops[selectedLaptop].image}"     alt="laptop"> `

    for (let i = 0; i < listLength; i++) {

        listItem.textContent = laptops[selectedLaptop].specs[i]
        laptopSpecListElement.appendChild(listItem)
        listItem = document.createElement('li');

    }

}

//Functionality of laptop select element, updates the info for HTML
laptopSelectElement.onchange = function () {
    updateLaptopView()
}

//Functionality of bank button, banking the work balance and pays the loan loan from it if there is one
bankButtonElement.onclick = function () {

    if (loanAmount === 0) {
        bankBalance += workBalance
        workBalance = 0

        updateBalances()
    } else { //goes here if there is loan
        let temp = workBalance * 0.1
        if (loanAmount - temp > 0) {
            loanAmount = loanAmount - temp
            bankBalance += workBalance - temp
            workBalance = 0
            updateBalances()

        } else {
            bankBalance += workBalance - loanAmount
            workBalance = 0
            loanAmount = 0
            updateLoanVisibility(false)
            updateBalances()
        }
    }
}

//Functionality of buying laptop
buyButtonElement.onclick = function () {
    if (bankBalance >= laptopPrice) {
        bankBalance = bankBalance - laptopPrice
        updateBalances()
        alert("You bought the laptop!")
    } else {
        alert("Not enough funds")
    }
}

//Functionality of adding laptops into select element
const addLaptopsToSelect = (laptops) => {
    laptops.forEach(x => addLaptopToMenu(x))
}

const addLaptopToMenu = (laptop) => {
    const laptopElement = document.createElement("option")
    laptopElement.value = laptop.id
    laptopElement.appendChild(document.createTextNode(laptop.title))
    laptopSelectElement.appendChild(laptopElement)
}

let getLoanMessage = "Loan amount"
let loanPromptValue;

//Functionality of getting loan
loanButton.onclick = function () {
    if (loanAmount === 0) {
        loanPromptValue = parseFloat(prompt(getLoanMessage))
        if (loanPromptValue <= bankBalance * 2 && loanPromptValue != 0) {
            loanAmount = loanPromptValue;
            bankBalance += loanAmount
            loanAmountText.innerHTML = loanAmount.toFixed(2) + " kr"
            updateLoanVisibility(true)
            updateBalances()

        } else if (bankBalance === 0) {
            alert("You cant take more loan if your bank balance is 0 Kr")

        } else alert("You cant take more loan than 2x your bank balance, try again")

    } else alert("You cant take loan before old one is paid")
}

//Functionality of paying loan
repayButton.onclick = function () {
    if (loanAmount != 0) {
        if (loanAmount <= workBalance) {
            console.log(bankBalance + (workBalance - loanAmount))
            bankBalance = parseFloat(bankBalance + (workBalance - loanAmount))

            loanAmount = 0
            workBalance = 0
            updateBalances()
            updateLoanVisibility(false)
        }
        if (loanAmount > workBalance) {
            loanAmount = loanAmount - workBalance
            workBalance = 0
            updateBalances()
        }
    }

}
