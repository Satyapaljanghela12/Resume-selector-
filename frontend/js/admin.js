// admin dashboard
const tokenA = localStorage.getItem('token');
if (!tokenA) window.location = '/login/admin.html';
const headersA = { 'Authorization': `Bearer ${tokenA}`, 'Content-Type': 'application/json' };

async function loadStats() {
  const res = await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${tokenA}` }});
  const d = await res.json();
  document.getElementById('statsBlock').innerHTML = `
    <div>Total Students: ${d.totalStudents}</div>
    <div>Total TPCs: ${d.totalTPC}</div>
    <div>Resumes Uploaded: ${d.resumesUploaded}</div>
  `;
}

async function loadUsers() {
  const res = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${tokenA}` }});
  const d = await res.json();
  const container = document.getElementById('usersTable');
  if (!res.ok) return container.innerHTML = 'Failed to load';
  container.innerHTML = `<table class="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Blocked</th><th>Actions</th></tr></thead><tbody>
    ${d.users.map(u => `<tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>${u.blocked ? 'Yes' : 'No'}</td>
      <td>
        <button onclick="blockUser('${u._id}', ${u.blocked})" class="btn btn-sm btn-warning">${u.blocked ? 'Unblock' : 'Block'}</button>
        <button onclick="deleteUser('${u._id}')" class="btn btn-sm btn-danger">Delete</button>
      </td>
    </tr>`).join('')}
  </tbody></table>`;
}

async function blockUser(id, currentlyBlocked) {
  await fetch(`/api/admin/users/${id}/block`, {
    method: 'POST',
    headers: headersA,
    body: JSON.stringify({ block: !currentlyBlocked })
  });
  loadUsers();
}

async function deleteUser(id) {
  if (!confirm('Delete user?')) return;
  await fetch(`/api/admin/users/${id}`, { method:'DELETE', headers: headersA });
  loadUsers();
}

document.getElementById('logout').addEventListener('click', () => { localStorage.removeItem('token'); window.location = '/'; });

loadStats();
loadUsers();
