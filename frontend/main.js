// ✅ Base URL ya backend yawe kuri Render
const BASE_API = "https://kedi-moneynetwork.onrender.com";

// ✅ Helper function yo kohereza POST request
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

// ✅ Login handler
if (window.location.pathname.includes("login.html")) {
  document.querySelector("form")?.addEventListener("submit", async (e) => {
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

// ✅ Signup handler
if (window.location.pathname.includes("signup.html")) {
  document.querySelector("form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    const result = await postData("/api/signup", { username, password });

    if (result.success) {
      alert("Signup successful! You can now login.");
      window.location.href = "login.html";
    } else {
      alert("Signup failed! " + result.message);
    }
  });
}

// ✅ Transaction forms (koherereza amafaranga, kubikuza, kugurizwa)
if (
  window.location.pathname.includes("fomukw.html") ||
  window.location.pathname.includes("kubikuza.html") ||
  window.location.pathname.includes("kugurizwa.html")
) {
  document.querySelector("form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {};
    formData.forEach((value, key) => (payload[key] = value));
    payload.user = localStorage.getItem("user");

    const result = await postData("/api/submit", payload);

    if (result.success) {
      alert("Transaction submitted successfully!");
    } else {
      alert("Transaction failed: " + result.message);
    }
  });
}

// ✅ Load history data kuri dashboard
if (window.location.pathname.includes("dashboard.html")) {
  fetch(`${BASE_API}/api/history`)
    .then((res) => res.json())
    .then((data) => {
      const user = localStorage.getItem("user");
      const table = document.querySelector("#history");
      if (table) {
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

// ✅ Set user name on dashboard
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  if (user && document.getElementById("user-name")) {
    document.getElementById("user-name").textContent = user;
  }
});

// ✅ Logout function
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
