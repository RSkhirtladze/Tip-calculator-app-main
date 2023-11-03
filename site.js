const billElement = document.getElementById("billAmountElement");
const billException = document.getElementById("billException");
const numberOfPeopleElement = document.getElementById("numberOfPeopleElement");
const numberOfPeopleException = document.getElementById(
  "numberOfPeopleException"
);
const customTip = document.getElementById("customTipAmount");
const defaultTips = document.querySelectorAll(".defaultTipAmount");
const tipException = document.getElementById("tipException");

const tipPerPerson = document.getElementById("tipAmount");
const totalMoneyPerPerson = document.getElementById("total");

const resetButton = document.getElementById("resetButton");

billElement.addEventListener("input", function () {
  activateResetButton();
  recalculateAmountPerPerson();
});

numberOfPeopleElement.addEventListener("input", function () {
  activateResetButton();
  recalculateAmountPerPerson();
});

customTip.addEventListener("input", function () {
  activateResetButton();
  unactivateDefaultTips();
  if (!customTip.classList.contains("activeTip")) {
    customTip.classList.toggle("activeTip");
  }
  recalculateAmountPerPerson();
});

defaultTips.forEach((defaultTip) => {
  defaultTip.addEventListener("click", function () {
    activateResetButton();

    unactivateCustomTip();
    unactivateDefaultTips();

    activateDefaultTip(defaultTip);
    recalculateAmountPerPerson();
  });
});

resetButton.addEventListener("click", function () {
  reset();
});

resetButton.addEventListener("mouseenter", function () {
  if (resetButton.classList.contains("isResetActive")) {
    resetButton.style.backgroundColor = `#9FE8DF`;
  }
});

resetButton.addEventListener("mouseleave", function () {
  if (resetButton.classList.contains("isResetActive")) {
    resetButton.style.backgroundColor = `#26C2AE`;
  }
});

function activateDefaultTip(tip) {
  tip.classList.toggle("activeTip");
  tip.style.backgroundColor = "#9FE8DF";
  tip.style.color = "#00474B";
}

function unactivateDefaultTips() {
  defaultTips.forEach((tip) => {
    if (tip.classList.contains("activeTip")) {
      tip.classList.toggle("activeTip");
      tip.style.backgroundColor = "#00474B";
      tip.style.color = "#FFF";
    }
  });
}

function unactivateCustomTip() {
  if (customTip.classList.contains("activeTip")) {
    customTip.value = "";
    customTip.classList.toggle("activeTip");
  }
}

function getBill() {
  try {
    validateBill();
    hideBillException();
    return parseFloat(billElement.value);
  } catch (error) {
    showBillException(error.message);
    throw error;
  }
}

function validateBill() {
  const billValue = billElement.value;
  const regex = /^(?!0\d)\d*(\.\d{0,2})?$/;
  if (regex.test(billValue)) {
    const num = parseFloat(billValue);
    if (!isNaN(num) && num >= 0) {
      return;
    }
  }

  throw new Error("Invalid Bill");
}

function showBillException(errorMsg) {
  billException.textContent = errorMsg;
}

function hideBillException() {
  billException.textContent = "";
}

function getNumberOfPeople() {
  try {
    validateNumberOfPeople();
    return parseInt(numberOfPeopleElement.value, 10);
  } catch (error) {
    showNumberOfPeopleException(error.message);
    throw error;
  }
}

function validateNumberOfPeople() {
  const numberOfPeople = numberOfPeopleElement.value;
  const num = parseInt(numberOfPeople, 10);

  if (isNaN(num) || numberOfPeople.trim() !== num.toString()) {
    throw new Error("Should be a number");
  }

  if (num <= 0) {
    throw new Error("Must be greater than 0");
  }

  if (!Number.isInteger(num)) {
    throw new Error("Must be a whole number.");
  }
}

function showNumberOfPeopleException(errorMsg) {
  numberOfPeopleException.textContent = errorMsg;
}

function hideNumberOfPeopleException() {
  numberOfPeopleException.textContent = "";
}

function getTipPercentage() {
  try {
    const activeTips = document.querySelectorAll(".activeTip");
    if (activeTips.length === 0) {
      throw new Error("Select Tip");
    }

    let activeTip = activeTips[0];
    hideTipException();
    if (activeTip === customTip) {
      validateTipPercentage();
      return parseFloat(customTip.value);
    } else {
      return parseInt(
        activeTip.textContent.substring(0, activeTip.textContent.length - 1)
      );
    }
  } catch (error) {
    showTipException(error.message);
    throw error;
  }
}

function validateTipPercentage() {
  const tipNum = customTip.value;
  const regex = /^(?!0\d)\d*(\.\d{0,2})?$/;
  if (regex.test(tipNum)) {
    const num = parseFloat(tipNum);
    if (!isNaN(num) && num >= 0) {
      return;
    }
  }

  throw new Error("Invalid Custom Tip");
}

function showTipException(errorMsg) {
  tipException.textContent = errorMsg;
}

function hideTipException() {
  tipException.textContent = "";
}

function hideAllExceptions() {
  hideBillException();
  hideNumberOfPeopleException();
  hideTipException();
}

function recalculateAmountPerPerson() {
  try {
    hideAllExceptions();
    const bill = getBill();
    const tipPercentage = getTipPercentage();
    const numberOfPeople = getNumberOfPeople();

    const totalTip = (bill / 100) * tipPercentage;
    const tipAmountPerPerson = totalTip / numberOfPeople;
    const totalPerPerson = (bill + totalTip) / numberOfPeople;

    tipPerPerson.innerText = "$" + parseFloat(tipAmountPerPerson.toFixed(2));
    totalMoneyPerPerson.innerText = "$" + parseFloat(totalPerPerson.toFixed(2));
  } catch {}
}

function activateResetButton() {
  if (!resetButton.classList.contains(`isResetActive`)) {
    resetButton.style.backgroundColor = `#26C2AE`;
    resetButton.style.opacity = `1`;

    resetButton.classList.toggle(`isResetActive`);
  }
}

function reset() {
  if (resetButton.classList.contains(`isResetActive`)) {
    resetButton.style.backgroundColor = `#0D686D`;
    resetButton.style.opacity = `0.35`;
    resetButton.classList.toggle(`isResetActive`);

    hideAllExceptions();
    unactivateDefaultTips();
    billElement.value = ``;
    customTip.value = ``;
    numberOfPeopleElement.value = ``;

    tipPerPerson.innerText = "$0.00";
    totalMoneyPerPerson.innerText = "$0.00";
  }
}
