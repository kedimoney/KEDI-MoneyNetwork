// main.js - KEDI Money Network

// Utility function to check login
function checkLogin() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
  }
  return token;
}

// Logout function
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  });
}

// Handle Signup
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(signupForm);
    const body = {
      fullName: data.get('fullName'),
      email: data.get('email'),
      phone: data.get('phone'),
      password: data.get('password'),
      paymentMethod: data.get('paymentMethod'),
      transactionId: data.get('transactionId'),
      referredBy: data.get('referredBy') || ''
    };

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await res.json();
    if (res.ok) {
      alert('Wiyandikishije neza! Injira ukoresheje email na password yawe.');
      window.location.href = '/login.html';
    } else {
      alert(result.error || 'Ikibazo cyabaye.');
    }
  });
}

// Handle Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();
    if (res.ok) {
      localStorage.setItem('token', result.token);
      window.location.href = '/dashboard.html';
    } else {
      alert(result.error || 'Login failed.');
    }
  });
}

// Load Dashboard Data
const transactionList = document.getElementById('transaction-history');
const treePlanList = document.getElementById('tree-plan');
const commissionList = document.getElementById('commission-list');
const totalCommissions = document.getElementById('total-commissions');

if (transactionList || treePlanList || commissionList) {
  const token = checkLogin();

  fetch('/api/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (transactionList) {
        transactionList.innerHTML = '';
        data.transactions.forEach(tx => {
          const li = document.createElement('li');
          li.textContent = `${tx.type}: ${tx.amount} RWF (${tx.status})`;
          transactionList.appendChild(li);
        });
      }

      if (treePlanList) {
        treePlanList.innerHTML = '';
        data.tree.forEach(person => {
          const li = document.createElement('li');
          li.textContent = person;
          treePlanList.appendChild(li);
        });
      }

      if (commissionList && totalCommissions) {
        commissionList.innerHTML = '';
        let total = 0;
        data.commissions.forEach(c => {
          const li = document.createElement('li');
          li.textContent = `${c.amount} RWF from ${c.source}`;
          commissionList.appendChild(li);
          total += c.amount;
        });
        totalCommissions.textContent = `${total} RWF`;
      }
    });
}

// Handle Transaction Form Submission (form.html)
const transactionForm = document.getElementById('transactionForm');
if (transactionForm) {
  const token = checkLogin();
  transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = transactionForm.type.value;
    const amount = transactionForm.amount.value;

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ type, amount })
    });

    const result = await res.json();
    if (res.ok) {
      alert('Transaction yakiriwe!');
      transactionForm.reset();
    } else {
      alert(result.error || 'Transaction yanze.');
    }
  });
}
