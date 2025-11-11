// login & register logic for student page (student.html)
const base = '/api/auth';

if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const res = await fetch(`${base}/login`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password, role: 'student' })
    });
    const data = await res.json();
    if (res.ok) { localStorage.setItem('token', data.token); window.location = '/student/dashboard.html'; }
    else alert(data.message || 'Login failed');
  });
}

if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('rname').value;
    const email = document.getElementById('remail').value;
    const password = document.getElementById('rpassword').value;
    const branch = document.getElementById('rbranch').value;
    const year = document.getElementById('ryear').value;
    const cgpa = document.getElementById('rcgpa').value;
    const res = await fetch(`${base}/register`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, password, branch, year, cgpa })
    });
    const data = await res.json();
    if (res.ok) { alert('Registered - please login'); }
    else alert(data.message || 'Register failed');
  });
}
