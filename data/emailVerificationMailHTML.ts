export const getVerificationEmailHTML = (verifyUrl: string) => `
<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Email Verification</title>
  <style>
    /* Reset & base */
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      display: block;
      max-width: 100%;
    }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      height: 100% !important;
      background-color: #f9fafb;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #374151;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    a {
      color: #2563eb;
      text-decoration: none;
    }
    /* Container */
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }
    /* Header */
    .email-header {
      background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
      padding: 32px 24px;
      text-align: center;
      color: #ffffff;
      font-weight: 700;
      font-size: 24px;
      letter-spacing: 1px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    /* Content */
    .email-body {
      padding: 32px 32px 48px 32px;
      font-size: 16px;
      line-height: 1.6;
      color: #374151;
    }
    .email-body h2 {
      font-size: 22px;
      margin-top: 0;
      margin-bottom: 16px;
      color: #111827;
      font-weight: 700;
    }
    .email-body p {
      margin: 16px 0;
    }
    /* Button */
    .btn-verify {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin-top: 24px;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
      transition: background-color 0.3s ease;
      text-decoration: none;
    }
    .btn-verify:hover {
      background-color: #1e40af;
      box-shadow: 0 6px 20px rgba(30, 64, 175, 0.6);
    }
    /* Footer */
    .email-footer {
      background-color: #f3f4f6;
      padding: 24px 24px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    /* Responsive */
    @media (max-width: 620px) {
      .email-container {
        margin: 20px 16px;
      }
      .email-body {
        padding: 24px 16px 32px 16px;
      }
      .email-header {
        font-size: 20px;
        padding: 24px 16px;
      }
      .btn-verify {
        width: 100%;
        text-align: center;
        padding: 16px 0;
        font-size: 18px;
      }
    }
  </style>
</head>
<body>
  <center>
    <table role="presentation" class="email-container" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
      <tr>
        <td class="email-header">
          Kalika Kasta Furniture Udyog
        </td>
      </tr>
      <tr>
        <td class="email-body">
          <h2>Confirm Your Email Address</h2>
          <p>Thank you for registering with <strong>Kalika Kasta Furniture Udyog</strong>. Please confirm your email by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="${verifyUrl}" class="btn-verify" target="_blank" rel="noopener noreferrer">Verify Email</a>
          </p>
          <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
          <p><a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" style="word-break: break-all;">${verifyUrl}</a></p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </td>
      </tr>
      <tr>
        <td class="email-footer">
          &copy; ${new Date().getFullYear()} Kalika Kasta Furniture Udyog. All rights reserved.
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`
