// Check login status
function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

// Logout function
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Attach logout button (if exists on page)
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Protect dashboard
  const protectedPages = ['dashboard.html', 'form.html', 'loan.html'];
  const currentPage = window.location.pathname.split('/').pop();

  if (protectedPages.includes(currentPage) && !isLoggedIn()) {
    window.location.href = 'login.html';
  }
});

// Login form handler
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Network error");
    console.error(err);
  }
}
