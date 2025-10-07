<%-- student_dashboard.jsp --%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Student Dashboard</title>
  
  <%-- CSS Links --%>
  <link href="css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">

  <style>
    :root { --sidebar-width: 240px; }
    body { background: #f4f7fb; min-height:100vh; }
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      position: fixed;
      left: 0; top: 0;
      background: linear-gradient(180deg,#1e3a8a,#0b2546);
      color: #fff;
      padding: 1.4rem 1rem;
      display: flex; 
      flex-direction: column; 
    }
    .sidebar .brand { font-weight:700; font-size:1.15rem; margin-bottom: 1rem; display:flex; align-items:center; gap:.6rem; }
    .sidebar a { color: rgba(255,255,255,0.95); text-decoration:none; display:block; padding:.45rem .6rem; border-radius:6px; }
    .sidebar a:hover { background: rgba(255,255,255,0.06); }
    .content { margin-left: var(--sidebar-width); padding: 1.6rem; }
    .card-transparent { background: rgba(255,255,255,0.95); }
    .small-muted { color:#6c757d; font-size:.9rem; }
    .avatar { width:68px; height:68px; border-radius:50%; object-fit:cover; }
    .student-selfie-thumb { width:48px; height:48px; border-radius:6px; object-fit:cover; }
    .pointer { cursor:pointer; }
    @media (max-width:900px) {
      .sidebar { position: relative; width:100%; height:auto; display:flex; gap:1rem; overflow:auto }
      .content { margin-left:0; }
    }
  </style>
</head>
<body>

  <nav class="sidebar">
    <div class="brand">
      <i class="fa-solid fa-user-graduate fa-lg"></i>
      <div>
        <div>Student Portal</div>
        <small style="opacity:.9">Attendance & Profile</small>
      </div>
    </div>

    <a href="#dashboard" id="navDashboard"><i class="fa-solid fa-house me-2"></i> Dashboard</a>
    <a href="#mark" id="navMark"><i class="fa-solid fa-clock me-2"></i> Mark Attendance</a>
    <a href="#history" id="navHistory"><i class="fa-solid fa-list-check me-2"></i> Attendance History</a>
    <a href="#profile" id="navProfile"><i class="fa-solid fa-id-card me-2"></i> My Profile</a>
    
    <div class="mt-auto" style="margin-top:1rem;">
      <button class="btn btn-outline-light btn-sm w-100" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
    </div>
  </nav>

  <main class="content">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 id="pageTitle">Welcome</h3>
      <div>
        <span id="signedInAs" class="me-3 small-muted"></span>
        </div>
    </div>

    <section id="dashboardSection" class="mb-4">
      <div class="row g-3">
        <div class="col-md-4">
          <div class="card card-transparent p-3 shadow-sm">
            <div class="d-flex align-items-center gap-3">
              <img id="dashAvatar" class="avatar" src="https://i.pravatar.cc/100?img=12" alt="avatar">
              <div>
                <div id="dashName" style="font-weight:600">Guest</div>
                <div id="dashId" class="small-muted">—</div>
              </div>
            </div>
            <div class="mt-3 small-muted" id="dashContact"></div>
          </div>
        </div>

        <div class="col-md-8">
          <div class="card p-3 shadow-sm">
            <h6>Quick Actions</h6>
            <div class="mt-2 d-flex gap-2 flex-wrap">
              <button class="btn btn-primary" id="gotoMark"><i class="fa-solid fa-fingerprint me-1"></i> Mark Attendance</button>
              <button class="btn btn-outline-secondary" id="gotoHistory"><i class="fa-solid fa-clock-rotate-left me-1"></i> View History</button>
              <button class="btn btn-outline-info" id="gotoProfile"><i class="fa-solid fa-user-pen me-1"></i> Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="markSection" class="mb-4" style="display:none;">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5>Mark Attendance (Punch In)</h5>
          <p class="small-muted">Click the camera button to take a selfie and mark your attendance. The current date & time will be recorded.</p>

          <div class="row gy-3">
            <div class="col-md-6">
              <div class="ratio ratio-4x3 bg-black rounded-2 overflow-hidden" id="cameraWrap">
                <video id="cameraVideo" autoplay playsinline style="width:100%; height:100%; object-fit:cover;"></video>
                <img id="cameraCaptured" style="display:none; width:100%; height:100%; object-fit:cover;" alt="captured">
              </div>
              <div class="mt-2 d-flex gap-2">
                <button class="btn btn-outline-primary" id="startCameraBtn"><i class="fa-solid fa-camera"></i> Start Camera</button>
                <button class="btn btn-primary" id="captureBtn" disabled><i class="fa-solid fa-circle-nodes"></i> Capture & Punch</button>
                <button class="btn btn-outline-danger" id="stopCameraBtn" style="display:none;"><i class="fa-solid fa-square"></i> Stop</button>
              </div>
              <div class="mt-2 small-muted">Note: Allow camera permission when prompted.</div>
            </div>

            <div class="col-md-6">
              <div class="card p-3">
                <div><strong>Last Punch</strong></div>
                <div class="mt-2" id="lastPunch">No attendance recorded yet.</div>
                <div class="mt-3">
                  <button id="downloadTodayBtn" class="btn btn-outline-success btn-sm" style="display:none;"><i class="fa-solid fa-download me-1"></i> Download Entry</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </section>

    <section id="historySection" class="mb-4" style="display:none;">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5>Attendance History</h5>

          <div class="row align-items-center g-2 mb-3">
            <div class="col-auto">
              <input type="date" id="historyFrom" class="form-control" />
            </div>
            <div class="col-auto">
              <input type="date" id="historyTo" class="form-control" />
            </div>
            <div class="col-auto">
              <input type="text" id="historySearch" class="form-control" placeholder="Search by date or time" />
            </div>
            <div class="col-auto ms-auto">
              <button class="btn btn-outline-secondary btn-sm" id="clearHistoryFilters">Clear</button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Punch-in Time</th>
                  <th>Selfie</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="historyTable"></tbody>
            </table>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-2">
            <div class="small-muted" id="historyInfo"></div>
            <nav>
              <ul class="pagination mb-0" id="historyPagination"></ul>
            </nav>
          </div>
        </div>
      </div>
    </section>

    <section id="profileSection" style="display:none;">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5>My Profile</h5>

          <div class="row g-3 mt-2">
            <div class="col-md-4 text-center">
              <img id="profilePic" class="avatar mb-2" src="https://i.pravatar.cc/100?img=50" alt="avatar">
              <div>
                <label class="btn btn-sm btn-outline-primary">
                  Change Picture <input type="file" id="profilePicInput" accept="image/*" hidden>
                </label>
              </div>
            </div>

            <div class="col-md-8">
              <form id="profileForm" class="row g-2">
                <div class="col-md-6">
                  <label class="form-label">Full Name</label>
                  <input type="text" id="profileName" class="form-control" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input type="email" id="profileEmail" class="form-control" required disabled> </div>
                <div class="col-md-6">
                  <label class="form-label">Contact</label>
                  <input type="text" id="profileContact" class="form-control">
                </div>

                <div class="col-12 mt-2 d-flex gap-2">
                  <button class="btn btn-primary" type="submit">Save Profile</button>
                  </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>

  </main>

  <div class="modal fade" id="viewSelfieModal" tabindex="-1">
    <div class="modal-dialog modal-sm modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Selfie</h5><button class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body text-center">
          <img id="viewSelfieImg" src="" alt="selfie" style="width:100%; border-radius:6px; object-fit:cover;">
        </div>
      </div>
    </div>
  </div>

  <%-- External JS/Bundle Links --%>
  <script src="css/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

  <%-- Link to your separate JS file --%>
  <script src="js/dashboard.js"></script> 
</body>
</html>