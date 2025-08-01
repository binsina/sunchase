// Google Drive API Integration for Documents Page
class GoogleDriveDocuments {
    constructor(folderId, apiKey) {
        this.folderId = folderId;
        this.apiKey = apiKey;
        this.baseUrl = 'https://www.googleapis.com/drive/v3';
    }

    // Get all files from the specified Google Drive folder (excluding folders)
    async getFilesFromFolder() {
        try {
            const query = `'${this.folderId}' in parents and trashed=false and mimeType!='application/vnd.google-apps.folder'`;
            const url = `${this.baseUrl}/files?q=${encodeURIComponent(query)}&key=${this.apiKey}&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink)`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.processFiles(data.files);
        } catch (error) {
            console.error('Error fetching files from Google Drive:', error);
            throw error;
        }
    }

    // Get all folders from the specified Google Drive folder
    async getFoldersFromFolder() {
        try {
            const query = `'${this.folderId}' in parents and trashed=false and mimeType='application/vnd.google-apps.folder'`;
            const url = `${this.baseUrl}/files?q=${encodeURIComponent(query)}&key=${this.apiKey}&fields=files(id,name,mimeType,modifiedTime)`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.processFolders(data.files);
        } catch (error) {
            console.error('Error fetching folders from Google Drive:', error);
            throw error;
        }
    }

    // Process the files data to match our document format
    processFiles(files) {
        return files.map(file => ({
            id: file.id,
            name: file.name,
            type: this.getFileType(file.mimeType, file.name),
            size: this.formatFileSize(file.size),
            modified: file.modifiedTime,
            downloadUrl: this.getDownloadUrl(file),
            viewUrl: file.webViewLink
        }));
    }

    // Process the folders data to match our folder format
    processFolders(folders) {
        return folders.map(folder => ({
            id: folder.id,
            name: folder.name,
            modified: folder.modifiedTime
        }));
    }

    // Get file type from MIME type or file extension
    getFileType(mimeType, fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        
        const mimeTypeMap = {
            'application/pdf': 'pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
            'application/vnd.ms-powerpoint': 'ppt',
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'application/zip': 'zip',
            'text/plain': 'txt'
        };

        return mimeTypeMap[mimeType] || extension || 'default';
    }

    // Format file size from bytes to human readable format
    formatFileSize(bytes) {
        if (!bytes) return 'Unknown size';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Get download URL for the file
    getDownloadUrl(file) {
        // For files that can be downloaded directly
        if (file.webContentLink) {
            return file.webContentLink;
        }
        
        // For Google Docs, Sheets, etc., we need to export them
        const exportFormats = {
            'application/vnd.google-apps.document': 'application/pdf',
            'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.google-apps.presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        };

        if (exportFormats[file.mimeType]) {
            return `${this.baseUrl}/files/${file.id}/export?mimeType=${exportFormats[file.mimeType]}&key=${this.apiKey}`;
        }

        // Fallback to web view link
        return file.webViewLink;
    }

    // Search files by name or type
    searchFiles(files, searchTerm) {
        if (!searchTerm) return files;
        
        const term = searchTerm.toLowerCase();
        return files.filter(file => 
            file.name.toLowerCase().includes(term) ||
            file.type.toLowerCase().includes(term)
        );
    }
}

// Utility functions for the documents page
const DocumentUtils = {
    // Get appropriate icon for file type
    getFileIcon(fileType) {
        const iconMap = {
            'pdf': 'fa-file-pdf-o file-pdf',
            'doc': 'fa-file-word-o file-doc',
            'docx': 'fa-file-word-o file-doc',
            'xls': 'fa-file-excel-o file-xls',
            'xlsx': 'fa-file-excel-o file-xls',
            'ppt': 'fa-file-powerpoint-o file-ppt',
            'pptx': 'fa-file-powerpoint-o file-ppt',
            'jpg': 'fa-file-image-o file-img',
            'jpeg': 'fa-file-image-o file-img',
            'png': 'fa-file-image-o file-img',
            'gif': 'fa-file-image-o file-img',
            'zip': 'fa-file-archive-o file-zip',
            'txt': 'fa-file-text-o file-txt'
        };
        return iconMap[fileType] || 'fa-file-o file-default';
    },

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Render documents in the grid
    renderDocuments(documents, containerId) {
        const container = document.getElementById(containerId);
        
        if (!documents || documents.length === 0) {
            container.innerHTML = '<div class="no-results">No documents found matching your search.</div>';
            return;
        }

        container.innerHTML = documents.map(doc => `
            <div class="document-card" data-document-id="${doc.id}">
                <div class="document-icon">
                    <i class="fa ${this.getFileIcon(doc.type)}"></i>
                </div>
                <div class="document-title">${doc.name}</div>
                <div class="document-info">
                    <div>Size: ${doc.size}</div>
                    <div>Modified: ${this.formatDate(doc.modified)}</div>
                </div>
                <a href="${doc.downloadUrl}" class="download-btn" target="_blank">
                    <i class="fa fa-download"></i> Download
                </a>
            </div>
        `).join('');
    },

    // Show loading spinner
    showLoading(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="loading-spinner">
                <i class="fa fa-spinner fa-spin fa-2x"></i>
                <p>Loading documents...</p>
            </div>
        `;
    },

    // Show error message
    showError(containerId, message) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="error-message">
                <i class="fa fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GoogleDriveDocuments, DocumentUtils };
} 