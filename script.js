'use strict';

// Data
const account1 = {
  owner: 'Rachit Khurana',
  movements: [200, 450, -400],
  loan: [1000, 2000],
  loanInterest: 6,
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
  ],
  // currency: 'USD',
  // locale: 'en-US'
  currency: 'INR',
  locale: 'en-IN',
};

const account2 = {
  owner: 'Sidak Singh',
  movements: [5000, -3400],
  loan: [1000, 2000],
  loanInterest: 7,
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
  ],
  // currency: 'EUR',
  // locale: 'de-DE',
  currency: 'INR',
  locale: 'en-IN',
};

const account3 = {
  owner: 'Saumya Aggarwal',
  movements: [800, -200],
  loan: [1000, 2000],
  loanInterest: 8,
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelLoan = document.querySelector('.summary__value--loan');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelLoanInterest = document.querySelector('.summary__value--loanInterest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Functions
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};


const displayMovements = function(acc, sort = false){
  containerMovements.innerHTML = '';
  const movements = sort
  ? acc.movements.slice().sort((a, b) => a - b)
  : acc.movements;

  movements.forEach(function(movement, i){
    const type = movement > 0? 'deposit': 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
      
    </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin',html)
  });
}


const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,mov)=> acc + mov,0);
  // labelBalance.textContent = "₹"+ acc.balance.toFixed(2);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
  // console.log(acc.balance);
}

const calcLoan = function(acc){
  acc.userLoan = acc.loan.reduce((acc,mov)=> acc + mov,0);
  console.log("Loan Taken: " + acc.userLoan);
  
  const interestAmount = (acc.userLoan*acc.loanInterest)/100;
  console.log("Interest Amount: " + interestAmount);
  
  const repayLoan = acc.userLoan + interestAmount;
  console.log("Amount to pay back: " + repayLoan);

  labelLoanInterest.textContent = formatCur(interestAmount, acc.locale, acc.currency);
  labelLoan.textContent = formatCur(acc.userLoan, acc.locale, acc.currency);
}

const calcDisplaySummary = function(acc){
  const income = acc.movements
  .filter(mov => mov>0)
  .reduce((acc,mov)=> acc + mov,0);
  labelSumIn.textContent = formatCur(income, acc.locale, acc.currency);

  const out = acc.movements
  .filter(mov => mov<0)
  .reduce((acc,mov)=> acc + mov,0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
}

const createUsernames = function(accs){
  accs.forEach(function(acc){
     acc.username = acc.owner
     .toLowerCase()
     .split(' ')
      .map(name => name[0])
      .join('');
    })
  };
createUsernames(accounts);

const updateUI = function(acc){
  displayMovements(acc);
  calcDisplayBalance(acc); 
  calcDisplaySummary(acc);
  calcLoan(acc);
}

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

let currentAccount,timer;

const date = new Date();
const day = `${date.getDate()}`.padStart(2, 0);
const month = `${date.getMonth() + 1}`.padStart(2, 0);
const year = date.getFullYear();
const hour = date.getHours();
const min = date.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;


btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
  
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    console.log('Logged In');
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`;
    
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();
    
    if (timer) {
      clearInterval(timer);
    }

    timer = startLogOutTimer();

    updateUI(currentAccount);
    alert('Successfully Logged In as ' +currentAccount.owner);
  }
  else{
    containerApp.style.opacity = 0;
    alert('Wrong Username or Password. Please Try Again!');
  }
})

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc=>acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if(amount>0 && receiverAcc && amount<=currentAccount.balance && receiverAcc?.username!== currentAccount.username){
    setTimeout(() => {
      
      console.log(amount);
      // console.log(receiverAcc);
      console.log("Valid User");
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
  
      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());
      
      updateUI(currentAccount);
      
      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 1000);
    alert('Success: Money Transfer');
  }else{
    alert('Failed: Money Transfer');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.loan.push(amount);
      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
      alert('Loan Approved');    
      
      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2000);

  }else{
    alert('Loan Disapproved');    
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    alert('Account Closed Successfully');    
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
