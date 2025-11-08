const validator = require('email-validator');

let disposableDomains = new Set();

const fetchDisposableDomains = async () => {
  try {
    const { default: fetch } = await import('node-fetch');
    const res = await fetch('https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf');
    if (!res.ok) {
      console.error('Failed to fetch disposable email domains list.');
      return;
    }
    const text = await res.text();
    disposableDomains = new Set(text.split('\n').filter(Boolean));
    console.log('Disposable email domains list updated successfully.');
  } catch (err) {
    console.error('Error fetching disposable email domains list:', err);
  }
};

// Fetch the list on startup
fetchDisposableDomains();

const isDisposable = (email) => {
  if (!email || typeof email !== 'string') return false;
  const domain = email.split('@')[1];
  return disposableDomains.has(domain);
};

const isValidEmail = (email) => {
  return validator.validate(email) && !isDisposable(email);
};

module.exports = {
  isValidEmail,
  isDisposable,
  fetchDisposableDomains,
};