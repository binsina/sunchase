# Google Drive Integration Setup Guide

This guide will help you set up the Google Drive API integration for the documents page on your Sunchase IV website.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. A Google Drive folder containing the documents you want to display

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "Sunchase IV Documents")
5. Click "Create"

## Step 2: Enable the Google Drive API

1. In your Google Cloud project, go to the [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for "Google Drive API"
3. Click on "Google Drive API"
4. Click "Enable"

## Step 3: Create API Credentials

1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key (you'll need this later)
4. Click "Restrict Key" to secure it:
   - Under "Application restrictions", select "HTTP referrers (websites)"
   - Add your website domain (e.g., `*.yourdomain.com/*`)
   - Under "API restrictions", select "Restrict key"
   - Select "Google Drive API" from the dropdown
   - Click "Save"

## Step 4: Set Up Your Google Drive Folder

1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder or use an existing one for your documents
3. Upload the documents you want to display on your website
4. Right-click on the folder and select "Share"
5. Click "Copy link" to get the folder ID
6. The folder ID is the long string in the URL between `/folders/` and the next `/`

Example URL: `https://drive.google.com/drive/folders/1ABC123DEF456GHI789JKL`
Folder ID: `1ABC123DEF456GHI789JKL`

## Step 5: Configure Your Website

### Option A: Using the Google Drive API (Recommended)

1. Open `documents.html` in your code editor
2. Find the JavaScript section at the bottom of the file
3. Replace the placeholder values:

```javascript
// Replace these values with your actual credentials
const GOOGLE_DRIVE_FOLDER_ID = 'YOUR_ACTUAL_FOLDER_ID';
const API_KEY = 'YOUR_ACTUAL_API_KEY';
```

4. Uncomment and modify the Google Drive API integration:

```javascript
// Replace the sample documents with actual Google Drive integration
$(document).ready(function() {
    const driveAPI = new GoogleDriveDocuments(GOOGLE_DRIVE_FOLDER_ID, API_KEY);
    
    // Load documents from Google Drive
    DocumentUtils.showLoading('documentsGrid');
    
    driveAPI.getFilesFromFolder()
        .then(documents => {
            window.allDocuments = documents; // Store for search functionality
            DocumentUtils.renderDocuments(documents, 'documentsGrid');
        })
        .catch(error => {
            console.error('Error loading documents:', error);
            DocumentUtils.showError('documentsGrid', 'Error loading documents. Please try again later.');
        });

    // Search functionality
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val();
        const filtered = driveAPI.searchFiles(window.allDocuments, searchTerm);
        DocumentUtils.renderDocuments(filtered, 'documentsGrid');
    });
});
```

### Option B: Using Sample Data (For Testing)

If you want to test the page without setting up the API:

1. Keep the sample documents array in `documents.html`
2. The page will work with the sample data
3. Replace the download URLs with actual file links when ready

## Step 6: File Permissions

Make sure your Google Drive folder and files are accessible:

1. Right-click on your documents folder in Google Drive
2. Click "Share"
3. Set the permission to "Anyone with the link can view"
4. Click "Done"

## Step 7: Test Your Integration

1. Open `documents.html` in your web browser
2. You should see your documents displayed in a grid
3. Test the search functionality
4. Test downloading files

## Troubleshooting

### Common Issues:

1. **"Error loading documents" message**
   - Check that your API key is correct
   - Verify the folder ID is correct
   - Ensure the Google Drive API is enabled
   - Check that your API key has the correct restrictions

2. **Files not appearing**
   - Make sure the folder is shared with "Anyone with the link can view"
   - Verify the folder ID is correct
   - Check the browser console for error messages

3. **Download links not working**
   - Ensure files are shared with appropriate permissions
   - Check that the file types are supported

### Security Considerations:

1. **API Key Security**: Never expose your API key in client-side code for production. Consider using a backend service to proxy the requests.

2. **Rate Limiting**: The Google Drive API has rate limits. For high-traffic sites, consider implementing caching.

3. **File Access**: Only share files that should be publicly accessible.

## Alternative: Using Google Drive Embed

If you prefer a simpler approach, you can embed the Google Drive folder directly:

```html
<iframe src="https://drive.google.com/embeddedfolderview?id=YOUR_FOLDER_ID#grid" 
        style="width:100%; height:600px; border:0;"></iframe>
```

This approach doesn't require API setup but offers less customization.

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Google Cloud Console settings
3. Test with a simple file first
4. Ensure your website is served over HTTPS (required for some API features)

## File Types Supported

The integration supports the following file types:
- PDF files (.pdf)
- Microsoft Office documents (.doc, .docx, .xls, .xlsx, .ppt, .pptx)
- Images (.jpg, .jpeg, .png, .gif)
- Text files (.txt)
- Archive files (.zip)
- Google Docs, Sheets, and Slides (exported as appropriate formats) 