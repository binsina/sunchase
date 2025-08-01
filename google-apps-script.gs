// Google Apps Script for Registration Form
// Deploy this as a web app to handle form submissions

// Replace this with your Google Sheet ID
const SPREADSHEET_ID = '1I6Wxfy5MtBcuiqg4OIsFSo5xVykC4gsYbQDHGUQ1D1s';

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Check if this is a registration submission
    if (data.action === 'addRegistration') {
      return addRegistrationToSheet(data.data);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing request:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'Registration API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function addRegistrationToSheet(registrationData) {
  try {
    // Get the spreadsheet and the first sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheets()[0]; // Get the first sheet
    
    // Prepare the data row
    const rowData = [
      registrationData.timestamp || new Date().toISOString(),
      registrationData.firstName,
      registrationData.lastName,
      registrationData.email,
      registrationData.phone,
      registrationData.unitOwned
    ];
    
    // Add headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Unit Owned'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Append the new row
    sheet.appendRow(rowData);
    
    // Log the submission for debugging
    console.log('Registration added:', registrationData);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Registration added successfully',
        row: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error adding registration to sheet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Failed to add registration to sheet: ' + error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the setup
function testConnection() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheets()[0];
    console.log('Connection successful. Sheet name:', sheet.getName());
    console.log('Last row:', sheet.getLastRow());
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
}

// Function to set up the sheet headers
function setupSheetHeaders() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheets()[0];
    
    const headers = ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Unit Owned'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    console.log('Sheet headers set up successfully');
    return true;
  } catch (error) {
    console.error('Failed to set up headers:', error);
    return false;
  }
} 