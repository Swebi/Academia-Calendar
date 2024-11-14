
---

# Academia - Google Calendar Integration

An API built on top of [ClassPro](https://github.com/rahuletto/classpro) that fetches the current day order and adds your class hours into your Google Calendar as events using the Google Calendar API.


- **Using Slack with Google Calendar**: Update your slack status based on your class hours using the google 

- **Easily Share Class Schedule**: Quickly share your class hours with others in a clean, accessible format.
  
- **Calendar Event Automation**: Trigger Alarms and other routines/automations based on class hours using [Home Assistant](https://www.home-assistant.io/integrations/google/)


## Screenshots



## Configuration

### Google Cloud Console

- Follow the steps given here 
https://developers.google.com/calendar/api/quickstart/nodejs

- Setup a new project
- Enable Google Calendar API
- Configure OAuth consent screen
- Create and Authorise credentials
- Get Client ID, Client Secret
- Configure Redirect URL to localhost and deployed URL
- Set publishing status to in production under OAuth consent screen



### Timetable Configuration


From src/data/timetable.js
- Fill your subjects and start, end timings for each day order. Keep the start timings with a 1 minute offset for clashing event timings 


### Google Auth

- After deploying visit the /auth route once to set the access token 




## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Swebi/Academia-Calendar.git
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up the environment variables in your `.env` file (refer env example):
   ```
    CLIENT_ID=
    CLIENT_SECRET=
    REDIRECT_URL=
    ACADEMIA_PRO_URL=
    SERVER_URL=
   ```
4. Run the development server:
   ```bash
   pnpm dev
   ```



---