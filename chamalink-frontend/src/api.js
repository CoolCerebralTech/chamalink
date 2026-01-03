// 👇 Read from Vite Environment Variable, fallback to localhost for dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// Helper to handle responses
async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    return await res.json();
  } catch (err) {
    alert(err.message); // Simple error handling
    throw err;
  }
}

export const api = {
  // Create a new group
  createGroup: (data) => 
    fetchJson('/contributions', { method: 'POST', body: JSON.stringify(data) }),

  // Get public group info (for members)
  getGroupPublic: (code) => 
    fetchJson(`/contributions/code/${code}`),

  // Get admin group info (for owner)
  getGroupAdmin: (token) => 
    fetchJson(`/contributions/admin/${token}`),

  // Get admin member list
  getMembers: (token) => 
    fetchJson(`/members/admin/${token}`),

  // Join a group
  joinGroup: (code, data) => 
    fetchJson(`/members/${code}`, { method: 'POST', body: JSON.stringify(data) }),

  // Update payment status
  updateStatus: (id, token, status) => 
    fetchJson(`/members/${id}`, { 
      method: 'PATCH', 
      body: JSON.stringify({ admin_token: token, status }) 
    }),

  // Get WhatsApp Summary
  getWhatsapp: (token) => 
    fetchJson(`/members/whatsapp/${token}`),
};