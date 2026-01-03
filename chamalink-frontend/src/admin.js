import { api } from './api';

const loadingDiv = document.getElementById('loading');
const dashboard = document.getElementById('dashboard');
const membersList = document.getElementById('members-list');
const emptyState = document.getElementById('empty-state');
const refreshBtn = document.getElementById('refresh-btn');
const whatsappBtn = document.getElementById('whatsapp-btn');

// Get Token
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

// Store data locally to recalculate totals easily
let currentMembers = [];

async function init() {
  if (!token) {
    alert('No admin token provided.');
    window.location.href = '/';
    return;
  }
  await loadData();
}

async function loadData() {
  try {
    const data = await api.getMembers(token);
    document.getElementById('group-title').textContent = data.group;
    currentMembers = data.members;
    render();
  } catch (err) {
    alert('Failed to load dashboard: ' + err.message);
  } finally {
    loadingDiv.classList.add('hidden');
    dashboard.classList.remove('hidden');
  }
}

function render() {
  membersList.innerHTML = '';
  
  // Calculate Totals
  let totalCollected = 0;
  let totalPending = 0;

  if (currentMembers.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  } else {
    emptyState.classList.add('hidden');
  }

  currentMembers.forEach(member => {
    if (member.status === 'confirmed') totalCollected += member.amount;
    else totalPending += member.amount;

    // Create Card for Member
    const div = document.createElement('div');
    div.className = 'card';
    div.style.padding = '1rem';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    
    // Left side: Name & Status
    const isPaid = member.status === 'confirmed';
    div.innerHTML = `
      <div>
        <div style="font-weight: 600; font-size: 1.1rem;">${member.name}</div>
        <div style="margin-top: 4px;">
          <span class="badge ${isPaid ? 'confirmed' : 'pending'}">
            ${isPaid ? 'PAID ✅' : 'PENDING ⏳'}
          </span>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: bold; margin-bottom: 8px;">KES ${member.amount.toLocaleString()}</div>
        ${!isPaid ? `<button class="confirm-btn" data-id="${member.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Confirm</button>` : ''}
      </div>
    `;
    membersList.appendChild(div);
  });

  // Handle Confirm Buttons
  document.querySelectorAll('.confirm-btn').forEach(btn => {
    btn.addEventListener('click', (e) => confirmPayment(e.target.dataset.id));
  });

  // Update Header Stats
  document.getElementById('total-amount').textContent = `KES ${totalCollected.toLocaleString()}`;
  document.getElementById('pending-amount').textContent = `KES ${totalPending.toLocaleString()}`;
}

async function confirmPayment(memberId) {
  if (!confirm('Mark this payment as received?')) return;

  try {
    // Optimistic Update (update UI immediately before API)
    const member = currentMembers.find(m => m.id === memberId);
    if (member) member.status = 'confirmed';
    render(); // Re-render to update totals and remove button

    // Call API
    await api.updateStatus(memberId, token, 'confirmed');
  } catch (err) {
    alert('Error updating status');
    // Revert if failed
    await loadData();
  }
}

// Button Actions
refreshBtn.addEventListener('click', loadData);

whatsappBtn.addEventListener('click', async () => {
  whatsappBtn.textContent = 'Generating...';
  try {
    const res = await api.getWhatsapp(token);
    navigator.clipboard.writeText(res.text);
    whatsappBtn.textContent = 'Copied! ✅';
    setTimeout(() => whatsappBtn.textContent = '📋 Copy WhatsApp Update', 2000);
  } catch (err) {
    alert('Failed to generate summary');
    whatsappBtn.textContent = 'Error ❌';
  }
});

// Start
init();