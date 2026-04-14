let people = [];
let expenses = [];

function addPerson() {
    let name = document.getElementById("personName").value;
    if (!name) return;
    people.push(name);
    let div = document.createElement("div");
    div.innerText = name;
    document.getElementById("people").appendChild(div);
    let option = document.createElement("option");
    option.value = name;
    option.text = name;
    document.getElementById("paidBy").appendChild(option);
    document.getElementById("personName").value = "";
}

function addExpense() {
    let amount = parseFloat(document.getElementById("expenseAmount").value);
    let payer = document.getElementById("paidBy").value;
    if (!amount || !payer) return;
    expenses.push({ amount, payer });
    document.getElementById("expenseAmount").value = "";
    updateSummary(); 
}

function calculateSplit() {
    let total = expenses.reduce((sum, e) => sum + e.amount, 0);
    let perPerson = total / people.length;
    let balances = {};
    people.forEach(p => balances[p] = 0);
    expenses.forEach(e => {
        balances[e.payer] += e.amount;
    });
    people.forEach(p => {
        balances[p] -= perPerson;
    });
    let result = document.getElementById("result");
    result.innerHTML = "";
    let debtors = [];
    let creditors = [];
    for (let person in balances) {
        if (balances[person] < 0) {
            debtors.push({ name: person, amount: -balances[person] });
        } else if (balances[person] > 0) {
            creditors.push({ name: person, amount: balances[person] });
        }
    }
    debtors.forEach(d => {
        creditors.forEach(c => {
            if (d.amount > 0 && c.amount > 0) {
                let pay = Math.min(d.amount, c.amount);
                let div = document.createElement("div");
                div.innerText = `${d.name} pays ₹${pay.toFixed(2)} to ${c.name}`;
                result.appendChild(div);
                d.amount -= pay;
                c.amount -= pay;
            }
        });
    });
}

function updateSummary() {
    let summary = {};
    people.forEach(p => summary[p] = 0);
    expenses.forEach(e => {
        summary[e.payer] += e.amount;
    });
    let container = document.getElementById("summary");
    container.innerHTML = "";
    for (let person in summary) {
        let div = document.createElement("div");
        div.innerText = `${person} spent ₹${summary[person]}`;
        container.appendChild(div);
    }
}