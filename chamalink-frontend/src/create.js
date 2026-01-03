import { api } from './api';

const form = document.getElementById('create-form');
const createCard = document.getElementById('create-card');
const successCard = document.getElementById('success-card');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // 1. Get Values
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const whatsapp_link = document.getElementById('whatsapp').value;

  // 2. Loading State
  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating...';

  try {
    // 3. Call API
    const data = await api.createGroup({ title, description, whatsapp_link });

    // 4. Generate Links based on current URL
    const baseUrl = window.location.origin;
    
    // Admin Link: /admin.html?token=...
    const adminUrl = `${baseUrl}/admin.html?token=${data.admin_token}`;
    
    // Member Link: /contribution.html?code=...
    const memberUrl = `${baseUrl}/contribution.html?code=${data.code}`;

    // 5. Show Success UI
    createCard.classList.add('hidden');
    successCard.classList.remove('hidden');

    // Populate inputs
    document.getElementById('admin-link').value = adminUrl;
    document.getElementById('member-link').value = memberUrl;
    document.getElementById('go-admin-btn').href = adminUrl;

    // 6. Setup Copy Buttons
    setupCopyBtn('copy-admin', adminUrl);
    setupCopyBtn('copy-member', memberUrl);

  } catch (err) {
    console.error(err);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Link 🚀';
  }
});

function setupCopyBtn(id, text) {
  const btn = document.getElementById(id);
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(text);
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = originalText, 2000);
  });
}