// main.js

// Utility: Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

// Utility: Redirect if not logged in
function redirectIfNotLoggedIn() {
  if (!isLoggedIn()) {
    window.location.href = '/frontend/login.html';
  }
}

// Utility: Fetch token
function getToken() {
  return localStorage.getItem('token');
}

// SIGNUP
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(signupForm);
    const userData = Object.fromEntries(formData.entries());

    const res = await fetch('https://kedi-moneynetwork.onrender.com/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await res.json();
    if (res.ok) {
      alert('Wiyandikishije neza. Injira ukoresheje konti yawe.');
      window.location.href = '/frontend/login.html';
    } else {
      alert(data.message || 'Habaye ikibazo.');
    }
  });
}

// LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const credentials = Object.fromEntries(formData.entries());

    const res = await fetch('https://kedi-moneynetwork.onrender.com/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id);
      window.location.href = '/frontend/dashboard.html';
    } else {
      alert(data.message || 'Login yanze.');
    }
  });
}

// DASHBOARD: Load User Info
const dashboardPage = document.getElementById('dashboardPage');
if (dashboardPage) {
  redirectIfNotLoggedIn();
  const userId = localStorage.getItem('userId');

  fetch(`https://kedi-moneynetwork.onrender.com/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('userEmail').textContent = data.email || '';
      document.getElementById('userName').textContent = data.fullName || '';
    });
}

// TRANSACTION FORM
const txnForm = document.getElementById('txnForm');
if (txnForm) {
  redirectIfNotLoggedIn();
  txnForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(txnForm);
    const txnData = Object.fromEntries(formData.entries());
    txnData.userId = localStorage.getItem('userId');

    const res = await fetch('https://kedi-moneynetwork.onrender.com/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(txnData)
    });

    const data = await res.json();
    if (res.ok) {
      alert('Transaction yakozwe neza!');
      txnForm.reset();
    } else {
      alert(data.message || 'Transaction yanze.');
    }
  });
}

// ADMIN LOGIN
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = adminLoginForm.username.value;
    const password = adminLoginForm.password.value;

    if (username === 'kedimoneynetwork1' && password === 'kedimoney') {
      localStorage.setItem('admin', 'true');
      window.location.href = '/frontend/admin-dashboard.html';
    } else {
      alert('Izina cyangwa ijambo ry’ibanga si byo!');
    }
  });
}

// ADMIN DASHBOARD
const adminDashboardPage = document.getElementById('adminDashboardPage');
if (adminDashboardPage) {
  if (localStorage.getItem('admin') !== 'true') {
    window.location.href = '/frontend/admin-login.html';
  }
  // Load pending users, transactions, etc...
}

// LOGOUT
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/frontend/login.html';
  });
}

// Redirect logic for other pages if needed (tree.html, etc)
