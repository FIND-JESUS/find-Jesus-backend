import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

export const sendAdminNotification = async (users: any[]) => {
  const names = users.map(u => u.fullName).join(", ");

  await transporter.sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: "🎉 Birthdays Tomorrow",
    text: `These users have birthdays tomorrow:\n${names}`
  });
};

