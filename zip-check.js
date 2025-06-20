console.log("ZIP script loaded manually.");

// States we don’t deliver to
const blockedStates = ["WA", "OR", "NV", "UT", "ID", "MT", "ME", "AK", "HI"];
const redirectUrl = "https://5mingourmet.com/collections/meals";

// Wait for DOM content
window.addEventListener("DOMContentLoaded", () => {
  // Try to find the CTA "button" (actually a div) by visible text
  const divs = Array.from(document.querySelectorAll("div"));
  const ctaBtn = divs.find((el) => el.textContent.trim().toLowerCase() === "pick your meals");

  if (!ctaBtn) {
    console.warn("CTA button not found.");
    return;
  }

  console.log("CTA button found. Attaching ZIP handler.");

  ctaBtn.addEventListener("click", async (e) => {
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
      } else {
        window.location.href = redirectUrl;
      }
    } catch (err) {
      console.error("ZIP error:", err);
      alert("We couldn’t validate your ZIP. Please try again.");
    }
  });
});
