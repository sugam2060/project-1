export const getPrivateKeyEmailHTML = ({
  fullName,
  privateKey,
  loginUrl,
  appName = 'Kalika Kasta Furniture Udyog',
}: {
  fullName: string;
  privateKey: string;
  loginUrl: string;
  appName?: string;
}) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${appName} – Private Key</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td        { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img              { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; max-width:100%; }
    body             { margin:0; padding:0; width:100% !important; height:100% !important; background:#f9fafb; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; color:#374151; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
    a                { color:#2563eb; text-decoration:none; }

    .email-container { max-width:600px; margin:40px auto; background:#ffffff; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.1); overflow:hidden; border:1px solid #e5e7eb; }
    .email-header    { background:linear-gradient(90deg,#2563eb 0%,#3b82f6 100%); padding:32px 24px; text-align:center; color:#fff; font-weight:700; font-size:24px; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; }
    .email-body      { padding:32px; font-size:16px; line-height:1.6; }
    .email-body h2   { font-size:22px; margin-top:0; color:#111827; font-weight:700; }
    .email-body p    { margin:16px 0; }
    .code-block      { background:#f3f4f6; padding:12px 16px; border-radius:8px; font-family:SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace; font-size:15px; word-break:break-all; }

    .btn-login       { display:inline-block; background:#2563eb; color:#fff !important; padding:14px 28px; border-radius:8px; font-weight:600; font-size:16px; margin-top:24px; box-shadow:0 4px 14px rgba(37,99,235,0.4); transition:background-color .3s ease; text-decoration:none; }
    .btn-login:hover { background:#1e40af; box-shadow:0 6px 20px rgba(30,64,175,.6); }

    .email-footer    { background:#f3f4f6; padding:24px; text-align:center; font-size:13px; color:#6b7280; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; }

    @media(max-width:620px){
      .email-container { margin:20px 16px; }
      .email-body      { padding:24px 16px 32px; }
      .email-header    { font-size:20px; padding:24px 16px; }
      .btn-login       { width:100%; text-align:center; padding:16px 0; font-size:18px; }
    }
  </style>
</head>
<body>
  <center>
    <table role="presentation" class="email-container" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td class="email-header">
          ${appName}
        </td>
      </tr>
      <tr>
        <td class="email-body">
          <h2>Hello ${fullName},</h2>
          <p>Welcome to <strong>${appName}</strong>. Below is your private key to access your account. Please store it securely — it is shown only once and cannot be recovered.</p>

          <p><strong>Your Private Key:</strong></p>
          <div class="code-block">${privateKey}</div>

          <p style="text-align:center;">
            <a href="${loginUrl}" class="btn-login" target="_blank" rel="noopener noreferrer">Access Your Account</a>
          </p>

          <p>If the button doesn’t work, copy and paste this link into your browser:</p>
          <p><a href="${loginUrl}" target="_blank" rel="noopener noreferrer" style="word-break: break-word;">${loginUrl}</a></p>

          <p>If you did not request this account, you can ignore this email.</p>
        </td>
      </tr>
      <tr>
        <td class="email-footer">
          &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
