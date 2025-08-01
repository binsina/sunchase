# Google Sheets Integration Setup Guide

This guide will help you set up the registration form to send data to your Google Sheet.

## Step 1: Set up Google Apps Script

1. **Go to Google Apps Script**
   - Visit [script.google.com](https://script.google.com)
   - Sign in with your Google account

2. **Create a new project**
   - Click "New Project"
   - Name it "Registration Form Handler"

3. **Copy the Apps Script code**
   - Open the `google-apps-script.gs` file in this project
   - Copy all the code and paste it into the Apps Script editor
   - The spreadsheet ID is already set to your Google Sheet: `1I6Wxfy5MtBcuiqg4OIsFSo5xVykC4gsYbQDHGUQ1D1s`

4. **Save the project**
   - Click the save icon or press Ctrl+S
   - Name the project "Registration Form Handler"

## Step 2: Deploy as Web App

1. **Deploy the script**
   - Click the "Deploy" button (blue button with a rocket icon)
   - Select "New deployment"

2. **Configure the deployment**
   - **Type**: Web app
   - **Execute as**: Me (your Google account)
   - **Who has access**: Anyone
   - Click "Deploy"

3. **Authorize the app**
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to [Project Name] (unsafe)"
   - Click "Allow"

4. **Copy the Web App URL**
   - After deployment, you'll get a URL like: `https://script.google.com/macros/s/AKfycbz.../exec`
   - Copy this URL - you'll need it for the next step

## Step 3: Update the JavaScript File

1. **Open the JavaScript file**
   - Open `js/google-sheets-api.js` in your project

2. **Replace the script URL**
   - Find the line: `this.scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`
   - Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the URL you copied from Step 2

## Step 4: Set up Google Sheet Headers (Optional)

1. **Run the setup function**
   - In Google Apps Script, go to the "Functions" dropdown
   - Select `setupSheetHeaders`
   - Click the "Run" button
   - This will add formatted headers to your sheet

## Step 5: Test the Integration

1. **Test the connection**
   - In Google Apps Script, go to the "Functions" dropdown
   - Select `testConnection`
   - Click the "Run" button
   - Check the logs to see if it connects successfully

2. **Test the form**
   - Open your `register.html` page
   - Fill out the registration form
   - Click "Register"
   - Check your Google Sheet to see if the data appears

## Troubleshooting

### Common Issues:

1. **CORS Error**
   - Make sure your Google Apps Script is deployed as a web app
   - Ensure "Who has access" is set to "Anyone"

2. **Permission Denied**
   - Make sure you've authorized the Apps Script
   - Check that you have edit access to the Google Sheet

3. **Data not appearing in sheet**
   - Check the Apps Script logs for errors
   - Verify the spreadsheet ID is correct
   - Make sure the sheet is not protected

### Testing the API:

You can test the API directly by visiting the web app URL in your browser. You should see:
```json
{"success":true,"message":"Registration API is running"}
```

## Security Notes

- The web app URL will be publicly accessible
- Consider implementing additional security measures for production use
- You can restrict access by changing "Who has access" to "Anyone with Google Account"

## Data Structure

The registration data will be stored in your Google Sheet with the following columns:
- Timestamp
- First Name
- Last Name
- Email
- Phone
- Unit Owned

Each form submission will create a new row in the sheet.

## Support

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check the Google Apps Script logs for server-side errors
3. Verify all URLs and IDs are correct
4. Ensure your Google account has the necessary permissions 