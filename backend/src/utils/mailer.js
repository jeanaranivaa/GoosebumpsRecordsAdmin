import nodemailer from "nodemailer";

const buildTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

export const sendMail = async ({ to, subject, html }) => {
  const transporter = buildTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

export const buildCodeEmail = (title, code) => `
  <h2>Goosebumps Records</h2>
  <p>${title}</p>
  <h1>${code}</h1>
  <p>Este código expira en 10 minutos.</p>
`;
