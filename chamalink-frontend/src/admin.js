import { getAdminContribution, updateMemberStatus, getWhatsAppSummary } from './api.js';

const params = new URLSearchParams(window.location.search);
const token = params.get('token');

const loading = document.getElementById('loading');
const content = document.getElementById('content');
const error = document.getElementById('error');

let contribution = null;

async function loadContribution() {
  try {
    contribution = await getAdminContribution(token);
    
    document.getElementById('title').textContent = contribution.title;
    document.getElementById('description').textContent = contribution.description || '';
    document.getElementById('total').textContent = `KES ${contribution.totalConfirmed.toLocaleString()}`;
    
    const memberUrl = `${window.location.origin}/contribution.html?code=${contribution.code}`;
    document.getElementById('memberLink').value = memberUrl;
    
    renderMembers(contribution.members);
    await loadWhatsAppSummary();
    
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
    list.innerHTML = '<p style="color: var(--gray-700);">No contributions yet.</p>';
    return;
  }
  
  list.innerHTML = members.map(m => `
    <div class="member-item">
      <div class="member-info">
        <div class="member-name">${m.name}</div>
        <div class="member-amount">KES ${m.amount.toLocaleString()}</div>
      </div>
      <div style="display: flex; gap: 8px;">
        ${m.status === 'pending' 
          ? `<button class="btn btn-success btn-sm" onclick="confirmMember('${m.id}')">Confirm</button>`
          : `<span class="status-badge status-confirmed">✅ Confirmed</span>`
        }
      </div>
    </div>
  `).join('');
}

async function loadWhatsAppSummary() {
  try {
    const { summary } = await getWhatsAppSummary(token);
    document.getElementById('whatsappSummary').textContent = summary;
  } catch (err) {
    document.getElementById('whatsappSummary').textContent = 'Error loading summary';
  }
}

window.confirmMember = async (memberId) => {
  try {
    await updateMemberStatus(memberId, 'confirmed', token);
    await loadContribution(); // Reload
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

window.copyLink = () => {
  const input = document.getElementById('memberLink');
  input.select();
  document.execCommand('copy');
  
  const btn = event.target;
  const original = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = original, 2000);
};

window.copySummary = () => {
  const summary = document.getElementById('whatsappSummary').textContent;
  navigator.clipboard.writeText(summary);
  
  const btn = event.target;
  const original = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = original, 2000);
};

if (!token) {
  loading.style.display = 'none';
  error.style.display = 'block';
} else {
  loadContribution();
}