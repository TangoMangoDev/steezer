<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sports Auth - Sign In</title>
    <meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups">
    <meta http-equiv="Content-Security-Policy" content="connect-src 'self';">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            position: relative;
            overflow-x: hidden;
        }

        /* Football field background */
        .field-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                linear-gradient(90deg, transparent 49.5%, rgba(255,255,255,0.1) 49.5%, rgba(255,255,255,0.1) 50.5%, transparent 50.5%),
                linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.05) 24%, rgba(255,255,255,0.05) 26%, transparent 26%),
                linear-gradient(0deg, transparent 49%, rgba(255,255,255,0.05) 49%, rgba(255,255,255,0.05) 51%, transparent 51%),
                linear-gradient(0deg, transparent 74%, rgba(255,255,255,0.05) 74%, rgba(255,255,255,0.05) 76%, transparent 76%),
                linear-gradient(135deg, #0d4f3c 0%, #1a5d47 50%, #0d4f3c 100%);
            z-index: 1;
        }

        /* Floating statistics icons */
        .stats-icon {
            position: absolute;
            color: rgba(255, 255, 255, 0.1);
            font-size: 2rem;
            animation: float 6s ease-in-out infinite;
            z-index: 2;
        }

        .stats-icon:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
        .stats-icon:nth-child(2) { top: 20%; right: 15%; animation-delay: 1s; }
        .stats-icon:nth-child(3) { top: 40%; left: 5%; animation-delay: 2s; }
        .stats-icon:nth-child(4) { top: 60%; right: 10%; animation-delay: 3s; }
        .stats-icon:nth-child(5) { top: 80%; left: 15%; animation-delay: 4s; }
        .stats-icon:nth-child(6) { top: 70%; right: 20%; animation-delay: 5s; }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }

        /* Main container */
        .auth-container {
            position: relative;
            z-index: 10;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        /* Auth card */
        .auth-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 40px 32px;
            width: 100%;
            max-width: 400px;
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Header */
        .auth-header {
            text-align: center;
            margin-bottom: 32px;
        }

        .logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            border-radius: 16px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
            font-weight: 700;
        }

        .auth-title {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 8px;
        }

        .auth-subtitle {
            font-size: 16px;
            color: #666;
            font-weight: 400;
        }

        /* Auth buttons */
        .auth-buttons {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .auth-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 16px 24px;
            border-radius: 8px;
            border: 1px solid #dadce0;
            background: white;
            color: #3c4043;
            text-decoration: none;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.2s ease;
            position: relative;
            min-height: 48px;
        }

        .auth-btn:hover {
            box-shadow: 0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15);
        }

        .auth-btn:active {
            background-color: #f8f9fa;
        }

        /* Google button */
        .google-btn {
            border-color: #dadce0;
            background: white;
            color: #3c4043;
        }

        .google-btn:hover {
            background: #f8f9fa;
        }

        /* Yahoo button */
        .yahoo-btn {
            background: #720e9e;
            border-color: #720e9e;
            color: white;
        }

        .yahoo-btn:hover {
            background: #5c0b7f;
            border-color: #5c0b7f;
        }

        .yahoo-btn:active {
            background: #4a0866;
        }

        /* Button icons */
        .btn-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        /* Divider */
        .divider {
            display: flex;
            align-items: center;
            margin: 32px 0;
            color: #999;
            font-size: 14px;
        }

        .divider::before,
        .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #e5e5e5;
        }

        .divider span {
            padding: 0 16px;
        }

        /* Footer */
        .auth-footer {
            text-align: center;
            margin-top: 32px;
            font-size: 14px;
            color: #666;
        }

        .auth-footer a {
            color: #2563eb;
            text-decoration: none;
        }

        .auth-footer a:hover {
            text-decoration: underline;
        }

        /* Responsive design */
        @media (max-width: 480px) {
            .auth-card {
                padding: 32px 24px;
                margin: 16px;
                border-radius: 20px;
            }

            .auth-title {
                font-size: 24px;
            }

            .stats-icon {
                font-size: 1.5rem;
            }
        }

        @media (max-width: 320px) {
            .auth-card {
                padding: 24px 20px;
            }

            .auth-btn {
                padding: 14px 20px;
                font-size: 14px;
            }
        }

        /* Loading animation */
        .loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: currentColor;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- Football field background -->
    <div class="field-background"></div>

    <!-- Floating statistics icons -->
    <div class="stats-icon">📊</div>
    <div class="stats-icon">📈</div>
    <div class="stats-icon">🏆</div>
    <div class="stats-icon">🏈</div>
    <div class="stats-icon">📋</div>
    <div class="stats-icon">🎯</div>

    <!-- Main authentication container -->
    <div class="auth-container">
        <div class="auth-card">
            <!-- Header -->
            <div class="auth-header">
                <div class="logo">🏈</div>
                <h1 class="auth-title">Welcome Back</h1>
                <p class="auth-subtitle">Sign in to access your sports dashboard</p>
            </div>

            <!-- Authentication buttons -->
            <div class="auth-buttons">
                <a href="/google/gauth.html" class="auth-btn google-btn" id="googleBtn">
                    <div class="btn-icon">
                        <!-- Google G Logo SVG -->
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                    </div>
                    Continue with Google
                </a>

                <a href="/yahoo/yauth.html" class="auth-btn yahoo-btn" id="yahooBtn">
                    <div class="btn-icon">
                        <!-- Yahoo Logo SVG -->
                        <svg viewBox="0 0 50 50" width="20" height="20">
                            <circle cx="25" cy="25" r="25" fill="white"/>
                            <path fill="#720e9e" d="M25 5c11.05 0 20 8.95 20 20s-8.95 20-20 20S5 36.05 5 25 13.95 5 25 5z"/>
                            <path fill="white" d="M15.5 15h3.2l4.3 8.5L27.3 15h3.2l-6.8 12.2V35h-2.4V27.2L15.5 15z"/>
                            <circle cx="32" cy="32" r="2.5" fill="#FF0000"/>
                        </svg>
                    </div>
                    Continue with Yahoo
                </a>
            </div>

            <!-- Divider -->
            <div class="divider">
                <span>Secure Authentication</span>
            </div>

            <!-- Footer -->
            <div class="auth-footer">
                <p>By continuing, you agree to our <a href="#" onclick="return false;">Terms of Service</a> and <a href="#" onclick="return false;">Privacy Policy</a></p>
            </div>
        </div>
    </div>

    <script>
        // Add loading state to buttons
        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('.auth-btn');

            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    // Add loading state
                    const originalText = this.innerHTML;
                    this.innerHTML = '<div class="loading"></div> Connecting...';
                    this.style.pointerEvents = 'none';

                    // Reset after 5 seconds if still on page (fallback)
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.pointerEvents = 'auto';
                    }, 5000);
                });
            });
        });

        // Add subtle parallax effect to floating icons
        document.addEventListener('mousemove', function(e) {
            const icons = document.querySelectorAll('.stats-icon');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            icons.forEach((icon, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;

                icon.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    </script>
</body>
</html>