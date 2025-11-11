// student dashboard JS
const token = localStorage.getItem('token');
if (!token) window.location = '/login/student.html';

const headers = { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` };

async function loadProfile() {
  const res = await fetch('/api/student/me', { headers });
  if (!res.ok) { alert('Session expired'); localStorage.removeItem('token'); window.location = '/login/student.html'; return; }
  const profile = await res.json();
  document.getElementById('profileBlock').innerHTML = `
    <strong>${profile.userId?.name || ''}</strong><br>
    <div class="small-muted">${profile.userId?.email || ''}</div>
  `;
  document.getElementById('name').value = profile.userId?.name || '';
  document.getElementById('branch').value = profile.branch || '';
  document.getElementById('year').value = profile.year || '';
  document.getElementById('cgpa').value = profile.cgpa || '';
  renderSkills(profile.skills || []);
  if (profile.resumeUrl) {
    document.getElementById('resumePreview').innerHTML = `<a href="${profile.resumeUrl}" target="_blank">View Resume</a>`;
  }
}
function renderSkills(skills) {
  const c = document.getElementById('skillsContainer');
  c.innerHTML = skills.map(s => `<span class="tag">${s} <a href="#" data-s="${s}" class="remove-s">x</a></span>`).join(' ');
  document.querySelectorAll('.remove-s').forEach(btn => btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const s = btn.dataset.s;
    const newSkills = (skills.filter(x => x !== s));
    await fetch('/api/student/skills', { method:'POST', headers, body: JSON.stringify({ skills: newSkills }) });
    loadProfile();
  }));
}

document.getElementById('skillInput').addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const v = e.target.value.trim();
    if (!v) return;
    const res = await fetch('/api/student/me', { headers });
    const profile = await res.json();
    const skills = profile.skills || [];
    if (!skills.includes(v)) skills.push(v);
    await fetch('/api/student/skills', { method: 'POST', headers, body: JSON.stringify({ skills }) });
    e.target.value = '';
    loadProfile();
  }
});

document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    name: document.getElementById('name').value,
    branch: document.getElementById('branch').value,
    year: +document.getElementById('year').value,
    cgpa: +document.getElementById('cgpa').value
  };
  await fetch('/api/student/update', { method:'POST', headers, body: JSON.stringify(body) });
  alert('Saved');
  loadProfile();
});

document.getElementById('resumeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = document.getElementById('fileInput').files[0];
  if (!f) return alert('Select PDF');
  const fd = new FormData();
  fd.append('resume', f);
  const res = await fetch('/api/student/upload-resume', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
  if (res.ok) { alert('Uploaded'); loadProfile(); } else { const d = await res.json(); alert(d.message || 'Upload failed'); }
});

document.getElementById('logout').addEventListener('click', () => { localStorage.removeItem('token'); window.location = '/'; });

loadProfile();
