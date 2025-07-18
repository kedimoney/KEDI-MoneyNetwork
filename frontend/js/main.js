// main.js

const API_BASE = 'https://kedi-moneynetwork.onrender.com'; // change this if your API base changes

// ------------------ Auth Utils ------------------

function getToken() {
  return localStorage.getItem('token');
}

function saveToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

function isLoggedIn() {
  return !!getToken();
}

// ------------------ Login ------------------

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        saveToken(data.token);
        window.location.href = 'dashboard.html';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  });
}

// ------------------ Logout ------------------

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    removeToken();
    window.location.href = 'login.html';
  });
}

// ------------------ Dashboard ------------------

async function loadDashboardData() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/user/dashboard`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();

    // Fill Transaction History
    const txList = document.getElementById('transaction-history');
    if (txList) {
      txList.innerHTML = '';
      data.transactions.forEach((tx) => {
        const li = document.createElement('li');
        li.textContent = `${tx.type.toUpperCase()} - ${tx.amount} RWF - ${new Date(tx.createdAt).toLocaleString()}`;
        txList.appendChild(li);
      });
    }

    // Fill Tree Plan
    const treeList = document.getElementById('tree-plan');
    if (treeList) {
      treeList.innerHTML = '';
      data.downlines.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = `${user.fullName} (${user.email})`;
        treeList.appendChild(li);
      });
    }

    // Fill Commissions
    const total = document.getElementById('total-commissions');
    const commissionList = document.getElementById('commission-list');
    if (total && commissionList) {
      total.textContent = data.totalCommission + ' RWF';
      commissionList.innerHTML = '';
      data.commissions.forEach((c) => {
        const li = document.createElement('li');
        li.textContent = `${c.amount} RWF - from ${c.sourceUser} (${new Date(c.createdAt).toLocaleString()})`;
        commissionList.appendChild(li);
      });
    }

  } catch (err) {
    console.error(err);
    alert('Failed to load dashboard');
  }
}

if (window.location.pathname.includes('dashboard.html')) {
  loadDashboardData();
}

// ------------------ Transaction Form ------------------

const transactionForm = document.getElementById('transaction-form');
if (transactionForm) {
  transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(transactionForm);
    const type = formData.get('type');
    const amount = formData.get('amount');
    const txnId = formData.get('txnId');
    const paymentMethod = formData.get('paymentMethod');

    try {
      const res = await fetch(`${API_BASE}/api/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ type, amount, txnId, paymentMethod }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Transaction sent!');
        transactionForm.reset();
      } else {
        alert(data.error || 'Transaction failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  });
}

// ------------------ Protect Tree Page ------------------

if (window.location.pathname.includes('tree.html')) {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}
