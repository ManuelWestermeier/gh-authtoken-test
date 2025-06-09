GitHub OAuth Token API
======================

This is a minimal Express.js server that handles GitHub OAuth authentication and returns an access token to your frontend application. It is deployed at:

**[https://gh-authtoken-test.onrender.com](https://gh-authtoken-test.onrender.com)**

this is the url to the app. it may take up to 50s to spawn because it is a free instance. you can host it by yourselv

* * *

🔧 Setup
--------

### Environment Variables

Create a `.env` file with the following content:

CLIENT\_ID=your\_github\_client\_id
CLIENT\_SECRET=your\_github\_client\_secret
PORT=3000

You can create a GitHub OAuth App at: [https://github.com/settings/developers](https://github.com/settings/developers)

* * *

🚀 Usage
--------

### Step 1: Redirect to GitHub

Your frontend should redirect the user to:

`GET /github/login?appUrl=https://your-frontend-app.com`

*   `appUrl` (optional): URL where the user will be redirected after GitHub login with the token appended as a query parameter.

**Example:**

`GET https://gh-authtoken-test.onrender.com/github/login?appUrl=https://your-frontend-app.com`

This will redirect the user to GitHub’s OAuth page.

* * *

### Step 2: GitHub redirects back to your backend

GitHub redirects to:

`GET /github/callback`

Your server will exchange the temporary authorization code for an access token, then redirect the user to the original `appUrl` with the token appended as a query parameter:

`https://your-frontend-app.com?token=gho_...`

* * *

📦 Example OAuth Flow
---------------------

1.  User clicks "Sign in with GitHub" on your app.
2.  Your frontend redirects the user to:  
    `https://gh-authtoken-test.onrender.com/github/login?appUrl=https://myapp.com/dashboard`
3.  User logs into GitHub and approves the OAuth request.
4.  GitHub redirects to the backend’s callback with a code.
5.  The server exchanges the code for a token and redirects user to:  
    `https://myapp.com/dashboard?token=gho_...`

* * *

🛠️ Local Development
---------------------

Install dependencies:

npm install

Start the server:

node index.js

* * *

🧪 Notes
--------

*   The server uses the `state` query to pass the original `appUrl` through the GitHub OAuth process.
*   Tokens are **not stored** on the server — they are immediately redirected to the client.

* * *

🔒 Security Recommendations
---------------------------

*   Always serve your frontend and backend over **HTTPS** in production.
*   Treat GitHub access tokens like passwords — never expose or log them.
*   In production, validate the `state` parameter to protect against CSRF.