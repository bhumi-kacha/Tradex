// =============================
// TRADEX PAPER TRADING
// =============================

// Starting virtual money
let balance = Number(localStorage.getItem("balance")) || 1000000;


// Stock prices
const stockPrices = {
    RELIANCE: 1398.50,
    TCS: 3145.20,
    INFY: 1532.80,
    HDFCBANK: 975.40,
    TATAMOTORS: 714.25
};


// Stock holdings
let holdings = JSON.parse(localStorage.getItem("holdings")) || {};


// Save data
function saveData() {

    localStorage.setItem("balance", balance);

    localStorage.setItem(
        "holdings",
        JSON.stringify(holdings)
    );
}


// =============================
// BUY STOCK
// =============================

function buyStock() {

    const stockSelect = document.getElementById("stock");
    const quantityInput = document.getElementById("quantity");

    if (!stockSelect || !quantityInput) {
        return;
    }


    const stock = stockSelect.value;

    const quantity = Number(quantityInput.value);


    // Check quantity
    if (quantity <= 0 || isNaN(quantity)) {

        alert("Please enter a valid quantity.");

        return;
    }


    const price = stockPrices[stock];

    const totalCost = price * quantity;


    // Check balance
    if (totalCost > balance) {

        alert("Not enough virtual money!");

        return;
    }


    // Deduct balance
    balance = balance - totalCost;


    // Add stock to portfolio
    if (holdings[stock]) {

        holdings[stock] =
            holdings[stock] + quantity;

    } else {

        holdings[stock] = quantity;

    }


    saveData();


    alert(
        "BUY successful!\n\n" +
        "Stock: " + stock +
        "\nQuantity: " + quantity +
        "\nTotal: ₹" + totalCost.toFixed(2) +
        "\n\nRemaining Balance: ₹" +
        balance.toFixed(2)
    );


    quantityInput.value = "";

    updatePortfolio();

}


// =============================
// SELL STOCK
// =============================

function sellStock() {

    const stockSelect = document.getElementById("stock");
    const quantityInput = document.getElementById("quantity");

    if (!stockSelect || !quantityInput) {
        return;
    }


    const stock = stockSelect.value;

    const quantity = Number(quantityInput.value);


    // Check quantity
    if (quantity <= 0 || isNaN(quantity)) {

        alert("Please enter a valid quantity.");

        return;
    }


    // Check ownership
    if (!holdings[stock] || holdings[stock] < quantity) {

        alert(
            "You don't have enough " +
            stock +
            " shares to sell."
        );

        return;
    }


    const price = stockPrices[stock];

    const totalValue = price * quantity;


    // Add money
    balance = balance + totalValue;


    // Remove shares
    holdings[stock] =
        holdings[stock] - quantity;


    // Remove stock if quantity becomes zero
    if (holdings[stock] === 0) {

        delete holdings[stock];

    }


    saveData();


    alert(
        "SELL successful!\n\n" +
        "Stock: " + stock +
        "\nQuantity: " + quantity +
        "\nValue: ₹" + totalValue.toFixed(2) +
        "\n\nNew Balance: ₹" +
        balance.toFixed(2)
    );


    quantityInput.value = "";

    updatePortfolio();

}


// =============================
// UPDATE PORTFOLIO
// =============================

function updatePortfolio() {

    const balanceElement =
        document.querySelector(".summary-card:nth-child(1) h2");

    const investedElement =
        document.querySelector(".summary-card:nth-child(2) h2");

    const totalElement =
        document.querySelector(".summary-card:nth-child(3) h2");

    const profitElement =
        document.querySelector(".summary-card:nth-child(4) h2");


    if (!balanceElement) {
        return;
    }


    let invested = 0;


    for (let stock in holdings) {

        invested =
            invested +
            (stockPrices[stock] * holdings[stock]);

    }


    const totalPortfolio =
        balance + invested;


    balanceElement.innerText =
        "₹" + balance.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        });


    investedElement.innerText =
        "₹" + invested.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        });


    totalElement.innerText =
        "₹" + totalPortfolio.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        });


    profitElement.innerText =
        "₹0.00";


    updateHoldings();
}


// =============================
// SHOW HOLDINGS
// =============================

function updateHoldings() {

    const table =
        document.querySelector(".holding-table");


    if (!table) {
        return;
    }


    let html = `

        <div class="table-header">

            <span>Stock</span>

            <span>Quantity</span>

            <span>Price</span>

            <span>Value</span>

        </div>

    `;


    if (Object.keys(holdings).length === 0) {

        html += `

            <div class="empty-holdings">

                <p>
                    You don't own any stocks yet.
                </p>

                <a href="trade.html">
                    Start Trading
                </a>

            </div>

        `;

    } else {


        for (let stock in holdings) {

            const quantity =
                holdings[stock];

            const price =
                stockPrices[stock];

            const value =
                quantity * price;


            html += `

                <div class="holding-row">

                    <span>
                        <strong>${stock}</strong>
                    </span>

                    <span>
                        ${quantity}
                    </span>

                    <span>
                        ₹${price.toFixed(2)}
                    </span>

                    <span>
                        ₹${value.toFixed(2)}
                    </span>

                </div>

            `;

        }

    }


    table.innerHTML = html;
}


// =============================
// BUTTON CONNECTION
// =============================

const buyButton =
    document.querySelector(".buy-btn");


const sellButton =
    document.querySelector(".sell-btn");


if (buyButton) {

    buyButton.addEventListener(
        "click",
        buyStock
    );

}


if (sellButton) {

    sellButton.addEventListener(
        "click",
        sellStock
    );

}


// Update portfolio when page opens
updatePortfolio();
// =============================
// GO TO TRADE PAGE
// =============================

function goToTrade(stock) {

    localStorage.setItem("selectedStock", stock);

    window.location.href = "trade.html";

}
// =============================
// LOGIN SYSTEM
// =============================

function loginUser() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    if (email === "" || password === "") {

        alert("Please enter email and password.");

        return;
    }


    localStorage.setItem("userEmail", email);

    localStorage.setItem("isLoggedIn", "true");


    alert("Login successful!");


    window.location.href = "index.html";
}


// =============================
// CREATE ACCOUNT
// =============================

function registerUser() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    if (email === "" || password === "") {

        alert("Please enter email and password first.");

        return;
    }


    localStorage.setItem("userEmail", email);

    localStorage.setItem("isLoggedIn", "true");


    alert("Account created successfully!");


    window.location.href = "index.html";
}
