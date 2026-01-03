import { api } from './api';

// DOM Elements
const loadingDiv = document.getElementById('loading');
const errorCard = document.getElementById('error-card');
const mainContent = document.getElementById('main-content');
const joinCard = document.getElementById('join-card');
const successCard = document.getElementById('success-card');
const form = document.getElementById('join-form');
const submitBtn = document.getElementById('submit-btn');

// Get Code from URL
const params = new URLSearchParams(window.location.search);
const code = params.get('code');

async function init() {
  if (!code) {
    showError();
    return;
  }

  try {
    // 1. Fetch Group Details
    const group = await api.getGroupPublic(code);
    renderGroup(group);
  } catch (err) {
    console.error(err);
    showError();
  }
}

function renderGroup(group) {
  loadingDiv.classList.add('hidden');
  mainContent.classList.remove('hidden');

  document.getElementById('group-title').textContent = group.title;
  document.getElementById('group-desc').textContent = group.description;

  if (group.whatsapp_link) {
    const waContainer = document.getElementById('whatsapp-container');
    const waLink = document.getElementById('whatsapp-link');
    waLink.href = group.whatsapp_link;
    waContainer.classList.remove('hidden');
  }
}

function showError() {
  loadingDiv.classList.add('hidden');
  errorCard.classList.remove('hidden');
}

// Handle Join
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const amount = parseInt(document.getElementById('amount').value);

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    await api.joinGroup(code, { name, amount });

    // Show Success
    joinCard.classList.add('hidden');
    successCard.classList.remove('hidden');
  } catch (err) {
    alert('Error joining: ' + err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Pledge / Pay 💸';
  }
});

// Start
init();