// js/teacher_dashboard.js

// Dummy Data (In a real Spring Boot app, this would be loaded via AJAX/Fetch)
const students = [
  {id:'S101', name:'Anita Sharma', enrolled:'2024-06-10', contact:'anita@mail.com', img:'https://i.pravatar.cc/100?img=1', attendance:[{date:'2025-10-01',time:'09:05',selfie:'https://i.pravatar.cc/80?img=1'}, {date:'2025-10-02',time:'09:00',selfie:'https://i.pravatar.cc/80?img=11'}]},
  {id:'S102', name:'Rohit Kumar', enrolled:'2025-01-15', contact:'rohit@mail.com', img:'https://i.pravatar.cc/100?img=2', attendance:[{date:'2025-10-01',time:'09:10',selfie:'https://i.pravatar.cc/80?img=2'}]},
  {id:'S103', name:'Meera Joshi', enrolled:'2025-02-20', contact:'meera@mail.com', img:'https://i.pravatar.cc/100?img=3', attendance:[{date:'2025-10-01',time:'09:02',selfie:'https://i.pravatar.cc/80?img=3'}, {date:'2025-10-02',time:'08:58',selfie:'https://i.pravatar.cc/80?img=13'}]}
];

// Element IDs
const attDate = document.getElementById('attDate');
const attSearch = document.getElementById('attSearch');
const attendanceTable = document.getElementById('attendanceTable');
const stuDate = document.getElementById('stuDate');
const stuSearch = document.getElementById('stuSearch');
const studentTable = document.getElementById('studentTable');
const profileContent = document.getElementById('profileContent');

/**
 * Renders the Attendance Table based on filters.
 */
function renderAttendance(){
    const dateFilter = attDate.value;
    const search = attSearch.value.toLowerCase();
    
    // Flatten all attendance records into a single array
    const allAttendance = students.flatMap(s => s.attendance.map(a => ({
        ...a,
        id: s.id,
        name: s.name,
        img: s.img // Include image for display
    })));

    attendanceTable.innerHTML = allAttendance.map(a => {
        // Apply filters
        if((!dateFilter || a.date === dateFilter) &&
           (!search || a.name.toLowerCase().includes(search) || a.id.toLowerCase().includes(search))){
            
            // Use escaped template literal for safety
            return `
                <tr>
                    <td>\${a.id}</td>
                    <td>\${a.name}</td>
                    <td>\${a.date}</td>
                    <td>\${a.time}</td>
                    <td><img src="\${a.selfie}" class="student-img"></td>
                </tr>
            `;
        }
        return ''; // Return empty string if filters don't match
    }).join('');
}

/**
 * Renders the Student List Table based on filters.
 */
function renderStudents(){
    const dateFilter = stuDate.value;
    const search = stuSearch.value.toLowerCase();
    
    studentTable.innerHTML = students.map(s => {
        // Apply filters
        if((!dateFilter || s.enrolled >= dateFilter) &&
           (!search || s.name.toLowerCase().includes(search) || s.id.toLowerCase().includes(search))){
            
            // Use escaped template literal
            return `
                <tr>
                    <td>\${s.id}</td>
                    <td>\${s.name}</td>
                    <td>\${s.enrolled}</td>
                    <td><button class="btn btn-sm btn-outline-primary" onclick="openProfile('\${s.id}')">View Profile</button></td>
                </tr>
            `;
        }
        return '';
    }).join('');
}

/**
 * Opens the Student Profile Modal.
 * @param {string} id - The ID of the student.
 */
window.openProfile = function(id){
    const s = students.find(x => x.id === id);
    if (!s) return;

    // Build the attendance history table rows
    const historyRows = s.attendance.map(a => 
        // Use escaped template literal for history rows
        `<tr>
            <td>\${a.date}</td>
            <td>\${a.time}</td>
            <td><img src="\${a.selfie}" width="40" class="rounded-circle"></td>
        </tr>`
    ).join('');

    profileContent.innerHTML = `
        <div class="row">
            <div class="col-md-4 text-center">
                <img src="\${s.img}" class="rounded-circle mb-2" width="120" height="120">
                <h5>\${s.name}</h5>
                <p class="small-muted">\${s.id}</p>
                <p>Email: \${s.contact}</p>
            </div>
            <div class="col-md-8">
                <h6>Attendance History</h6>
                <table class="table table-sm">
                    <thead><tr><th>Date</th><th>Punch-in</th><th>Selfie</th></tr></thead>
                    <tbody>
                        \${historyRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    // Ensure Bootstrap is initialized before trying to use its classes
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        new bootstrap.Modal(document.getElementById('profileModal')).show();
    } else {
        console.error("Bootstrap JS not loaded correctly.");
    }
}

// --- Event Listeners Setup ---

// Attendance Filters
attDate.addEventListener('change', renderAttendance);
attSearch.addEventListener('input', renderAttendance);
document.getElementById('clearAttFilters').addEventListener('click', () => {
    attDate.value = '';
    attSearch.value = '';
    renderAttendance();
});

// Student Filters
stuDate.addEventListener('change', renderStudents);
stuSearch.addEventListener('input', renderStudents);
document.getElementById('clearStuFilters').addEventListener('click', () => {
    stuDate.value = '';
    stuSearch.value = '';
    renderStudents();
});

// --- Initialization ---
function init(){ 
    renderAttendance();
    renderStudents();
}

// Run initialization when the DOM is ready
document.addEventListener('DOMContentLoaded', init);