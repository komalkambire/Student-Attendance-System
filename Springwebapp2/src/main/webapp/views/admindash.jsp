<%-- admin_dashboard.jsp (with Embedded CSS) --%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Dashboard</title>

    <%-- External Bootstrap & Font Awesome --%>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <%-- INTERNAL CSS STYLES --%>
    <style>
      :root{ --sidebar-width: 260px; }
      body{ background:#f5f7fb; }
      .sidebar{
        width:var(--sidebar-width);
        height:100vh;
        position:fixed;
        left:0; top:0;
        background:linear-gradient(180deg,#2b5f9e,#1b3a66);
        color:#fff;
        padding:1.5rem 1rem;
      }
      .sidebar .brand{ font-weight:700; font-size:1.2rem; }
      .sidebar a{ color:rgba(255,255,255,0.9); text-decoration:none; }
      .sidebar a:hover,
      .sidebar a:focus {
          background: rgba(255, 255, 255, 0.1);
      }
      .content{ margin-left:var(--sidebar-width); padding:2rem; }
      .card-transparent{ background:rgba(255,255,255,0.9); }
      .table thead th{ white-space:nowrap; }
      .status-badge{ min-width:90px; display:inline-block; }
      .small-muted{ color:#6c757d; font-size:0.9rem; }
      .search-row .form-control{ min-width:240px; }
      @media (max-width: 900px){
        .sidebar{ position:relative; width:100%; height:auto }
        .content{ margin-left:0; }
      }
    </style>
    
  </head>
  <body>

    <nav class="sidebar d-flex flex-column">
      <div class="mb-4">
        <div class="brand d-flex align-items-center gap-2">
          <i class="fa-solid fa-chalkboard-user fa-lg"></i>
          <div>
            <div>Attendance</div>
            <div style="font-size:0.8rem; opacity:0.85">Admin Panel</div>
          </div>
        </div>
      </div>

      <div class="my-3">
        <a href="#" class="d-block py-2 px-2 rounded-2"><i class="fa-solid fa-tachometer-alt me-2"></i> Dashboard</a>
        <a href="#users" class="d-block py-2 px-2 rounded-2"><i class="fa-solid fa-users me-2"></i> Manage Users</a>
        <a href="#teachers" class="d-block py-2 px-2 rounded-2"><i class="fa-solid fa-chalkboard-teacher me-2"></i> Manage Teachers</a>
        <a href="#settings" class="d-block py-2 px-2 rounded-2"><i class="fa-solid fa-gear me-2"></i> Settings</a>
      </div>

      <div class="mt-auto small-muted">
        Logged in as<br>
        <strong>admin@example.com</strong>
      </div>
    </nav>

    <main class="content">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0">Admin Dashboard</h3>
        <div>
          <button class="btn btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#changePwdModal"><i class="fa-solid fa-key me-1"></i> Change Password</button>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTeacherModal"><i class="fa-solid fa-user-plus me-1"></i> Add Teacher</button>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="card card-transparent p-3 shadow-sm">
            <h6>Totals</h6>
            <div class="d-flex gap-3 mt-2">
              <div>
                <div class="h3" id="total-students">--</div>
                <div class="small-muted">Students</div>
              </div>
              <div>
                <div class="h3" id="total-teachers">--</div>
                <div class="small-muted">Teachers</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-8">
          <div class="card p-3 shadow-sm">
            <h6 class="mb-3">Quick Actions</h6>
            <div class="d-flex flex-wrap gap-2">
              <button class="btn btn-outline-success" id="exportBtn"><i class="fa-solid fa-file-export me-1"></i> Export CSV</button>
              <button class="btn btn-outline-secondary" id="refreshBtn"><i class="fa-solid fa-arrows-rotate me-1"></i> Refresh Data</button>
              <button class="btn btn-outline-danger" id="deactivateSelected"><i class="fa-solid fa-user-slash me-1"></i> Deactivate Selected</button>
            </div>
          </div>
        </div>
      </div>

      <section id="users" class="mb-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">Users (Teachers & Students)</h5>
              <div class="small-muted">View and manage user accounts</div>
            </div>

            <div class="row align-items-center mb-3 search-row gx-2">
              <div class="col-auto">
                <select id="roleFilter" class="form-select">
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                </select>
              </div>
              <div class="col-auto">
                <input type="text" id="searchInput" class="form-control" placeholder="Search by name or ID">
              </div>
              <div class="col-auto">
                <label class="small">Date from</label>
                <input type="date" id="dateFrom" class="form-control">
              </div>
              <div class="col-auto">
                <label class="small">Date to</label>
                <input type="date" id="dateTo" class="form-control">
              </div>
              <div class="col-auto ms-auto">
                <button class="btn btn-outline-secondary" id="clearFilters">Clear</button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover align-middle" id="usersTable">
                <thead class="table-light">
                  <tr>
                    <th><input type="checkbox" id="selectAll"></th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3">
              <div>
                <small id="rowsInfo" class="small-muted"></small>
              </div>
              <nav>
                <ul class="pagination mb-0" id="pagination"></ul>
              </nav>
            </div>

          </div>
        </div>
      </section>

      <section id="teachers" class="mt-4">
        <div class="card shadow-sm p-3">
          <h5>Manage Teachers</h5>
          <p class="small-muted">Quick list of teachers with assigned classes (optional)</p>

          <div id="teachersList" class="row gy-2"></div>
        </div>
      </section>

    </main>

    <div class="modal fade" id="profileModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">User Profile</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div id="profileContent"></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="addTeacherModal" tabindex="-1">
      <div class="modal-dialog modal-md modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Teacher</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form id="addTeacherForm">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" name="name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" name="email" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" name="password" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Assign Classes (comma separated)</label>
                <input type="text" class="form-control" name="classes">
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button class="btn btn-primary" type="submit">Add Teacher</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="changePwdModal" tabindex="-1">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Change Admin Password</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form id="changePwdForm">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Current Password</label>
                <input type="password" class="form-control" name="current" required>
              </div>
              <div class="mb-3">
                <label class="form-label">New Password</label>
                <input type="password" class="form-control" name="new" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Confirm New Password</label>
                <input type="password" class="form-control" name="confirm" required>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button class="btn btn-primary" type="submit">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <%-- Bootstrap JS and external script link --%>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/admin_dashboard.js"></script>

  </body>
</html>