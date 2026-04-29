export function otpHTML(OTP) {
    const productName = "Scorely"
    return (

        `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>OTP Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f9f8f4;font-family:Inter,system-ui,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f8f4;padding:32px 0;">
  <tr>
    <td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background-color:#fdfdfd;border:1px solid #e5e7eb;box-shadow:0 4px 6px rgba(0,0,0,0.07);overflow:hidden;">
        <tr>
          <td style="background-color:#1b4b3d;height:8px;font-size:0;">&nbsp;</td>
        </tr>
        <tr>
          <td align="center" style="padding:40px 24px 24px;">
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#1b4b3d;text-transform:uppercase;letter-spacing:0.05em;">
              Your Verification Code
            </h1>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:0 32px 40px;">
            <p style="margin:0 0 8px;color:#4b5563;font-size:15px;">
              This OTP is for secure verification on 
              <span style="font-weight:600;color:#1b4b3d;">${productName}</span>
            </p>
            <p style="margin:0 0 32px;color:#6b7280;font-size:13px;font-style:italic;">
              This code will expire in 3 minutes
            </p>
            <div style="display:inline-block;background-color:#f9f8f4;border:2px dashed #1b4b3d;border-radius:8px;padding:32px 40px;">
              <span style="font-size:36px;font-weight:800;color:#1b4b3d;letter-spacing:0.5em;">
                ${OTP}
              </span>
            </div>
            <div style="margin-top:40px;padding-top:24px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6;">
                If you didn't request this, please ignore this email.
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td align="center" style="background-color:#1b4b3d;padding:24px;color:#fdfdfd;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">
            © 2026 ${productName} Cricket Services
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

</body>
</html>`

    )
}