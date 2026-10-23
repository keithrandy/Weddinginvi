/* CUSTOMIZE THESE FIRST.
   Wedding date must include Philippine timezone offset +08:00.
   Example: '2027-05-16T15:00:00+08:00'
*/
const SETTINGS = {
  weddingDate: '2026-12-12T10:30:00+08:00', // Leave empty until your wedding date is confirmed
  rsvpEmail: '' // Example: 'your-email@example.com' (must be a real inbox)
};

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const countdownStatus = document.querySelector('#countdown-status');
const ids = ['days', 'hours', 'minutes', 'seconds'];
function updateCountdown() {
  if (!SETTINGS.weddingDate) return;
  const target = new Date(SETTINGS.weddingDate);
  if (Number.isNaN(target.getTime())) {
    countdownStatus.textContent = 'Please enter a valid wedding date in script.js.';
    return;
  }
  const label = new Intl.DateTimeFormat('en-PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  }).format(target);;
  document.querySelector('[data-wedding-date-label]').textContent = label.toUpperCase();
  const difference = target.getTime() - Date.now();
  if (difference <= 0) {
    countdownStatus.textContent = 'Our special day is here!';
    ids.forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  countdownStatus.textContent = `Counting down to ${label}`;
  const values = [Math.floor(difference / 86400000), Math.floor(difference / 3600000) % 24, Math.floor(difference / 60000) % 60, Math.floor(difference / 1000) % 60];
  ids.forEach((id, index) => document.getElementById(id).textContent = String(values[index]).padStart(2, '0'));
}
updateCountdown();
if (SETTINGS.weddingDate) setInterval(updateCountdown, 1000);


/* =================================
   WEDDING RSVP FORM
================================= */

// Find the RSVP form in HTML
const rsvpForm = document.getElementById("weddingRsvpForm");

if (rsvpForm) {

  // Find the sections we want to show or hide
  const yesFields = document.getElementById("rsvpYesFields");
  const noMessage = document.getElementById("rsvpNoMessage");
  const childCount = document.getElementById("rsvpChildCount");
  const emailField = document.getElementById("rsvpEmail");
  const childNumber = document.getElementById("rsvpChildrenNumber");
  const submitButton = document.getElementById("rsvpSubmit");
  const errorMessage = document.getElementById("rsvpError");

  // Formspree connection (we'll add the real ID later)

  const RSVP_ENDPOINT = "https://formspree.io/f/xzeebnwj";


  // Find the selected radio button
  function getAnswer(name) {
    const selected = rsvpForm.querySelector(
      `input[name="${name}"]:checked`
    );

    return selected ? selected.value : "";
  }

  // Show or hide the children question
  function updateChildren() {
    const showChildren =
      getAnswer("attendance") === "Yes" &&
      getAnswer("children_invited") === "Yes";

    childCount.hidden = !showChildren;
    childNumber.required = showChildren;
    childNumber.disabled = !showChildren;

    if (!showChildren) {
      childNumber.value = "";
    }
  }

  // Show different fields for Yes and No
  function updateAttendance() {
    const answer = getAnswer("attendance");

    yesFields.hidden = answer !== "Yes";
    noMessage.hidden = answer !== "No";

    emailField.required = answer === "Yes";
    emailField.disabled = answer !== "Yes";

    submitButton.hidden = !answer;

    submitButton.textContent =
      answer === "Yes" ? "Submit RSVP" : "Send Response";

    updateChildren();
  }

  // Run when someone chooses Yes or No
  rsvpForm.querySelectorAll(
    'input[name="attendance"]'
  ).forEach(radio => {
    radio.addEventListener("change", updateAttendance);
  });

  // Run when someone answers the children question
  rsvpForm.querySelectorAll(
    'input[name="children_invited"]'
  ).forEach(radio => {
    radio.addEventListener("change", updateChildren);
  });

  // Set the correct starting appearance
  updateAttendance();

  // Run when the guest submits the form
  rsvpForm.addEventListener("submit", async function (event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Check required fields
    if (!rsvpForm.reportValidity()) return;

    // Don't submit until Formspree is connected
    if (RSVP_ENDPOINT.includes("YOUR_FORM_ID")) {
      errorMessage.textContent =
        "The RSVP form is not connected yet.";
      errorMessage.hidden = false;
      return;
    }

    const guestName =
      document.getElementById("rsvpName").value.trim();

    const attendance = getAnswer("attendance");

    // Prepare the response information
    const details = {
      full_name: guestName,
      attendance: attendance,
      email: attendance === "Yes" ? emailField.value : "",
      children_invited: attendance === "Yes"
        ? getAnswer("children_invited")
        : "Not applicable",
      children_attending:
        attendance === "Yes" &&
          getAnswer("children_invited") === "Yes"
          ? childNumber.value
          : "0"
    };

    // Temporarily disable the button
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    errorMessage.hidden = true;

    try {
      // Send the RSVP to Formspree
      const response = await fetch(RSVP_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(details),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Could not submit RSVP");
      }

      // Show the thank-you screen
      const successMessage =
        document.getElementById("rsvpSuccessMessage");

      if (attendance === "Yes") {
        successMessage.textContent =
          `Thank you, ${guestName}! We're delighted
          you'll be celebrating with us.
          See you on December 12, 2026!`;
      } else {
        successMessage.textContent =
          `Thank you, ${guestName}! We completely
          understand and appreciate your response.
          Although we'll miss you, we're grateful
          to have you in our lives.`;
      }

      rsvpForm.hidden = true;

      document.getElementById("rsvpSuccess").hidden = false;

    } catch (error) {
      errorMessage.textContent =
        "Something went wrong. Please try again.";
      errorMessage.hidden = false;

    } finally {
      submitButton.disabled = false;
      submitButton.textContent =
        attendance === "Yes"
          ? "Submit RSVP"
          : "Send Response";
    }
  });
}
