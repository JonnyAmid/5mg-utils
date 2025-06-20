console.log("Injecting ZIP script manually...");

const blockedStates = ["WA", "OR", "NV", "UT", "ID", "MT", "ME", "AK", "HI"];
const redirectUrl = "https://5mingourmet.com/collections/meals";

window.addEventListener("DOMContentLoaded", () => {
  console.log("ZIP script loaded successfully.");

  const button = document.querySelector('[data-cy="form-submit-button"]');
  if (!button) {
    console.warn("Submit button not found.");
    return;
  }

  button.addEventListener("click", async (e) => {
    console.log("Button click intercepted.");

    const inputs = document.querySelectorAll("input");
    let zip = "";

    inputs.forEach((input) => {
      const val = input.value.trim();
      if (/^\d{5}$/.test(val)) zip = val;
    });

    console.log("ZIP detected:", zip);
    if (!zip) {
      alert("Please enter a valid 5-digit ZIP code.");
      return;
    }

    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) throw new Error("ZIP lookup failed");

      const data = await res.json();
      const state = data.places?.[0]?.["state abbreviation"];
      console.log("State detected:", state);
      if (!state) throw new Error("No state found");

      if (blockedStates.includes(state)) {
        alert(`Sorry, we don't deliver to ${state}.`);
        return;
      }

      console.log("Redirecting to:", redirectUrl);
      window.location.href = redirectUrl;

    } catch (err) {
      console.error("ZIP validation error:", err);
      alert("We couldn’t validate your ZIP. Please try again.");
    }

    e.preventDefault(); // Stop GHL from doing anything if ZIP check fails
  });
});
