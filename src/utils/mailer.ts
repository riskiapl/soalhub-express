import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: '"SoalHub Admin" <admin@soalhub.my.id>',
    to,
    subject: "Kode Verifikasi SoalHub",
    text: `Kode OTP Anda adalah: ${otp}. Kode ini berlaku selama 5 menit.`,
    html: `<b>Kode OTP Anda adalah: ${otp}</b><p>Kode ini berlaku selama 5 menit.</p>`,
  });
};
