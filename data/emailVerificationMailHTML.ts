export const getVerificationEmailHTML = (verifyUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #1f2937;
      color: #ffffff;
      text-align: center;
      padding: 24px;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
    }
    .content {
      padding: 32px;
    }
    .content h2 {
      color: #111827;
      font-size: 20px;
      margin-top: 0;
    }
    .content p {
      line-height: 1.6;
      font-size: 16px;
      margin: 16px 0;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    @media (max-width: 600px) {
      .content {
        padding: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Kalika Kasta Furniture Udyog</h1>
    </div>
    <div class="content">
      <h2>Confirm Your Email Address</h2>
      <p>
        Thank you for registering with <strong>Kalika Kasta Furniture Udyog</strong>.
        Please confirm your email by clicking the button below:
      </p>
      <a href="${verifyUrl}" class="button">Verify Email</a>
      <p>
        If the button doesn’t work, copy and paste this link into your browser:
      </p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Kalika Kasta Furniture Udyog. All rights reserved.
    </div>
  </div>
</body>
</html>
`
