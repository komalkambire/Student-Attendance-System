// js/dashboard.js

/*******************************
 * Simple client-side Student Dashboard (Simplified Fixed User)
 * - Stores users and attendance in localStorage
 * - Camera capture for selfie using getUserMedia
 * - Authentication removed, fixed user always active
 ********************************/

// ---------- Utilities ----------
const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));

// Storage keys
const USERS_KEY = 'student_portal_users';
const CURRENT_KEY = 'student_portal_current'; // Kept to simulate 'signed in' state
const ATT_KEY = 'student_portal_attendance'; // map of email -> [records]

// Fixed Demo User's Email
const DEMO_EMAIL = 'demo@student.com';
const DEMO_ID = 'S1234';

// Default demo user and dummy attendance (for easier testing)
function ensureDemoUser() {
    const demoUser = {
        id: DEMO_ID,
        name: 'Demo Student',
        email: DEMO_EMAIL,
        password: 'password', // kept for data structure consistency, but unused
        contact: '1234567890',
        avatar: 'https://i.pravatar.cc/100?img=32',
        joined: '2023-01-20'
    };

    const users = [demoUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    setCurrent(DEMO_EMAIL); // Always set the demo user as current

    // Insert dummy attendance
    let att = getAttendance();
    if (!att[DEMO_EMAIL] || att[DEMO_EMAIL].length === 0) {
        att[DEMO_EMAIL] = [
            { id: DEMO_ID, name: demoUser.name, email: DEMO_EMAIL, date: '2024-10-01', time: '09:05:00', selfie: 'https://i.pravatar.cc/48?img=1' },
            { id: DEMO_ID, name: demoUser.name, email: DEMO_EMAIL, date: '2024-10-02', time: '09:15:00', selfie: 'https://i.pravatar.cc/48?img=2' },
            { id: DEMO_ID, name: demoUser.name, email: DEMO_EMAIL, date: '2024-10-03', time: '08:55:00', selfie: 'https://i.pravatar.cc/48?img=3' },
            { id: DEMO_ID, name: demoUser.name, email: DEMO_EMAIL, date: '2024-10-04', time: '09:00:00', selfie: 'https://i.pravatar.cc/48?img=4' },
            { id: DEMO_ID, name: demoUser.name, email: DEMO_EMAIL, date: '2024-10-07', time: '09:01:00', selfie: 'https://i.pravatar.cc/48?img=5' },
            { id: DEMO_ID, name: demoUser.name, email: DEMO_EMAIL, date: '2024-10-08', time: '09:07:00', selfie: 'https://i.pravatar.cc/48?img=6' },
        ];
        saveAttendance(att);
    }
}

function getUsers(){ return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function getAttendance(){ return JSON.parse(localStorage.getItem(ATT_KEY) || '{}'); }
function saveAttendance(a){ localStorage.setItem(ATT_KEY, JSON.stringify(a)); }
function setCurrent(email){ localStorage.setItem(CURRENT_KEY, email); }
function getCurrent(){ return localStorage.getItem(CURRENT_KEY); }
function clearCurrent(){ localStorage.removeItem(CURRENT_KEY); }

// ---------- UI Elements ----------
const logoutBtn = qs('#logoutBtn');
const signedInAs = qs('#signedInAs');
const dashName = qs('#dashName');
const dashId = qs('#dashId');
const dashContact = qs('#dashContact');
const dashAvatar = qs('#dashAvatar');
const profilePic = qs('#profilePic');
const profileName = qs('#profileName');
const profileEmail = qs('#profileEmail');
const profileContact = qs('#profileContact');

// Sections
const dashboardSection = qs('#dashboardSection');
const markSection = qs('#markSection');
const historySection = qs('#historySection');
const profileSection = qs('#profileSection');

// Camera elements
const startCameraBtn = qs('#startCameraBtn');
const stopCameraBtn = qs('#stopCameraBtn');
const captureBtn = qs('#captureBtn');
const cameraVideo = qs('#cameraVideo');
const cameraCaptured = qs('#cameraCaptured');
const lastPunchDiv = qs('#lastPunch');
const downloadTodayBtn = qs('#downloadTodayBtn');

// History
const historyTable = qs('#historyTable');
const historyPagination = qs('#historyPagination');
const historyInfo = qs('#historyInfo');

// Forms
const profileForm = qs('#profileForm');
const profilePicInput = qs('#profilePicInput');

// Filters
const historyFrom = qs('#historyFrom');
const historyTo = qs('#historyTo');
const historySearch = qs('#historySearch');
const clearHistoryFilters = qs('#clearHistoryFilters');

// Pagination settings
const PAGE_SIZE = 6;
let currentHistoryPage = 1;

// Camera stream
let streamRef = null;

// ---------- Initialization ----------
ensureDemoUser();
refreshAuthUI();
setupEventListeners();

// ---------- Event Listeners ----------
function setupEventListeners(){
  qs('#gotoMark').addEventListener('click', ()=> showSection('mark'));
  qs('#gotoHistory').addEventListener('click', ()=> showSection('history'));
  qs('#gotoProfile').addEventListener('click', ()=> showSection('profile'));

  logoutBtn.addEventListener('click', ()=> {
    clearCurrent(); 
    refreshAuthUI();
    alert('Logged out. Reload page to log in fixed demo user.');
  });
  
  // Start/Stop camera and capture
  startCameraBtn.addEventListener('click', startCamera);
  stopCameraBtn.addEventListener('click', stopCamera);
  captureBtn.addEventListener('click', captureAndPunch);

  // Profile picture upload
  profilePicInput.addEventListener('change', e=>{
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      profilePic.src = reader.result; dashAvatar.src = reader.result;
      updateCurrentUser({ avatar: reader.result });
    };
    reader.readAsDataURL(f);
  });

  // Save profile
  profileForm.addEventListener('submit', e=>{
    e.preventDefault();
    const nm = profileName.value.trim();
    const ct = profileContact.value.trim();
    const users = getUsers();
    const cur = getCurrent();
    if(!cur){ alert('Not signed in (error).'); return; }
    const idx = users.findIndex(u=>u.email===cur);
    if(idx===-1){ alert('User not found (error).'); return; }
    
    users[idx].name = nm;
    users[idx].contact = ct;
    saveUsers(users);
    refreshAuthUI();
    alert('Profile updated (demo).');
  });

  // Download single today's entry
  downloadTodayBtn.addEventListener('click', ()=>{
    const cur = getCurrent(); if(!cur) return;
    const att = getAttendance();
    const arr = att[cur] || [];
    if(arr.length === 0) return;
    const last = arr[arr.length -1];
    const csv = `ID,Name,Email,Date,Time\n${last.id},${encodeURIComponent(last.name)},${last.email},${last.date},${last.time}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'attendance_entry.csv'; a.click();
    URL.revokeObjectURL(url);
  });

  // History filters
  historyFrom.addEventListener('change', ()=>{ currentHistoryPage=1; renderHistory(); });
  historyTo.addEventListener('change', ()=>{ currentHistoryPage=1; renderHistory(); });
  historySearch.addEventListener('input', ()=>{ currentHistoryPage=1; renderHistory(); });
  clearHistoryFilters.addEventListener('click', ()=>{ historyFrom.value=''; historyTo.value=''; historySearch.value=''; currentHistoryPage=1; renderHistory(); });

  // Profile navigation
  qs('#navDashboard').addEventListener('click', ()=> showSection('dashboard'));
  qs('#navMark').addEventListener('click', ()=> showSection('mark'));
  qs('#navHistory').addEventListener('click', ()=> showSection('history'));
  qs('#navProfile').addEventListener('click', ()=> showSection('profile'));
}

// ---------- Auth UI ----------
function refreshAuthUI(){
  const cur = getCurrent();
  if(!cur){
    signedInAs.innerText = 'Not Signed In (Logged Out)';
    logoutBtn.style.display = 'none';
    qs('.sidebar small').innerText = 'Not Signed In';
    dashName.innerText = 'Guest';
    dashId.innerText = '—';
    dashContact.innerText = 'Demo user logged out. Reload page to log in fixed user.';
    dashAvatar.src = 'https://i.pravatar.cc/100?img=12';
    profilePic.src = 'https://i.pravatar.cc/100?img=50';
    profileName.value = '';
    profileEmail.value = '';
    profileContact.value = '';
    showSection('dashboard');
    renderHistory();
    return;
  }
  const users = getUsers();
  const user = users.find(u => u.email === cur);
  if(!user){
    clearCurrent();
    refreshAuthUI();
    return;
  }
  // update UI
  signedInAs.innerText = `Signed in: ${user.name}`;
  logoutBtn.style.display = 'block';
  qs('.sidebar small').innerText = user.email;
  dashName.innerText = user.name;
  dashId.innerText = user.id;
  dashContact.innerText = `Contact: ${user.contact || '—'} • Joined: ${user.joined || '—'}`;
  dashAvatar.src = user.avatar || 'https://i.pravatar.cc/100?img=12';
  profilePic.src = user.avatar || 'https://i.pravatar.cc/100?img=50';
  profileName.value = user.name;
  profileEmail.value = user.email;
  profileContact.value = user.contact || '';
  renderLastPunch();
  renderHistory();
}

// ---------- Show Section ----------
function showSection(key){
  dashboardSection.style.display = (key==='dashboard') ? '' : 'none';
  markSection.style.display = (key==='mark') ? '' : 'none';
  historySection.style.display = (key==='history') ? '' : 'none';
  profileSection.style.display = (key==='profile') ? '' : 'none';
  // update title
  const map = { dashboard: 'Dashboard', mark: 'Mark Attendance', history: 'Attendance History', profile: 'My Profile' };
  qs('#pageTitle').innerText = map[key] || 'Student Portal';
}

// ---------- Camera functions ----------
async function startCamera(){
  const cur = getCurrent();
  if(!cur){ alert('Demo user is logged out. Reload page.'); return; }
  try {
    streamRef = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio:false });
    cameraVideo.srcObject = streamRef;
    cameraVideo.style.display = '';
    cameraCaptured.style.display = 'none';
    captureBtn.disabled = false;
    stopCameraBtn.style.display = 'inline-block';
    startCameraBtn.style.display = 'none';
  } catch(err){
    alert('Unable to access camera: ' + err.message);
  }
}

function stopCamera(){
  if(streamRef){
    streamRef.getTracks().forEach(t => t.stop());
    streamRef = null;
  }
  cameraVideo.srcObject = null;
  cameraVideo.style.display = 'none';
  cameraCaptured.style.display = 'none';
  captureBtn.disabled = true;
  stopCameraBtn.style.display = 'none';
  startCameraBtn.style.display = 'inline-block';
}

function captureAndPunch(){
  const cur = getCurrent();
  if(!cur){ alert('Demo user is logged out. Reload page.'); return; }
  
  // capture frame from video
  const video = cameraVideo;
  const w = video.videoWidth, h = video.videoHeight;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, w, h);
  const data = canvas.toDataURL('image/jpeg', 0.85);
  
  // show captured
  cameraCaptured.src = data;
  cameraCaptured.style.display = '';
  cameraVideo.style.display = 'none';
  
  // save attendance
  const users = getUsers(); const user = users.find(u => u.email === cur);
  if(!user){ alert('User not found (error)'); return; }
  const att = getAttendance();
  if(!att[cur]) att[cur] = [];
  const now = new Date();
  // Ensure date/time format consistency
  const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
  
  const rec = { id: user.id, name: user.name, email: user.email, date: dateStr, time: timeStr, selfie: data };
  att[cur].push(rec);
  saveAttendance(att);
  renderLastPunch();
  renderHistory();
  
  // enable download button
  downloadTodayBtn.style.display = '';
  
  // stop camera to avoid leaving it on
  stopCamera();
  alert('Attendance marked successfully (demo).');
}

// ---------- Attendance Last Punch ----------
function renderLastPunch(){
  const cur = getCurrent();
  if(!cur){ lastPunchDiv.innerText = 'No attendance recorded yet.'; downloadTodayBtn.style.display='none'; return; }
  const attendance = getAttendance();
  const arr = attendance[cur] || [];
  if(arr.length === 0){ lastPunchDiv.innerText = 'No attendance recorded yet.'; downloadTodayBtn.style.display='none'; return; }
  const last = arr[arr.length - 1];
  // Use escaped template literals to prevent JSP EL parsing
  lastPunchDiv.innerHTML = `<div><strong>\${last.date} \${last.time}</strong></div><div class="mt-2"><img src="\${last.selfie}" class="student-selfie-thumb"></div>`;
  downloadTodayBtn.style.display = '';
}

// ---------- History rendering with pagination ----------
function renderHistory(){
  const cur = getCurrent();
  const attendance = getAttendance();
  const arr = (cur && attendance[cur]) ? [...attendance[cur]].reverse() : []; // latest first
  // filters
  const from = historyFrom.value;
  const to = historyTo.value;
  const q = historySearch.value.trim().toLowerCase();
  let filtered = arr.filter(r=>{
    if(from && r.date < from) return false;
    if(to && r.date > to) return false;
    if(q && !(r.date.includes(q) || r.time.includes(q))) return false;
    return true;
  });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if(currentHistoryPage > pages) currentHistoryPage = pages;
  const start = (currentHistoryPage -1)* PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  // render rows - FIX APPLIED: Escaping the '$' in JavaScript template literals.
  historyTable.innerHTML = pageItems.map((r, idx)=>`
    <tr>
      <td>\${start + idx + 1}</td>
      <td>\${r.date}</td>
      <td>\${r.time}</td>
      <td><img src="\${r.selfie}" class="student-selfie-thumb pointer" onclick="viewSelfie('\${encodeURIComponent(r.selfie)}')"></td>
      <td><button class="btn btn-sm btn-outline-secondary" onclick="downloadSelfie('\${encodeURIComponent(r.selfie)}','\${r.date}_\${r.time.replace(/:/g,'-')}')"><i class="fa-solid fa-download"></i> Selfie</button></td>
    </tr>
  `).join('');

  // pagination
  historyPagination.innerHTML = '';
  for(let i=1;i<=pages;i++){
    const li = document.createElement('li');
    li.className = 'page-item ' + (i===currentHistoryPage ? 'active' : '');
    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.innerText = i;
    a.addEventListener('click', (e)=>{ e.preventDefault(); currentHistoryPage = i; renderHistory(); });
    li.appendChild(a);
    historyPagination.appendChild(li);
  }

  historyInfo.innerText = total ? `Showing \${start+1} to \${Math.min(start + PAGE_SIZE, total)} of \${total} records` : 'No records to show';
}

// Expose functions used in inline handlers
window.viewSelfie = function(dataEnc){
  const data = decodeURIComponent(dataEnc);
  qs('#viewSelfieImg').src = data;
  new bootstrap.Modal(qs('#viewSelfieModal')).show();
};

window.downloadSelfie = function(dataEnc, name){
  const data = decodeURIComponent(dataEnc);
  // create link
  const a = document.createElement('a');
  a.href = data;
  a.download = (name || 'selfie') + '.jpg';
  a.click();
};

// Update current user partial fields (avatar, contact, name)
function updateCurrentUser(patch){
  const cur = getCurrent();
  if(!cur) return;
  const users = getUsers();
  const idx = users.findIndex(u=>u.email === cur);
  if(idx === -1) return;
  users[idx] = { ...users[idx], ...patch };
  saveUsers(users);
  refreshAuthUI();
}

// Clean up camera when leaving page
window.addEventListener('beforeunload', ()=>{ if(streamRef) streamRef.getTracks().forEach(t => t.stop()); });