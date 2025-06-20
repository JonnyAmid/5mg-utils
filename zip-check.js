console.log("Injecting ZIP script manually...");

// List of blocked state abbreviations
const blockedStates = ["WA", "OR", "NV", "UT", "ID", "MT", "ME", "AK", "HI"];
const redirectUrl = "https://5mingourmet.com/collections/meals";

window.addEventListener("DOMContentLoaded", () => {
  console.log("ZIP script loaded successfully.");

  // Grab the first visible form on the page
  const form = document.querySelector("form");
  if (!form) {
    console.warn("Form not found.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = document.querySelectorAll("input");
    let zip = "";

    inputs.forEach((input) => {
      const val = input.value.trim();
      if (/^\d{5}$/.test(val)) zip = val;
    });

    if (!zip) {
      alert("Please enter a valid 5-digit ZIP code.");
      return;
    }

    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) throw new Error("ZIP lookup failed");

      const data = await res.json();
      const state = data.places?.[0]?.["state abbreviation"];
      if (!state) throw new Error("No state found");

      if (blockedStates.includes(state)) {
        alert(`Sorry, we don't deliver to ${state}.`);
        return;
      }

      // Success – redirect or allow normal submission
      window.location.href = redirectUrl;

    } catch (err) {
      console.error("ZIP validation error:", err);
      alert("We couldn’t validate your ZIP. Please try again.");
    }
  });
});
