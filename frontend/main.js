console.log("🔥 main.js loaded!");

const BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://kedi-moneynetwork.onrender.com";

// --- Signup form handler ---
async function handleSignup(event) {
  event.preventDefault();

  const form = event.target;
  const formData = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    district: form.district.value.trim(),
    sector: form.sector.value.trim(),
    cell: form.cell.value.trim(),
    village: form.village.value.trim(),
    idNumber: form.idNumber.value.trim(),
    username: form.username.value.trim(),
    password: form.password.value,
    referralId: form.referralId.value.trim(),
    amount: Number(form.amount.value),
    paymentMethod: form.paymentMethod.value,
    txnId: form.txnId.value.trim()
  };

  // Optional: Add client-side validation here

  try {
    const res = await fetch(`${BASE_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("Account created! Your Referral ID is: " + data.referralId);
      window.location.href = "login.html";
    } else {
      alert("Signup failed: " + (data.message || "Unknown error"));
    }
  } catch (error) {
    alert("Server error during signup.");
    console.error(error);
  }
}

// --- Login form handler ---
async function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  const username = form.username.value.trim();
  const password = form.password.value;

  try {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("Login successful!");
      localStorage.setItem("kediUser", username);
      window.location.href = "dashboard.html";
    } else {
      alert("Login failed: " + (data.message || "Invalid credentials"));
    }
  } catch (error) {
    alert("Server error during login.");
    console.error(error);
  }
}

// --- Submit transaction handler ---
async function handleTransactionSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const user = localStorage.getItem("kediUser");
  if (!user) {
    alert("User not logged in.");
    window.location.href = "login.html";
    return;
  }

  const txnData = {
    user,
    type: form.type.value,
    amount: Number(form.amount.value),
    txnId: form.txnId.value.trim()
  };

  try {
    const res = await fetch(`${BASE_URL}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(txnData)
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("Transaction submitted!");
      form.reset();
    } else {
      alert("Transaction failed: " + (data.message || "Unknown error"));
    }
  } catch (error) {
    alert("Error submitting transaction.");
    console.error(error);
  }
}

// --- Load transaction history ---
async function loadTransactionHistory() {
  const user = localStorage.getItem("kediUser");
  if (!user) return;

  try {
    const res = await fetch(`${BASE_URL}/api/history?user=${encodeURIComponent(user)}`);
    if (!res.ok) throw new Error("Failed to fetch history");
    const data = await res.json();

    const container = document.getElementById("transaction-history");
    if (!container) return;

    container.innerHTML = data.map(txn => `
      <li>${txn.type} - ${txn.amount} RWF (${txn.txnId})</li>
    `).join("");
  } catch (error) {
    console.error("Error fetching history:", error);
  }
}

// --- Load commissions ---
async function loadCommissions() {
  const user = localStorage.getItem("kediUser");
  if (!user) return;

  try {
    const res = await fetch(`${BASE_URL}/api/commissions?user=${encodeURIComponent(user)}`);
    if (!res.ok) throw new Error("Failed to fetch commissions");
    const data = await res.json();

    document.getElementById("total-commissions").textContent = data.totalCommissions + " RWF";

    const list = document.getElementById("commission-list");
    if (!list) return;

    list.innerHTML = data.commissions.map(c => `
      <li>From ${c.fromUser} - ${c.amount} RWF</li>
    `).join("");
  } catch (error) {
    console.error("Error fetching commissions:", error);
  }
}

// --- Attach event listeners ---
window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("signupForm")) {
    document.getElementById("signupForm").addEventListener("submit", handleSignup);
  }

  if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
  }

  if (document.getElementById("txnForm")) {
    document.getElementById("txnForm").addEventListener("submit", handleTransactionSubmit);
  }

  if (document.getElementById("transaction-history")) {
    loadTransactionHistory();
  }

  if (document.getElementById("commission-list")) {
    loadCommissions();
  }
});
