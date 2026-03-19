import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  },
});

export async function sendMail(email) {
  console.log("Send Email ==> ", email.addresses);
  console.log(
    "Send Email ==> ",
    process.env.AWS_REGION,
    process.env.AWS_SES_ACCESS_KEY_ID,
    process.env.AWS_SES_SECRET_ACCESS_KEY
  );
  const params = {
    Destination: {
      ToAddresses: email.addresses,
      CcAddresses: email.ccAddresses,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: email.html,
        },
        Text: {
          Charset: "UTF-8",
          Data: email.html,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: email.subject,
      },
    },
    Source: process.env.AWS_SENDERS_EMAIL,
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
