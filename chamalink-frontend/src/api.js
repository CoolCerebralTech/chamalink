const API_URL = 'http://localhost:3000/api';

export async function createContribution(data) {
  const res = await fetch(`${API_URL}/contributions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create contribution');
  return res.json();
}

export async function getContribution(code) {
  const res = await fetch(`${API_URL}/contributions/${code}`);
  if (!res.ok) throw new Error('Contribution not found');
  return res.json();
}

export async function getAdminContribution(token) {
  const res = await fetch(`${API_URL}/contributions/admin/${token}`);
  if (!res.ok) throw new Error('Invalid admin token');
  return res.json();
}

export async function addMember(code, data) {
  const res = await fetch(`${API_URL}/members/${code}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add member');
  return res.json();
}

export async function updateMemberStatus(memberId, status, adminToken) {
  const res = await fetch(`${API_URL}/members/${memberId}/status?admin_token=${adminToken}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function getWhatsAppSummary(token) {
  const res = await fetch(`${API_URL}/members/summary/${token}`);
  if (!res.ok) throw new Error('Failed to generate summary');
  return res.json();
}