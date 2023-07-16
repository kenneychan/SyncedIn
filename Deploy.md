# <img src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7832288/refresh-icon-md.png" alt="SyncedIn Logo" width="30"/> Nothing but Awesome Deploy Workflow

## Requirements

- [Heroku account created](https://signup.heroku.com/)
- [Aquired GA Heroku credits](https://trello.com/b/9JXfmceJ/syncedin)
- Using Atlas MongoDB database
- [Using Google OAuth](https://console.cloud.google.com)

## Command line instructions for new deployment

##### note: I use VS Code to create Procfile, the Heroku website to create a new App, get App url, set environment variables, open app, restart all dynos.

- Open new VS Code terminal
- Create Procfile in top level Git directory where package.json file is located
  ```
  cd <to same folder as package.json>
  echo "web: npm start" > Procfile
  ```
- check in all updates to branch
  ```
  git add .
  git commit -m "comment"
  ```
- Log into Heroku, you'll be prompted to "Press any key to open up to the browser to login"
  ```
  heroku login
  ```
- create heroku app
  ```
  heroku create <your-app-name>
  ```
- set heroku git remonte repository
  ```
  heroku git:remote -a <your-app-name>
  ```
- Copy the url to your app returned or if you performed this task awhile ago use the following command to get Heroku url, you will need this for Google OAuth
  ```
  heroku info -s | grep web_url | cut -d= -f2
  ```
- Switch to browser and set up OAuth
  - [Log into Google OAuth Credential](https://console.cloud.google.com/)
  - In upper left next to "Google Cloud", in drop down select your project
  - Scroll down and click "APIs & Services" card
  - On left menu click "Credentials"
  - On Credentials panel under OAuth 2.0 Client IDs click "Web client 1"
  - On Client ID for Web application under Autorized redirect URI click "ADD URI"
  - Copy Heroku url from previous step
  - Paste url and append "/oauth2callback"
  - Need to hit return/enter key
  - Click "SAVE"
  - Wait for an 5 minutes to a few hours
- Back to VS Code terminal. Add all environment variables from .env to Heroku app, do NOT add Port
  ```
  heroku config:set DATABASE_URL="<whatever is in your .env file>"
  heroku config:set GOOGLE_CLIENT_ID="<whatever is in your .env file>"
  heroku config:set GOOGLE_SECRET="<whatever is in your .env file>"
  heroku config:set GOOGLE_CALLBACK="<whatever is in your .env file>"
  heroku config:set SECRET="<whatever is in your .env file>"
  ```
  - Add any other environment variables needed for your app to run other than Port
  - Verify environment variables
  ```
  heroku config
  ```
- push your branch to heroku, look for errors
  ```
  git status
  git push heroku <branch name>:main
  ```
- View deployed Heroku app
  ```
  heroku open
  ```
- Check logs, in a new VS Code terminal
  ```
  heroku logs --tail
  ```
- Fix any deployment errors

## Update latest changes after success deployment

- check in all updates to branch
  ```
  git add .
  git push commit -m "comment"
  ```
- push your branch to heroku, look for errors
  ```
  git push heroku <branch>:main
  ```
- Check Heroku log for errors
  - click zsh terminal running heroku logs --tail
- View app
  - refresh app in browser
