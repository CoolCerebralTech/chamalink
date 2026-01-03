import { createContribution } from './api.js';

const form = document.getElementById('createForm');
const result = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const btn = form.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Creating...';
  
  try {
    const data = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value || undefined,
      whatsapp_link: document.getElementById('whatsapp_link').value || undefined,
    };
    
    const contribution = await createContribution(data);
    
    const memberUrl = `${window.location.origin}/contribution.html?code=${contribution.code}`;
    const adminUrl = `${window.location.origin}/admin.html?token=${contribution.admin_token}`;
    
    document.getElementById('memberLink').value = memberUrl;
    document.getElementById('adminLink').value = adminUrl;
    
    form.style.display = 'none';
    result.style.display = 'block';
  } catch (error) {
    alert('Error creating contribution: ' + error.message);
    btn.disabled = false;
    btn.textContent = 'Create Contribution';
  }
});

window.copyLink = (id) => {
  const input = document.getElementById(id);
  input.select();
  document.execCommand('copy');
  
  const btn = event.target;
  const original = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = original, 2000);
};