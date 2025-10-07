<%-- teacher_dashboard.jsp (with Embedded CSS) --%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Teacher Dashboard</title>

    <%-- External Bootstrap & Font Awesome --%>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">

    <%-- INTERNAL CSS STYLES --%>
    <style>
      :root{ --sidebar-width: 250px; }
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
      .sidebar a{ color:rgba(255,255,255,0.9); text-decoration:none; display:block; padding:.5rem .75rem; border-radius:6px; }
      .sidebar a:hover{ background:rgba(255,255,255,0.1); }
      .content{ margin-left:var(--sidebar-width); padding:2rem; }
      .table thead th{ white-space:nowrap; }
      .small-muted{ font-size:0.9rem; color:#6c757d; }
      .student-img{ width:40px; height:40px; border-radius:50%; object-fit:cover; }
      @media (max-width: 900px){
        .sidebar{ position:relative; width:100%; height:auto }
        .content{ margin-left:0; }
      }
    </style>
    
  </head>
  <body>

    <nav class="sidebar">
      <div class="mb-4 brand"><i class="fa-solid fa-chalkboard-user me-2"></i> Teacher Panel</div>
      <a href="#dashboard"><i class="fa-solid fa-gauge me-2"></i> Dashboard</a>
      <a href="#attendance"><i class="fa-solid fa-calendar-check me-2"></i> Attendance</a>
      <a href="#students"><i class="fa-solid fa-users me-2"></i> Students</a>
      <a href="#settings"><i class="fa-solid fa-gear me-2"></i> Settings</a>
    </nav>

    <main class="content">
      <h3 class="mb-4">Teacher Dashboard</h3>

      <section id="attendance" class="mb-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5>Attendance Records</h5>
            <div class="row g-2 align-items-center my-3">
              <div class="col-auto">
                <input type="date" class="form-control" id="attDate">
              </div>
              <div class="col-auto">
                <input type="text" id="attSearch" class="form-control" placeholder="Search by name or ID">
              </div>
              <div class="col-auto ms-auto">
                <button class="btn btn-outline-secondary" id="clearAttFilters">Clear Filters</button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered align-middle">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Punch-in</th>
                    <th>Selfie</th>
                  </tr>
                </thead>
                <tbody id="attendanceTable"></tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="students" class="mb-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5>Student List</h5>
            <div class="row g-2 align-items-center my-3">
              <div class="col-auto">
                <input type="date" class="form-control" id="stuDate">
              </div>
              <div class="col-auto">
                <input type="text" id="stuSearch" class="form-control" placeholder="Search by name or ID">
              </div>
              <div class="col-auto ms-auto">
                <button class="btn btn-outline-secondary" id="clearStuFilters">Clear Filters</button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Enrolled</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="studentTable"></tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>

    <div class="modal fade" id="profileModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Student Profile</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" id="profileContent"></div>
        </div>
      </div>
    </div>

    <%-- Bootstrap JS and external script link --%>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/teacher_dashboard.js"></script>
    
  </body>
</html>