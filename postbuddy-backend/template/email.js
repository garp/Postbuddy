// emailTemplates.js

const wrapperStart = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
    <div style="max-width: 550px; margin: auto; background-color: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      <img src="https://postbuddy.ai/favicon.ico" alt="PostBuddy Logo" style="display: block; margin: 0 auto 20px auto; width: 50px; height: auto;" />
`;

const wrapperEnd = `
      <hr style="border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        For any questions, please contact our support team at <a href="https://postbuddy.ai" style="color: #8d5ec7; text-decoration: none;">PostBuddy.ai</a>.
      </p>
    </div>
  </div>
`;

export const subscriptionActivationTemplate = (userName, subscriptionPlan, activationDate) => `
  ${wrapperStart}
      <h2 style="color: #8d5ec7; text-align: center;">Subscription Activated</h2>
      <p>Hi <strong>${userName}</strong>,</p
      <p>Your subscription to <strong>${subscriptionPlan}</strong> was successfully activated on <strong>${activationDate}</strong>.</p>
      <p>You now have full access to premium features on <strong>PostBuddy.ai</strong>. <a href="${process.env.FRONTEND_URL}/dashboard">View Benefits</a></p>
  ${wrapperEnd}
`;

export const subscriptionCancellationTemplate = (userName, subscriptionPlan, cancellationDate, refundAmount) => {
  const amount = refundAmount ? Number(refundAmount) : 0;
  const refundCurrency = amount === 499 || amount === 3999 ? "INR" : "USD";

  return `
    ${wrapperStart}
      <h2 style="color: #E53935; text-align: center;">Subscription Cancelled</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Your subscription to <strong>${subscriptionPlan}</strong> was cancelled on <strong>${cancellationDate}</strong>.</p>
      ${
        refundAmount
          ? `<p>Your refund amount of <strong>${refundCurrency} ${refundAmount}</strong> will be initiated.</p>`
          : ``
      }
      <p>If you have any questions, we're here to help. <a href="https://postbuddy.ai" style="color: #E53935;">Visit PostBuddy</a></p>
    ${wrapperEnd}
  `;
};

export const loginOtpTemplate = (userName, otp) => `
  ${wrapperStart}
    <h2 style="color: #9333ea; text-align: center;">Login OTP</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>Use the following OTP to log in to your <strong>PostBuddy.ai</strong> account:</p>
    <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 10px; background-color: #f1f1f1; border-radius: 5px;">
      ${otp}
    </div>
    <p style="color: #888; font-size: 12px;">This OTP is valid for 5 minutes. Do not share it with anyone.</p>
  ${wrapperEnd}
`;

export const contactUsSubmissionTemplate = (userName, userEmail, subject, message) => `
  ${wrapperStart}
    <h2 style="color: #3F51B5; text-align: center;">New Contact Submission</h2>
    <p><strong>User Name:</strong> ${userName}</p>
    <p><strong>Email:</strong> ${userEmail}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <div style="background-color: #f1f1f1; padding: 10px; border-radius: 5px;">${message}</div>
  ${wrapperEnd}
`;

export const registrationSuccessTemplate = (userName) => `
  ${wrapperStart}
    <h2 style="color: #8d5ec7; text-align: center;">Registration Successful</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>Thank you for registering with <strong>PostBuddy.ai</strong>! Your account has been created successfully.</p>
    <p>You can now log in and start using our powerful features.</p>
  ${wrapperEnd}
`;

export const organizationRegistrationSuccessTemplate = (userName, orgName, organizationId) => `
  ${wrapperStart}
    <h2 style="color: #8d5ec7; text-align: center;">Organization Registered</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>Your organization <strong>${orgName}</strong> has been successfully created on <strong>PostBuddy.ai</strong>.</p>
    <p><strong>Organization ID:</strong> ${organizationId}</p>
    <p>You can now onboard your team, manage engagement, and track performance.</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="https://postbuddy.ai/plans" style="background-color: #8d5ec7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Pricing Plans</a>
    </p>
  ${wrapperEnd}
`;

export const dailyLimitReachedTemplate = (userName) => `
  ${wrapperStart}
    <h2 style="color: #FF5722; text-align: center;">Daily Limit Reached</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>You’ve reached your daily limit of <strong>10 credits</strong> on PostBuddy.</p>
    <p>Try again tomorrow or <a href="https://postbuddy.ai/plans">upgrade your plan</a> to increase your daily limit.</p>
  ${wrapperEnd}
`;

export const organizationInviteTemplate = (userName, orgName, adminName, inviteLink) => `
  ${wrapperStart}
    <h2 style="color: #F6A9C1; text-align: center;">You're Invited!</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>You’ve been invited to join the organization <strong>${orgName}</strong> by <strong>${adminName}</strong>.</p>
    <p>Click the button below to accept the invitation and start using PostBuddy.ai:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${inviteLink}" style="display: inline-block; background-color: #7B56F4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">Accept Invitation</a>
    </div>
  ${wrapperEnd}
`;

export const subscriptionChargedTemplate = (userName, subscriptionPlan, amount, chargeDate, nextBillingDate) => {
  const currency = amount >= 99 ? "INR" : "USD";
  
  return `
    ${wrapperStart}
      <h2 style="color: #8d5ec7; text-align: center;">Payment Successful</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Your payment of <strong>${currency} ${amount}</strong> for the <strong>${subscriptionPlan}</strong> plan was successfully processed on <strong>${chargeDate}</strong>.</p>
      <p>Your subscription is active and you have full access to all premium features.</p>
      <p>Your next billing date is <strong>${nextBillingDate}</strong>.</p>
      <p style="text-align: center; margin: 25px 0;">
        <a href="${process.env.FRONTEND_URL}/billing" style="background-color: #8d5ec7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Billing Details</a>
      </p>
    ${wrapperEnd}
  `;
};

export const subscriptionPausedTemplate = (userName, subscriptionPlan, pauseDate, resumeDate) => `
  ${wrapperStart}
    <h2 style="color: #FF9800; text-align: center;">Subscription Paused</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>Your subscription to <strong>${subscriptionPlan}</strong> has been paused on <strong>${pauseDate}</strong>.</p>
    ${
      resumeDate
        ? `<p>Your subscription will automatically resume on <strong>${resumeDate}</strong>.</p>`
        : `<p>You can resume your subscription anytime from your account settings.</p>`
    }
    <p>During this pause period, you'll have limited access to features. You can still access your existing content but won't be able to use premium features.</p>
    <p style="text-align: center; margin: 25px 0;">
      <a href="${process.env.FRONTEND_URL}/account/subscription" style="background-color: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Manage Subscription</a>
    </p>
  ${wrapperEnd}
`;