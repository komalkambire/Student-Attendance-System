// js/admin_dashboard.js

// Sample data (This would typically come from a Spring Boot REST API endpoint)
const users = [
    {id:'S1001', name:'Anita Sharma', role:'student', joined:'2024-07-02', status:'active', attendance:[{date:'2025-09-28',status:'Present'},{date:'2025-09-27',status:'Absent'}]},
    {id:'S1002', name:'Rohit Kumar', role:'student', joined:'2025-01-15', status:'active', attendance:[{date:'2025-09-28',status:'Present'}]},
    {id:'T2001', name:'Priya Singh', role:'teacher', joined:'2023-11-20', status:'active', classes:['10-A','10-B'], attendance:[]},
    {id:'T2002', name:'Vikram Patel', role:'teacher', joined:'2025-08-01', status:'inactive', classes:['9-A'], attendance:[]},
    {id:'S1003', name:'Meera Joshi', role:'student', joined:'2025-02-10', status:'active', attendance:[]},
    {id:'S1004', name:'Amit Rao', role:'student', joined:'2025-03-22', status:'inactive', attendance:[]}
];

let filtered = [...users];
const pageSize = 4;
let currentPage = 1;

// DOM Elements
const tbody = document.querySelector('#usersTable tbody');
const pagination = document.getElementById('pagination');
const rowsInfo = document.getElementById('rowsInfo');
const roleFilter = document.getElementById('roleFilter');
const searchInput = document.getElementById('searchInput');
const dateFrom = document.getElementById('dateFrom');
const dateTo = document.getElementById('dateTo');
const clearFiltersBtn = document.getElementById('clearFilters');
const selectAllCheckbox = document.getElementById('selectAll');
const deactivateSelectedBtn = document.getElementById('deactivateSelected');
const exportBtn = document.getElementById('exportBtn');
const refreshBtn = document.getElementById('refreshBtn');
const addTeacherForm = document.getElementById('addTeacherForm');
const changePwdForm = document.getElementById('changePwdForm');
const profileContent = document.getElementById('profileContent');

function renderStats(){
    document.getElementById('total-students').innerText = users.filter(u=>u.role==='student').length;
    document.getElementById('total-teachers').innerText = users.filter(u=>u.role==='teacher').length;
}

function renderTable(){
    const start = (currentPage-1)*pageSize;
    const pageItems = filtered.slice(start, start+pageSize);
    
    // Using escaped template literals to avoid JSP EL conflict, though this is now in a .js file.
    // It's a good habit when working in a JSP environment.
    tbody.innerHTML = pageItems.map(u => {
        return `
            <tr>
                <td><input type="checkbox" class="rowSelect" data-id="\${u.id}"></td>
                <td>\${u.id}</td>
                <td>\${u.name}</td>
                <td>\${u.role.charAt(0).toUpperCase() + u.role.slice(1)}</td>
                <td>\${u.joined}</td>
                <td><span class="badge \${u.status === 'active' ? 'bg-success' : 'bg-secondary'} status-badge">\${u.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1 viewProfile" data-id="\${u.id}"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn btn-sm btn-outline-\${u.status === 'active' ? 'danger' : 'success'} toggleStatus" data-id="\${u.id}">\${u.status === 'active' ? 'Disable' : 'Enable'}</button>
                </td>
            </tr>
        `;
    }).join('');

    rowsInfo.innerText = `Showing \${Math.min(filtered.length, start + 1)} to \${Math.min(filtered.length, start + pageSize)} of \${filtered.length} records`;
    renderPagination();
    attachRowEvents();
}

function renderPagination(){
    const pageCount = Math.ceil(filtered.length / pageSize) || 1;
    pagination.innerHTML = '';
    for(let i=1;i<=pageCount;i++){
        const li = document.createElement('li');
        li.className = `page-item \${i === currentPage ? 'active' : ''}`;
        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.innerText = i;
        a.addEventListener('click',(e)=>{ e.preventDefault(); currentPage=i; renderTable(); });
        li.appendChild(a);
        pagination.appendChild(li);
    }
}

function attachRowEvents(){
    document.querySelectorAll('.viewProfile').forEach(btn=>{
        btn.addEventListener('click',()=>{
            const id = btn.dataset.id;
            const u = users.find(x=>x.id===id);
            openProfile(u);
        });
    });
    document.querySelectorAll('.toggleStatus').forEach(btn=>{
        btn.addEventListener('click',()=>{
            const id = btn.dataset.id;
            const u = users.find(x=>x.id===id);
            u.status = u.status==='active'?'inactive':'active';
            filtered = applyFilters();
            renderStats();
            renderTable();
            renderTeachers(); // Re-render teachers list on status change
        });
    });
}

function openProfile(user){
    profileContent.innerHTML = `
      <div class="row">
        <div class="col-md-4 text-center">
          <div class="p-3 border rounded-3">
            <i class="fa-solid fa-user-tie fa-3x mb-2"></i>
            <h5>\${user.name}</h5>
            <div class="small-muted">\${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
            <div class="mt-2"><strong>ID:</strong> \${user.id}</div>
            <div><strong>Joined:</strong> \${user.joined}</div>
            <div class="mt-2"><span class="badge \${user.status === 'active' ? 'bg-success' : 'bg-secondary'}">\${user.status}</span></div>
          </div>
        </div>
        <div class="col-md-8">
          <h6>Personal Details</h6>
          <table class="table table-borderless small">
            <tr><th>Name</th><td>\${user.name}</td></tr>
            <tr><th>Role</th><td>\${user.role}</td></tr>
            <tr><th>Joined</th><td>\${user.joined}</td></tr>
            <tr><th>Status</th><td>\${user.status}</td></tr>
            \${user.classes ? \`<tr><th>Classes</th><td>\${(user.classes || []).join(', ')}</td></tr>\` : ''}
          </table>

          <h6 class="mt-3">Attendance History</h6>
          <div style="max-height:200px; overflow:auto; border:1px solid #eee; padding:0.5rem; border-radius:6px; background:#fafafa;">
            \${user.attendance && user.attendance.length ? \`
            <table class="table table-sm mb-0">
                <thead><tr><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                    \${user.attendance.map(a => \`<tr><td>\${a.date}</td><td>\${a.status}</td></tr>\`).join('')}
                </tbody>
            </table>\` : '<div class="small-muted">No attendance records available.</div>'}
          </div>
        </div>
      </div>
    `;
    const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
    profileModal.show();
}

function applyFilters(){
    const role = roleFilter.value;
    const q = searchInput.value.trim().toLowerCase();
    const from = dateFrom.value;
    const to = dateTo.value;

    return users.filter(u=>{
        if(role!=='all' && u.role!==role) return false;
        if(q){ if(!(u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q))) return false; }
        if(from && u.joined < from) return false;
        if(to && u.joined > to) return false;
        return true;
    });
}

function renderTeachers(){
    const container = document.getElementById('teachersList');
    const teachers = users.filter(u=>u.role==='teacher');
    container.innerHTML = teachers.map(t=>`
      <div class="col-md-4">
          <div class="p-2 border rounded-3 bg-white"> 
              <div class="d-flex justify-content-between">
                  <div>
                      <strong>\${t.name}</strong>
                      <div class="small-muted">\${t.id}</div>
                  </div>
                  <div>
                      <span class="badge bg-\${t.status === 'active' ? 'success' : 'secondary'}">\${t.status}</span>
                  </div>
              </div>
              <div class="mt-2 small-muted">Classes: \${(t.classes || []).join(', ') || '—'}</div>
          </div>
      </div>
    `).join('');
}


// --- Event Listeners Setup ---

// Filter events
roleFilter.addEventListener('change',()=>{ filtered = applyFilters(); currentPage=1; renderTable(); });
searchInput.addEventListener('input',()=>{ filtered = applyFilters(); currentPage=1; renderTable(); });
dateFrom.addEventListener('change',()=>{ filtered = applyFilters(); currentPage=1; renderTable(); });
dateTo.addEventListener('change',()=>{ filtered = applyFilters(); currentPage=1; renderTable(); });

// Clear Filters
clearFiltersBtn.addEventListener('click',()=>{ 
    roleFilter.value='all'; 
    searchInput.value=''; 
    dateFrom.value=''; 
    dateTo.value=''; 
    filtered = applyFilters(); 
    currentPage=1; 
    renderTable(); 
});

// Select All
selectAllCheckbox.addEventListener('change', (e)=>{
    document.querySelectorAll('.rowSelect').forEach(cb=>cb.checked = e.target.checked);
});

// Deactivate Selected
deactivateSelectedBtn.addEventListener('click', ()=>{
    document.querySelectorAll('.rowSelect:checked').forEach(cb=>{
        const id = cb.dataset.id;
        const u = users.find(x=>x.id===id);
        if(u) u.status='inactive';
    });
    filtered = applyFilters(); renderStats(); renderTable(); renderTeachers();
});

// Export CSV (client-side exporter)
exportBtn.addEventListener('click', ()=>{
    const rows = users.map(u=>[u.id,u.name,u.role,u.joined,u.status].map(d=>`"${d}"`).join(','));
    const csv = ['ID,Name,Role,Joined,Status', ...rows].join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='users_export.csv'; a.click(); URL.revokeObjectURL(url);
});

// Refresh
refreshBtn.addEventListener('click', ()=>{ filtered = applyFilters(); renderStats(); renderTable(); renderTeachers(); });

// Add teacher form
addTeacherForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name'); 
    const email = fd.get('email'); 
    const pwd = fd.get('password'); // Password stored in client-side data only for mock. NOT FOR PRODUCTION.
    const classes = fd.get('classes');
    
    const newId = 'T'+(2000 + Math.floor(Math.random()*9000));
    const newTeacher = { 
        id:newId, 
        name, 
        email, 
        password: pwd, 
        role:'teacher', 
        joined: new Date().toISOString().slice(0,10), 
        status:'active', 
        classes: classes?classes.split(',').map(s=>s.trim()):[],
        attendance: []
    };
    users.push(newTeacher);
    
    filtered = applyFilters(); renderStats(); renderTable(); renderTeachers();
    
    // Get the Bootstrap modal instance and hide it
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('addTeacherModal'));
    if (modalInstance) {
        modalInstance.hide();
    } else {
        // Fallback if instance not found
        alert('Teacher added successfully. Please refresh.'); 
    }
    e.target.reset();
});

// Change password (mock)
changePwdForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const nw = fd.get('new'); 
    const c = fd.get('confirm');
    
    if(nw!==c){ 
        alert('New password and confirm password do not match.'); 
        return; 
    }
    // In a real application, you would send an AJAX request to your Spring Boot Controller here.
    alert('Admin password updated successfully (mock).');
    
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('changePwdModal'));
    if (modalInstance) {
        modalInstance.hide();
    }
    e.target.reset();
});


// --- Initialization ---
function init(){ 
    renderStats(); 
    filtered = applyFilters(); 
    renderTable(); 
    renderTeachers(); 
}

// Run initialization when the DOM is ready
document.addEventListener('DOMContentLoaded', init);