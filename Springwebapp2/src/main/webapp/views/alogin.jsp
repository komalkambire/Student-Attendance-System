<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Attendance System</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="css/style.css">
    <style>
        body {
            background-image: url('images/AttendImg.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 100vh;
        }

        .overlay {
            background-color: rgba(0, 0, 0, 0.6);
            min-height: 100vh;
        }

        h2 {
            color: white;
            margin-bottom: 30px;
        }

        label, .form-control {
            color: white;
        }

        .btn-primary {
            font-weight: bold;
        }

        .form-control::placeholder {
            color: #ccc;
        }

        footer {
            background-color: rgba(255, 255, 255, 0.7);
        }
    </style>
</head>
<body>
    <div class="overlay d-flex flex-column">
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="index.html">Attendance System</a>
            </div>
        </nav>


		<c:if test="${not empty errorMsg}">
		<h4 style="color: red">${errorMsg}</h4>
		</c:if>
        <!-- Login Form -->
        <div class="container mt-5 flex-grow-1 d-flex align-items-center justify-content-center">
            <div class="col-md-6">
                <h2 class="text-center">Login</h2>
                <form action="aloginForm" method="post">
                <form id="aloginForm">
                    <div class="mb-3">
		                    <label for="email" class="form-label">Email address</label>
		                    <input type="email" id="email" name="email" class="form-control" placeholder="Enter email" required>
		                </div>
		
		                <div class="mb-3">
		                    <label for="password" class="form-label">Password</label>
		                    <input type="password" id="password" name="password" class="form-control" placeholder="Enter password" required>
		                </div>
                    <br>
                    <br>
                    
                    <button type="submit" class="btn btn-primary w-100">Login</button>
                    <p class="text-center mt-3 text-white">
                        Don't have an account? <a href="regPage" class="text-info">Register here</a>
                    </p>
                </form>
            </div>
        </div>

        <!-- Footer -->
        <footer class="text-center text-muted p-3">
            &copy; 2025 Attendance System. All rights reserved.
        </footer>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- JS for login form submission -->
    <script src="js/auth.js"></script>
</body>
</html>
