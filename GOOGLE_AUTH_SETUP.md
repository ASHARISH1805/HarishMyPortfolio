# How to Enable Google Authentication

For the Admin Login to work, you need to provide a valid **Google Client ID**.

## Steps:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "My Portfolio").
3. Go to **APIs & Services > OAuth consent screen**.
   - Create an External app.
   - Fill in the App Name and Email.
   - **Important:** Add the email addresses you want to allow (e.g., `ushawin2020@gmail.com`) as strict **Test Users** if the app is in "Testing" mode.
4. Go to **Credentials**.
   - Click "Create Credentials" -> "OAuth client ID".
   - Application type: **Web application**.
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for local testing)
     - `https://harishas-portfolio.onrender.com` (your live site URL)
   - **Authorized redirect URIs:** (Not strictly needed for the Pop-up flow, but you can add the same URLs).
5. Copy the generated **Client ID**.

## Setup in Project
1. Open your Render Dashboard (or `.env` file locally).
2. Add a new Environment Variable:
   - Key: `GOOGLE_CLIENT_ID`
   - Value: `[PASTE THE ID HERE]`
3. Redeploy the service.

Once done, the "Sign in with Google" button will appear on `/login.html`, and only the allowed emails will be able to access the admin panel.
