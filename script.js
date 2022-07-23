// Set these to use with element functions
const id = 'id';
const eclass = 'class';
// Get elements on the dom
let totalBalance = element('balance', id);
let incomeBox = element('income-box', id);
let expenseBox = element('expense-box', id);
let transactionList = element('transaction-list', id);
let addTransaction = element('add-transaction', id);
let titleBox = element('title', id);
let amountBox = element('amount', id);

// Init vars
let title;
let amount;
// Update all values on dom
updateValues();
// Listener for form button press
addTransaction.addEventListener('submit', function(e){
  e.preventDefault();
  title = titleBox.value;
  amount = amountBox.value;
  if(!title || !amount){
    alert('Please enter a value and an amount!');
    return;
  }
  saveToLocalStorage(title, amount);
  updateValues();
  amountBox.value = '';
  titleBox.value = '';
});

function element(selector, type){
  switch(type){
    case 'id':
      return document.getElementById(selector);
    case 'class':
      return document.getElementsByClassName(selector);
    default:
      return false;
  }
}

function removeTransaction(transactionId){
  let transactions = fetchFromLocalStorage();
  let index = transactions.map(item => {return item.id}).indexOf(transactionId);
  transactions.splice(index, 1);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateValues();
}



function fetchFromLocalStorage(){
  let transactions;
  localStorage.getItem('transactions') ? transactions = JSON.parse(localStorage.getItem('transactions'))
    : transactions = [];
  return transactions;
}


function updateValues(value = 0){
  transactionList.innerHTML = '';
  let balance = 0; let expense = 0; let income = 0;
  let transactions = fetchFromLocalStorage();
  if(transactions.length > 0){
    transactions.forEach(transaction => {
        let amount = parseFloat(transaction.amount);
        if (amount < 0){
          expense += amount;
          transactionList.innerHTML += `<div id=${transaction.id} class="transaction-box card negative-transaction">
                                          <span class="remove-btn" onclick="removeTransaction('${transaction.id}')">X</span>
                                          <p>${transaction.title}</p>
                                          <p class="transaction-amount">-£${Math.abs(transaction.amount).toFixed(2)}</p>
                                        </div>`
        } else{
          income += amount;
          transactionList.innerHTML += `<div id=${transaction.id} class="transaction-box card positive-transaction">
                                          <span class="remove-btn" onclick="removeTransaction('${transaction.id}')">X</span>
                                          <p>${transaction.title}</p>
                                          <p class="transaction-amount">+£${Math.abs(transaction.amount).toFixed(2)}</p>
                                        </div>`
        }
    });
  }
  balance = expense + income;
  totalBalance.innerHTML = balance.toFixed(2);
  incomeBox.innerHTML = income.toFixed(2);
  expenseBox.innerHTML = Math.abs(expense).toFixed(2);
}

function saveToLocalStorage(title, amount){
  let id = create_UUID();
  let transaction = { id, title, amount };
  let transactions = fetchFromLocalStorage();
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
}



function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
