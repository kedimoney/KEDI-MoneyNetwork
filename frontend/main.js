console.log("🔥 main.js loaded!");

const BASE_API = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://kedi-moneynetwork.onrender.com";

const form = document.getElementById("signupForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      const res = await fetch(`${BASE_API}/api/signup`, {
        method: "POST",
        body: formData
      });
      const result = await res.json();

      if (res.ok) {
        Swal.fire("Success!", `Referral ID yawe ni ${result.referralId}`, "success");
        form.reset();
      } else {
        Swal.fire("Error", result.message || "Signup Failed", "error");
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire("Error", "Network error", "error");
    }
  });
}
