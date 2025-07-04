// Dynamic base URL for backend
const BASE_API = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://kedi-moneynetwork.onrender.com";

// POST JSON helper
async function postData(url = '', data = {}) {
  const response = await fetch(`${BASE_API}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

// POST FormData helper
async function postFormData(url = '', formData) {
  const response = await fetch(`${BASE_API}${url}`, {
    method: "POST",
    body: formData
  });
  return response.json();
}

// Login handler
if (window.location.pathname.includes("login.html")) {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;

      const result = await postData("/api/login", { username, password });

      if (result.success) {
        localStorage.setItem("user", username);
        window.location.href = "dashboard.html";
      } else {
        alert("Login failed! Please check your credentials.");
      }
    });
  }
}

// Signup handler
if (window.location.pathname.includes("signup.html")) {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const result = await postFormData("/api/signup", formData);

      if (result.referralId) {
        alert("Signup successful! Your referral ID: " + result.referralId);
        window.location.href = "login.html";
      } else {
        alert("Signup failed! " + (result.message || "Unknown error."));
      }
    });
  }
}

// Transaction forms handler
if (
  window.location.pathname.includes("fomukw.html") ||
  window.location.pathname.includes("kubikuza.html") ||
  window.location.pathname.includes("kugurizwa.html")
) {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      formData.append("user", localStorage.getItem("user"));

      const result = await postFormData("/api/submit", formData);

      if (result.success) {
        alert("Transaction submitted!");
      } else {
        alert("Failed to submit transaction: " + result.message);
      }
    });
  }
}

// Dashboard: Load transaction history
if (window.location.pathname.includes("dashboard.html")) {
  const user = localStorage.getItem("user");
  if (user) {
    fetch(`${BASE_API}/api/history?user=${encodeURIComponent(user)}`)
      .then(res => res.json())
      .then(data => {
        const table = document.querySelector("#history");
        if (table && Array.isArray(data)) {
          data.forEach(entry => {
            const row = document.createElement("tr");
            Object.values(entry).forEach(val => {
              const td = document.createElement("td");
              td.textContent = val;
              row.appendChild(td);
            });
            table.appendChild(row);
          });
        }
      })
      .catch(err => console.error("Failed to load history:", err));
  }
}

// Show logged-in user name
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  if (user && document.getElementById("user-name")) {
    document.getElementById("user-name").textContent = user;
  }
});

// Logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
