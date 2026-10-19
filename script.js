/* CUSTOMIZE THESE FIRST.
   Wedding date must include Philippine timezone offset +08:00.
   Example: '2027-05-16T15:00:00+08:00'
*/
const SETTINGS = {
  weddingDate: '', // Leave empty until your wedding date is confirmed
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
  const label = new Intl.DateTimeFormat('en-PH', {month:'long', day:'numeric', year:'numeric', timeZone:'Asia/Manila'}).format(target);
  document.querySelector('[data-wedding-date-label]').textContent = label.toUpperCase();
  const difference = target.getTime() - Date.now();
  if (difference <= 0) {
    countdownStatus.textContent = 'Our special day is here!';
    ids.forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  countdownStatus.textContent = `Counting down to ${label}`;
  const values = [Math.floor(difference/86400000), Math.floor(difference/3600000)%24, Math.floor(difference/60000)%60, Math.floor(difference/1000)%60];
  ids.forEach((id,index) => document.getElementById(id).textContent = String(values[index]).padStart(2,'0'));
}
updateCountdown();
if (SETTINGS.weddingDate) setInterval(updateCountdown,1000);

const rsvpForm = document.getElementById('rsvp-form');
const formMessage = document.getElementById('form-message');
rsvpForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!rsvpForm.reportValidity()) return;
  if (!SETTINGS.rsvpEmail) {
    formMessage.textContent = 'RSVP is not connected yet. Add your email address to SETTINGS.rsvpEmail in script.js first.';
    return;
  }
  const details = new FormData(rsvpForm);
  const guestName = String(details.get('name')).trim();
  const subject = `Wedding RSVP - ${guestName}`;
  const body = `Name: ${guestName}\nAttendance: ${details.get('attendance')}\nGuests including self: ${details.get('guests')}\nMessage: ${details.get('message') || '(none)'}`;
  const mailto = `mailto:${encodeURIComponent(SETTINGS.rsvpEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formMessage.textContent = 'Your email app will open with an RSVP draft. Please press Send there to submit your response.';
  window.location.href = mailto;
});
