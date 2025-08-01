// Google Sheets API Integration for Registration Form
class GoogleSheetsAPI {
    constructor() {
        // Replace this URL with your Google Apps Script web app URL
        this.scriptUrl = 'https://script.google.com/macros/s/AKfycbzKGSJF6S0U7nCJdw8MDo5QGtdiRdhjRyPXhq1x7V9u0-wMgr95g9zUGjGtPF586tF1/exec';
    }

    // Send registration data to Google Sheets
    async sendRegistrationData(formData) {
        try {
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'addRegistration',
                    data: formData
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error sending data to Google Sheets:', error);
            throw error;
        }
    }

    // Validate form data
    validateFormData(formData) {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'unitOwned'];
        const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            throw new Error('Invalid email format');
        }

        // Basic phone validation (allows various formats)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            throw new Error('Invalid phone number format');
        }

        return true;
    }
}

// Initialize the API
const sheetsAPI = new GoogleSheetsAPI();

// Form submission handler
async function handleRegistrationSubmit(formData) {
    try {
        // Validate form data
        sheetsAPI.validateFormData(formData);

        // Show loading state
        const submitButton = document.querySelector('.btn-register-submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        // Send data to Google Sheets
        const result = await sheetsAPI.sendRegistrationData(formData);

        // Show success message
        showNotification('Registration submitted successfully!', 'success');
        
        // Clear the form
        document.getElementById('registrationForm').reset();

        return result;
    } catch (error) {
        console.error('Registration error:', error);
        showNotification(`Registration failed: ${error.message}`, 'error');
        throw error;
    } finally {
        // Reset button state
        const submitButton = document.querySelector('.btn-register-submit');
        submitButton.textContent = 'Register';
        submitButton.disabled = false;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else {
        notification.style.backgroundColor = '#17a2b8';
    }

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Add close functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
} 