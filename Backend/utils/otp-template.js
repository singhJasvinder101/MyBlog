const otpTemplate = (otp) => {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Forget Password Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

              <div style="text-align: center; padding: 20px 0;">
                  <h2>Greetings from Tech Bytes</h2>
                  <p>I hope this email finds you well. It seems that you've forgotten your password. To reset your password, use the following OTP:</p>
                  <p style="font-size: 24px; font-weight: bold; color: #e74c3c;">${otp}</p>
                  <p>Please enter this OTP to proceed with resetting your password.</p>
              </div>
              <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
                  <h4>Best Regards,</h4>
                  <p>Tech Bytes</p>
                  <h3>Thank you for visiting us!</h3>
              </div>
          </div>
      </body>
      </html>`;
  };
  
  module.exports = otpTemplate;