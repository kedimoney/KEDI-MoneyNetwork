// ✅ Dynamic base URL ya backend (ikora local na online)
const BASE_API = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://kedi-moneynetwork.onrender.com";

// ✅ Helper: POST request (JSON)
async function postData(url = '', data = {}) {
  const response = await fetch(`${BASE_API}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// ✅ Helper: POST request for FormData (e.g. images)
async function postFormData(url = '', formData) {
  const response = await fetch(`${BASE_API}${url}`, {
    method: "POST",
    body: formData
  });
  return response.json();
}

// ✅ Login Handler
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

// ✅ Signup Handler
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

// ✅ Transaction Forms
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

// ✅ Dashboard: Load History
if (window.location.pathname.includes("dashboard.html")) {
  fetch(`${BASE_API}/api/history`)
    .then((res) => res.json())
    .then((data) => {
      const user = localStorage.getItem("user");
      const table = document.querySelector("#history");
      if (table && Array.isArray(data)) {
        data
          .filter((entry) => entry.user === user)
          .forEach((entry) => {
            const row = document.createElement("tr");
            Object.values(entry).forEach((val) => {
              const td = document.createElement("td");
              td.textContent = val;
              row.appendChild(td);
            });
            table.appendChild(row);
          });
      }
    })
    .catch((err) => {
      console.error("Failed to load history:", err);
    });
}

// ✅ Show Logged-in User Name
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  if (user && document.getElementById("user-name")) {
    document.getElementById("user-name").textContent = user;
  }
});

// ✅ Logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
