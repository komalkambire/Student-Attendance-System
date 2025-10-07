<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Regisration - Attendance System</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<script src="css/bootstrap.min.js"></script>
	<link rel="stylesheet" href="css/style.css">
    <style>
        body {
            background-image: url('images/AttendImg.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 180vh;
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
		
		.bg-register {
		            background-image: url('assets/images/AttendImg.jpg');
		            background-size: cover;
		            background-position: center;
		            /* Change height: 100% to min-height: 100vh */
		            min-height: 100vh; 
		            display: flex;
		            justify-content: center;
		            /* Use align-items: flex-start on the main container to prevent it from stretching the card */
		            /* We'll center the card itself using a wrapper if needed, but for overflow we need flex-start */
		            align-items: center; /* KEEP this for initial centering */
		            position: relative;
		            /* Add padding to the top/bottom of the main background container */
		            /* This ensures content doesn't touch the top/bottom edges when it overflows */
		            padding: 20px 0; 
		        }
		.register-card {
		            position: relative;
		            padding: 40px;
		            border-radius: 15px;
		            background-color: rgba(255,255,255,0.15);
		            backdrop-filter: blur(10px);
		            max-width: 450px;
		            width: 100%;
		            z-index: 10;
		            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
		            color: #fff;
		            text-align: center;
		            /* Add margin to allow the card to center and prevent it from sticking to the edges */
		            /* This works in conjunction with the padding on .bg-register */
		            margin: auto 20px;
		        }
				
				.overlay-register {
				            position: absolute;
				            top: 0; left: 0;
				            width: 100%; 
				            /* Change height: 100% to 100% (of its parent) to cover the full expanded background */
				            height: 100%; 
				            background-color: rgba(0,0,0,0.4);
				        }
				
				.form-label {
				            display: block; 
				            text-align: left; 
				            margin-bottom: 5px; 
				            font-weight: normal; /* Adjusted to standard weight */
				            color: #fff; 
				            width: 100%; 
				        }
						
						.form-control {
						            background-color: rgba(255,255,255,0.25);
						            border: none;
						            color: #fff;
						        }
						
						        .form-control::placeholder {
						            color: #f0f0f0;
						        }
						
						        .form-control:focus {
						            background-color: rgba(255,255,255,0.35);
						            color: #fff;
						            box-shadow: none;
						        }
						
						        .btn-custom {
						            background-color: rgba(40,167,69,0.7);
						            border: none;
						            color: #fff;
						        }
						
						        .btn-custom:hover {
						            background-color: rgba(40,167,69,0.9);
						        }
						
						        a {
						            color: #fff;
						        }
						
						        a:hover {
						            color: #ddd;
						        }
								
				.profile-preview {
				            display: block;
				            margin: 0 auto 15px;
				            width: 100px;
				            height: 100px;
				            border-radius: 50%;
				            object-fit: cover;
				            border: 2px solid #fff;
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
        
		<c:if test="${not empty successMsg}">
		<h4 style="color: green">${successMsg}</h4>
		</c:if>
		<c:if test="${not empty errorMsg}">
		<h4 style="color: red">${errorMsg}</h4>
		</c:if>
		
        <!-- Regi Form -->
		<div class="bg-register">
		        <div class="overlay-register"></div>
		        <div class="register-card">
		            <h2>Role-Wise Registration</h2>
		            <form action="regForm" method="post">
		                
		                <div class="mb-3">
		                    <label for="profilePic" class="form-label">Profile Picture</label>
		                    <input type="file" id="profilePic" name="profilePic" class="form-control" accept="image/*" onchange="previewImage(this, 'profilePreview')">
		                </div>
		
		                <div class="mb-3">
		                    <label for="role" class="form-label">Select Role</label>
		                    <select id="role" name="role" class="form-control" required>
		                        <option value="">-- Select Role --</option>
		                        <option value="student">Student</option>
		                        <option value="student">Teacher</option>
		                        <option value="student">Admin</option>
		                    </select>
		                </div>
		
		                <div class="mb-3">
		                    <label for="fullName" class="form-label">Full Name</label>
		                    <input type="text" id="fullname" name="fullname" class="form-control" placeholder="Enter full name" required>
		                </div>
		
		                <div class="mb-3">
		                    <label for="email" class="form-label">Email address</label>
		                    <input type="email" id="email" name="email" class="form-control" placeholder="Enter email" required>
		                </div>
		
		                <div class="mb-3">
		                    <label for="password" class="form-label">Password</label>
		                    <input type="password" id="password" name="password" class="form-control" placeholder="Enter password" required>
		                </div>
		
		                <div class="mb-3">
		                    <label for="contact" class="form-label">Contact Number</label>
		                    <input type="text" id="contact" name="contact" class="form-control" placeholder="Enter contact number" required>
		                </div>
		
		                <div class="d-grid gap-2">
		                    <button type="submit" class="btn btn-custom btn-lg">Register</button>
		                </div>
		
		                <p class="mt-3 text-center">
		                    Already have an account? <a href="loginPage">Login</a>
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
