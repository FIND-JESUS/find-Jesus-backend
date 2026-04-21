import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

interface BirthdayUser {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
}

const GRADIENT_PAIRS = [
  ["#FF6B6B", "#FF8E53"],
  ["#4ECDC4", "#44A08D"],
  ["#A18CD1", "#FBC2EB"],
  ["#FFECD2", "#FCB69F"],
  ["#A1C4FD", "#C2E9FB"],
  ["#FD746C", "#FF9068"],
];

const getGradient = (index: number) => {
  const [a, b] = GRADIENT_PAIRS[index % GRADIENT_PAIRS.length];
  return { from: a, css: `linear-gradient(135deg, ${a}, ${b})` };
};

const getInitials = (user: BirthdayUser) =>
  `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

const getAge = (dob: Date) => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age + 1;
};

const buildUserCards = (users: BirthdayUser[]) =>
  users
    .map((user, i) => {
      const { from, css } = getGradient(i);
      const initials = getInitials(user);
      const age = getAge(user.dateOfBirth);
      const fullName = `${user.firstName} ${user.lastName}`;

      return `
      <tr>
        <td style="padding: 7px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0"
            style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.055);">
            <tr>
              <td width="5" style="background:${from};border-radius:5px 0 0 5px;"></td>
              <td style="padding:15px 18px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="46" valign="middle">
                      <table cellpadding="0" cellspacing="0" border="0"><tr>
                        <td width="44" height="44"
                          style="width:44px;height:44px;border-radius:50%;background:${css};text-align:center;vertical-align:middle;font-family:'Playfair Display',Georgia,serif;font-size:15px;font-weight:700;color:#fff;letter-spacing:0.5px;">
                          ${initials}
                        </td>
                      </tr></table>
                    </td>
                    <td style="padding-left:13px;" valign="middle">
                      <p style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:16px;font-weight:700;color:#1a1a2e;letter-spacing:-0.2px;">${fullName}</p>
                    </td>
                    <td align="right" valign="middle">
                      <span style="display:inline-block;padding:5px 13px;background:linear-gradient(135deg,#fff0f6,#ffe3f0);border-radius:20px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;color:#e05c97;letter-spacing:0.2px;">
                        Turning ${age}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    })
    .join("");

const buildEmailHtml = (users: BirthdayUser[]): string => {
  const count = users.length;
  const plural = count === 1 ? "person has" : "people have";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Birthday Notification</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background-color:#eeeef5;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eeeef5;padding:36px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

        <tr>
          <td style="background:linear-gradient(160deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%);border-radius:22px 22px 0 0;padding:44px 36px 36px;text-align:center;">
            <p style="margin:0 0 14px;font-size:46px;line-height:1;">🎂</p>
            <h1 style="margin:0 0 8px;font-family:'Playfair Display',Georgia,serif;font-size:30px;font-weight:700;color:#fff;letter-spacing:-0.4px;line-height:1.2;">Birthday Alert</h1>
            <p style="margin:0;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:14px;color:#a0a8c0;letter-spacing:0.3px;">${dateStr}</p>
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top:24px;"><tr>
              <td style="background:rgba(255,255,255,0.09);border:1px solid rgba(255,255,255,0.14);border-radius:30px;padding:9px 22px;">
                <span style="font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:13px;color:#e0e4f0;font-weight:500;letter-spacing:0.3px;">
                  <strong style="color:#fff;font-size:17px;">${count}</strong>&nbsp; ${plural} a birthday tomorrow
                </span>
              </td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#f8f8fc;padding:28px 28px 20px;border-left:1px solid #e6e6f0;border-right:1px solid #e6e6f0;">
            <p style="margin:0 0 16px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#9a9ab0;text-transform:uppercase;letter-spacing:1.6px;">Upcoming Celebrations</p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              ${buildUserCards(users)}
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#f8f8fc;padding:0 28px 28px;border-left:1px solid #e6e6f0;border-right:1px solid #e6e6f0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="background:linear-gradient(135deg,#eaf4ff,#f0eaff);border-radius:12px;padding:16px 20px;">
                <p style="margin:0;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:13px;color:#5a5a7a;line-height:1.65;">
                  💡 <strong style="color:#3a3a5c;">Pro tip:</strong> A quick message or small gesture goes a long way in making someone feel appreciated!
                </p>
              </td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#1a1a2e;border-radius:0 0 22px 22px;padding:22px 28px;text-align:center;">
            <p style="margin:0 0 5px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:12px;color:#5a6080;">Automated message from your HR system.</p>
            <p style="margin:0;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:11px;color:#3a4060;">© ${new Date().getFullYear()} · Admin Notifications · Do not reply</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

export const sendAdminNotification = async (users: BirthdayUser[]) => {
  const names = users.map((u) => `${u.firstName} ${u.lastName}`).join(", ");

  await transporter.sendMail({
    from: `"HR System 🎂" <${process.env.EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🎉 ${users.length} Birthday${users.length > 1 ? "s" : ""} Tomorrow — ${names}`,
    text: `These users have birthdays tomorrow:\n${names}`,
    html: buildEmailHtml(users),
  });
};
