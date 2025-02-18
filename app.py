from flask import Flask, render_template, request, jsonify
from decimal import Decimal

app = Flask(__name__)

class Account:
    def __init__(self, name, balance, interest_rate):
        self.name = name
        self.balance = Decimal(str(balance))
        self.interest_rate = Decimal(str(interest_rate)) / 100

class WealthTracker:
    def __init__(self):
        self.accounts = []

    def add_account(self, name, balance, interest_rate):
        account = Account(name, balance, interest_rate)
        self.accounts.append(account)
        
    def calculate_interest_income(self, years):
        years = Decimal(str(years))
        total_initial_balance = sum(account.balance for account in self.accounts)
        total_final_balance = Decimal('0')
        interest_breakdown = []

        for account in self.accounts:
            final_balance = account.balance * (1 + account.interest_rate) ** years
            interest_earned = final_balance - account.balance
            total_final_balance += final_balance
            
            interest_breakdown.append({
                'account': account.name,
                'initial_balance': f"{account.balance:,.2f}",
                'interest_rate': f"{account.interest_rate * 100:.2f}",
                'interest_earned': f"{interest_earned:,.2f}",
                'final_balance': f"{final_balance:,.2f}"
            })

        return {
            'breakdown': interest_breakdown,
            'total_initial': f"{total_initial_balance:,.2f}",
            'total_final': f"{total_final_balance:,.2f}",
            'total_interest': f"{(total_final_balance - total_initial_balance):,.2f}"
        }

tracker = WealthTracker()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    tracker.accounts = []  # Reset accounts for new calculation
    
    for account in data['accounts']:
        tracker.add_account(
            account['name'],
            account['balance'],
            account['interestRate']
        )
    
    results = tracker.calculate_interest_income(float(data['years']))
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True) 