import { getContribution, addMember } from './api.js';

const params = new URLSearchParams(window.location.search);
const code = params.get('code');

const loading = document.getElementById('loading');
const content = document.getElementById('content');
const error = document.getElementById('error');
const form = document.getElementById('memberForm');
const success = document.getElementById('success');

let contribution = null;

async function loadContribution() {
  try {
    contribution = await getContribution(code);
    
    document.getElementById('title').textContent = contribution.title;
    document.getElementById('description').textContent = contribution.description || '';
    document.getElementById('total').textContent = `KES ${contribution.totalConfirmed.toLocaleString()}`;
    
    renderMembers(contribution.members);
    
    loading.style.display = 'none';
    content.style.display = 'block';
  } catch (err) {
    loading.style.display = 'none';
    error.style.display = 'block';
  }
}

function renderMembers(members) {
  const list = document.getElementById('memberList');
  
  if (members.length === 0) {
    list.innerHTML = '<p style="color: var(--gray-700);">No contributions yet. Be the first!</p>';
    return;
  }
  
  list.innerHTML = members.map(m => `
    <div class="member-item">
      <div class="member-info">
        <div class="member-name">${m.name}</div>
        <div class="member-amount">KES ${m.amount.toLocaleString()}</div>
      </div>
      <span class="status-badge status-${m.status}">
        ${m.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
      </span>
    </div>
  `).join('');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const btn = form.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Submitting...';
  
  try {
    const data = {
      name: document.getElementById('name').value,
      amount: parseInt(document.getElementById('amount').value),
    };
    
    await addMember(code, data);
    
    form.style.display = 'none';
    success.style.display = 'block';
    
    // Reload to show updated list
    setTimeout(() => loadContribution(), 1000);
  } catch (error) {
    alert('Error: ' + error.message);
    btn.disabled = false;
    btn.textContent = 'Submit Contribution';
  }
});

if (!code) {
  loading.style.display = 'none';
  error.style.display = 'block';
} else {
  loadContribution();
}