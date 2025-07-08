console.log("🔥 main.js loaded!");

const BASE_API = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://kedi-moneynetwork.onrender.com";

// Helper: POST JSON (signup, login)
async function postJson(url = '', data = {}) {
  try {
    const res = await fetch(`${BASE_API}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    alert("Ikibazo! Network Error. Gerageza kongera.");
    console.error(err);
  }
}

// Helper: POST FormData (transaction forms)
async function postFormData(url = '', formData) {
  try {
    const res = await fetch(`${BASE_API}${url}`, {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (err) {
    alert("Ikibazo! Network Error. Gerageza kongera.");
    console.error(err);
  }
}

// LOGIN page
if (window.location.pathname.includes("login.html")) {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.querySelector("#username").value.trim();
      const password = document.querySelector("#password").value.trim();

      const result = await postJson("/api/login", { username, password });

      if (result?.success) {
        localStorage.setItem("user", username);
        window.location.href = "dashboard.html";
      } else {
        alert("Login failed! Ongera ugenzure izina cyangwa ijambo banga.");
      }
    });
  }
}

// SIGNUP page (JSON POST)
if (window.location.pathname.includes("signup.html") || window.location.pathname.includes("tree.html")) {
  const form = document.getElementById("signupForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      // Convert FormData to plain object for JSON
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      const result = await postJson("/api/signup", data);

      if (result?.referralId) {
        Swal.fire({
          icon: 'success',
          title: 'Wiyandikishije neza!',
          html: `Referral ID yawe ni: <strong>${result.referralId}</strong>`,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        setTimeout(() => {
          window.location.href = "login.html";
        }, 3000);
      } else {
        Swal.fire("Signup Failed", result?.message || "Unknown error.", "error");
      }
    });
  }
}

// TRANSACTION forms (kubitsa, kubikuza, kugurizwa)
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
      formData.append("user", localStorage.getItem("user") || "unknown");

      const result = await postFormData("/api/submit", formData);

      if (result?.success) {
        Swal.fire("Byoherejwe", "Transaction submitted neza!", "success");
        form.reset();
      } else {
        Swal.fire("Transaction Failed", result?.message || "Unknown error", "error");
      }
    });
  }
}

// DASHBOARD: Load transaction history
if (window.location.pathname.includes("dashboard.html")) {
  const user = localStorage.getItem("user");
  if (user) {
    fetch(`${BASE_API}/api/history?user=${user}`)
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

// Show logged-in user name if available
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  if (user && document.getElementById("user-name")) {
    document.getElementById("user-name").textContent = user;
  }
});

// LOGOUT function
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
