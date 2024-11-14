const express = require("express");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const { timetable } = require("./data/timetable");
const generateEvent = require("./utils/generateEvent");
const cron = require("node-cron");

const app = express();
dotenv.config();

const scopes = ["https://www.googleapis.com/auth/calendar"];

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});

app.get("/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.redirect(url);
});

app.get("/auth/redirect", async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  oauth2Client.setCredentials(tokens);
  res.send("Authentication successful! Please return to the console.");
});

app.get("/academia", async (req, res) => {
  try {
    const response = await fetch(process.env.ACADEMIA_PRO_URL);
    if (response.status === 200) {
      const data = await response.json();
      const dayOrder = data.today?.dayOrder;

      if (dayOrder === "-") {
        return res.status(200).json({
          success: true,
          message: "No lectures scheduled for today.",
        });
      }

      const lectures = timetable[dayOrder];

      await Promise.all(
        lectures.map(async (lecture) => {
          const event = generateEvent(
            lecture.subject,
            lecture.start,
            lecture.end
          );
          console.log(event);

          await calendar.events.insert({
            calendarId: "primary",
            auth: oauth2Client,
            resource: event,
          });
        })
      );

      res.status(200).json({
        success: true,
        data: data.today,
        lectures: lectures,
      });
    } else {
      throw new Error("Error with Academia");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(401).json({ success: false, error: error.message });
  }
});

cron.schedule("0 5 * * *", async () => {
  console.log("Triggering Academia route via cron job...");

  try {
    const response = await fetch(`${process.env.SERVER_URL}/academia`);
    if (response.status === 200) {
      console.log("Academia events successfully added to Google Calendar.");
    } else {
      console.log("Error calling Academia route.");
    }
  } catch (error) {
    console.log(`Error triggering Academia route: ${error.message}`);
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
