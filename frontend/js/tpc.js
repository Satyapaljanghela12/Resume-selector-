// tpc dashboard
const tokenT = localStorage.getItem('token');
if (!tokenT) window.location = '/login/tpc.html';
const headersT = { 'Authorization': `Bearer ${tokenT}` };

document.getElementById('searchBtn').addEventListener('click', async () => {
  const skill = document.getElementById('qSkill').value;
  const branch = document.getElementById('qBranch').value;
  const year = document.getElementById('qYear').value;
  const cgpaMin = document.getElementById('qCgpaMin').value;
  const cgpaMax = document.getElementById('qCgpaMax').value;
  const params = new URLSearchParams();
  if (skill) params.append('skill', skill);
  if (branch) params.append('branch', branch);
  if (year) params.append('year', year);
  if (cgpaMin) params.append('cgpaMin', cgpaMin);
  if (cgpaMax) params.append('cgpaMax', cgpaMax);
  const res = await fetch('/api/tpc/search?' + params.toString(), { headers: headersT });
  const data = await res.json();
  const container = document.getElementById('results');
  if (!res.ok) { alert(data.message || 'Error'); return; }
  container.innerHTML = data.students.map(s => `
    <div class="col-md-4">
      <div class="card p-2 mb-2">
        <strong>${s.userId?.name || 'N/A'}</strong><br>
        <div class="small-muted">${s.branch} • Year ${s.year} • CGPA ${s.cgpa}</div>
        <div class="mt-2">
          ${s.resumeUrl ? `<a class="btn btn-sm btn-outline-primary" href="${s.resumeUrl}" target="_blank">View/Download Resume</a>` : '<small>No resume</small>'}
        </div>
      </div>
    </div>
  `).join('');
});

document.getElementById('logout').addEventListener('click', () => { localStorage.removeItem('token'); window.location = '/'; });
