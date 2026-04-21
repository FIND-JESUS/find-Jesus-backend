import { Body, Controller, Get, Header, Post, Route, Tags } from "tsoa";
import { birthdayDTO } from "../DTO/birthdayDTO";
import { prisma } from "../db";
import { sendAdminNotification } from "../services/email"; // make sure this exists

@Tags("Birthday APIs")
@Route("birthday")
export class BirthdayController extends Controller {
  // 🎯 Submit Birthday
  @Post("/submit-birthday")
  public async submitBirthday(@Body() birthdayData: birthdayDTO): Promise<any> {
    const submitBirthday = await prisma.user.create({
      data: {
        firstName: birthdayData.firstName,
        lastName: birthdayData.lastName,
        email: birthdayData.email,
        dateOfBirth: new Date(birthdayData.dateOfBirth),
        consent: birthdayData.consent ?? false,
      },
    });

    return {
      message: "Birthday data submitted successfully",
      data: submitBirthday,
    };
  }

  // 📅 Get Upcoming Birthdays (Next 7 Days)
  @Get("/get-birthday")
  public async getBirthday(): Promise<any> {
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    const users = await prisma.user.findMany({
      where: { consent: true },
    });

    const upcoming = users.filter((user) => {
      const dob = new Date(user.dateOfBirth);

      const thisYearBirthday = new Date(
        today.getFullYear(),
        dob.getMonth(),
        dob.getDate(),
      );

      return thisYearBirthday >= today && thisYearBirthday <= next7Days;
    });

    return {
      count: upcoming.length,
      data: upcoming,
    };
  }

  // 🎉 Manual Admin Notification Trigger (for testing or cron)
  @Post("/post-message-to-birthday")
  public async postMessage(
    @Header("authorization") auth?: string,
  ): Promise<any> {
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      this.setStatus(401);
      return { error: "Unauthorized" };
    }
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const users = await prisma.user.findMany({
      where: { consent: true },
    });

    const upcoming = users.filter((user) => {
      const dob = new Date(user.dateOfBirth);

      return (
        dob.getDate() === tomorrow.getDate() &&
        dob.getMonth() === tomorrow.getMonth()
      );
    });

    if (upcoming.length === 0) {
      return { message: "No birthdays tomorrow" };
    }

    await sendAdminNotification(upcoming);

    return {
      message: "Admin notified successfully",
      count: upcoming.length,
      users: upcoming,
    };
  }
}
