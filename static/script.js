function addAccount() {
    const template = document.getElementById('account-template');
    const accountsList = document.getElementById('accounts-list');
    const clone = template.content.cloneNode(true);
    accountsList.appendChild(clone);
}

function removeAccount(button) {
    button.parentElement.remove();
}

function calculateResults() {
    const accounts = [];
    const accountEntries = document.querySelectorAll('.account-entry');
    
    accountEntries.forEach(entry => {
        const name = entry.querySelector('.account-name').value;
        const balance = entry.querySelector('.account-balance').value;
        const interestRate = entry.querySelector('.account-rate').value;
        
        if (name && balance && interestRate) {
            accounts.push({
                name: name,
                balance: parseFloat(balance),
                interestRate: parseFloat(interestRate)
            });
        }
    });

    const years = document.getElementById('years').value;

    if (accounts.length === 0 || !years) {
        alert('Please add at least one account and specify the number of years.');
        return;
    }

    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accounts: accounts,
            years: years
        })
    })
    .then(response => response.json())
    .then(data => displayResults(data))
    .catch(error => console.error('Error:', error));
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML = '';

    // Display individual account results
    data.breakdown.forEach(account => {
        const accountDiv = document.createElement('div');
        accountDiv.className = 'account-result';
        accountDiv.innerHTML = `
            <h3>${account.account}</h3>
            <p>Initial Balance: $${account.initial_balance}</p>
            <p>Interest Rate: ${account.interest_rate}%</p>
            <p>Interest Earned: $${account.interest_earned}</p>
            <p>Final Balance: $${account.final_balance}</p>
        `;
        resultsContent.appendChild(accountDiv);
    });

    // Display summary
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'summary';
    summaryDiv.innerHTML = `
        <h3>Summary</h3>
        <p>Total Initial Balance: $${data.total_initial}</p>
        <p>Total Final Balance: $${data.total_final}</p>
        <p>Total Interest Earned: $${data.total_interest}</p>
    `;
    resultsContent.appendChild(summaryDiv);

    resultsDiv.style.display = 'block';
}

function resetAll() {
    // Clear all account entries except the first one
    const accountsList = document.getElementById('accounts-list');
    const accountEntries = accountsList.querySelectorAll('.account-entry');
    
    // Remove all accounts except the first one
    for (let i = accountEntries.length - 1; i > 0; i--) {
        accountEntries[i].remove();
    }

    // Clear the first account's inputs
    if (accountEntries.length > 0) {
        const firstAccount = accountEntries[0];
        firstAccount.querySelector('.account-name').value = '';
        firstAccount.querySelector('.account-balance').value = '';
        firstAccount.querySelector('.account-rate').value = '';
    }

    // Reset years to 1
    document.getElementById('years').value = 1;

    // Hide results section
    document.getElementById('results').style.display = 'none';
}

// Add initial account entry when page loads
window.onload = function() {
    addAccount();
}; 