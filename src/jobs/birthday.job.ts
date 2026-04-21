import cron from "node-cron";
import { prisma } from "../db"; // adjust path
import { sendAdminNotification } from "../services/email";

export const startBirthdayCron = () => {

  cron.schedule("0 9 * * *", async () => {
    console.log("Running birthday check...");

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const users = await prisma.user.findMany({
      where: { consent: true }
    });

    const upcoming = users.filter((user) => {
      const dob = new Date(user.dateOfBirth);

      return (
        dob.getDate() === tomorrow.getDate() &&
        dob.getMonth() === tomorrow.getMonth()
      );
    });

    if (upcoming.length > 0) {
      await sendAdminNotification(upcoming);
    }

  });

};