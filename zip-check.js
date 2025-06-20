// zip-check.js – hosted externally to bypass GHL CSP

document.addEventListener("DOMContentLoaded", () => {
  const blockedStates = ["WA", "OR", "NV", "UT", "ID", "MT", "ME", "AK", "HI"];
  const redirectUrl = "https://5mingourmet.com/collections/meals";

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("button, a, .button, .btn, .your-custom-class");
    if (!btn || !btn.textContent.includes("Pick Your Meals")) return;

    const inputs = document.querySelectorAll("input");
    let zip = "";

    inputs.forEach((input) => {
      const val = input.value.trim();
      if (/^\d{5}$/.test(val)) zip = val;
    });

    if (!zip) {
      alert("Please enter a valid 5-digit ZIP code.");
      e.preventDefault();
      return;
    }

    e.preventDefault();

    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) throw new Error("ZIP lookup failed");

      const data = await res.json();
      const state = data.places?.[0]?.["state abbreviation"];

      if (!state) throw new Error("No state found");

      if (blockedStates.includes(state)) {
        alert(`Sorry, we don't deliver to ${state}.`);
      } else {
        window.location.href = redirectUrl;
      }
    } catch (err) {
      console.error("ZIP error:", err);
      alert("We couldn’t validate your ZIP. Please try again.");
    }
  });
});
