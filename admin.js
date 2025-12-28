const API_URL = '/api';

// State
let currentSection = 'skills';
let editItemId = null;
let itemToDelete = null;

// --- Helper Functions ---

// 1. File Upload Handler
window.handleFileUpload = async (input, targetId) => {
    const file = input.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const btn = input.nextElementSibling; // The upload button/indicator if I added one, or just change cursor
    input.disabled = true;

    try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        // Update the text input with the file path
        document.getElementById(targetId).value = data.filePath;
        alert('File uploaded successfully! Don\'t forget to Save the form.');
    } catch (e) {
        console.error(e);
        alert('Upload failed: ' + e.message);
    } finally {
        input.disabled = false;
        input.value = ''; // Reset file input
    }
};

// 2. URL Validation
function isValidUrl(string) {
    if (!string) return true; // Optional fields are valid if empty
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Tab Switching
function switchTab(section) {
    currentSection = section;

    // Update UI tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[onclick="switchTab('${section}')"]`).classList.add('active');

    // Show content
    document.querySelectorAll('.section-content').forEach(c => c.classList.remove('active'));
    document.getElementById(section).classList.add('active');

    // Fetch data
    fetchData(section);
}

// Fetch Data
async function fetchData(section) {
    const container = document.getElementById(`${section}-list`);
    container.innerHTML = 'Loading...';

    try {
        const response = await fetch(`${API_URL}/${section}?include_hidden=true`);
        const data = await response.json();

        if (data.length === 0) {
            container.innerHTML = '<p>No items found.</p>';
            return;
        }

        container.innerHTML = data.map(item => `
            <div class="item-row" data-id="${item.id}">
                <div>
                    <strong><i class="fas fa-grip-vertical" style="color:#ccc; margin-right:10px"></i> ${item.title}</strong>
                    <br>
                    <small>Order: ${item.display_order}</small> | 
                    <small style="color:${item.is_visible ? 'green' : 'red'}">Visible: ${item.is_visible ? '1' : '0'}</small>
                </div>
                <div>
                    <button class="btn btn-edit" onclick='openModal("${section}", ${JSON.stringify(item).replace(/'/g, "&#39;")})'>Edit</button>
                    <button class="btn btn-delete" onclick="deleteItem('${section}', ${item.id})">Delete</button>
                </div>
            </div>
        `).join('');

        // Initialize Sortable
        new Sortable(container, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            handle: '.item-row', // Drag by the whole row
            onEnd: async function (evt) {
                // Get new order
                const orderedIds = Array.from(container.children).map(child => child.getAttribute('data-id'));

                // Send to server
                try {
                    const res = await fetch('/api/admin/reorder', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            table: section,
                            orderedIds: orderedIds
                        })
                    });

                    if (res.ok) {
                        console.log('Order updated in DB');
                        // visually update the "Order: X" text for all rows
                        Array.from(container.children).forEach((row, index) => {
                            const orderSmall = row.querySelector('small');
                            if (orderSmall) {
                                orderSmall.innerText = `Order: ${index + 1}`;
                            }
                        });
                    } else {
                        alert('Failed to update order in DB');
                        fetchData(section); // Revert changes by reloading
                    }
                } catch (err) {
                    console.error(err);
                    alert('Network error updating order');
                    fetchData(section);
                }
            }
        });

    } catch (err) {
        container.innerHTML = '<p style="color:red">Error loading data.</p>';
        console.error(err);
    }
}

// Modal Handling
const modal = document.getElementById('formModal');
const formFields = document.getElementById('formFields');

function openModal(section, item = null) {
    editItemId = item ? item.id : null;
    document.getElementById('itemType').value = section;
    document.getElementById('modalTitle').innerText = item ? `Edit ${section.slice(0, -1)}` : `Add ${section.slice(0, -1)}`;

    // Set Main Visibility
    document.getElementById('isVisible').checked = item ? item.is_visible : true;

    // Helper to generate link field with visibility toggle
    // Helper to generate file upload field
    const fileField = (label, name, value, isVisible) => {
        let checkboxName = name.replace('_link', '_visible').replace('_path', '_visible');
        if (checkboxName === name) checkboxName = name + '_visible';

        return `
        <div class="form-group">
            <label>${label}</label>
            <div style="display:flex; gap:10px; align-items:center;">
                <input type="text" id="${name}" name="${name}" value="${value || ''}" placeholder="Upload a file or paste URL" style="flex:1;"
                    oninput="const chk = document.getElementById('${checkboxName}'); if(this.value.trim() === '') chk.checked = false; else if(!chk.checked) chk.checked = true;">
                <input type="file" onchange="handleFileUpload(this, '${name}')" style="width:100px;">
            </div>
            ${value ? `<div style="font-size:0.8em; margin-top:5px;"><a href="${value}" target="_blank">View Current File</a></div>` : ''}
            <div style="margin-top:5px; font-size:0.9em; color:#666">
                <input type="checkbox" id="${checkboxName}" name="${checkboxName}" value="true" ${isVisible !== false ? 'checked' : ''}> Show this certificate?
            </div>
        </div>`;
    };

    // Helper to generate link field with visibility toggle
    const linkField = (label, name, value, isVisible) => {
        // Correct naming mismatch: source_code_link -> source_code_visible
        const checkboxName = name.replace('_link', '_visible');
        return `
        <div class="form-group">
            <label>${label}</label>
            <input type="text" name="${name}" value="${value || ''}"
                oninput="const chk = document.getElementById('${checkboxName}'); if(this.value.trim() === '') chk.checked = false; else if(!chk.checked) chk.checked = true;">
            <div style="margin-top:5px; font-size:0.9em; color:#666">
                <input type="checkbox" id="${checkboxName}" name="${checkboxName}" value="true" ${isVisible !== false ? 'checked' : ''}> Show this link?
            </div>
        </div>`;
    };

    // Generate Fields based on section
    let fields = '';

    const commonFields = `
        <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${item ? item.title : ''}" required>
        </div>
        <div class="form-group">
            <label>Display Order</label>
            <input type="number" name="display_order" value="${item ? item.display_order : 0}">
        </div>
    `;

    if (section === 'skills') {
        fields = `
            ${commonFields}
            <div class="form-group">
                <label>Technologies (Comma separated)</label>
                <textarea name="technologies">${item ? item.technologies : ''}</textarea>
            </div>
        `;
    } else if (section === 'projects') {
        fields = `
            ${commonFields}
            <div class="form-group">
                <label>Description</label>
                <textarea name="description">${item ? item.description : ''}</textarea>
            </div>
            <div class="form-group">
                <label>Technologies</label>
                <input type="text" name="technologies" value="${item ? item.technologies : ''}">
            </div>
            ${linkField('Source Code Link', 'source_code_link', item?.source_code_link, item?.source_code_visible)}
            ${linkField('Demo Video Link', 'demo_video_link', item?.demo_video_link, item?.demo_video_visible)}
            ${linkField('Live Demo Link', 'live_demo_link', item?.live_demo_link, item?.live_demo_visible)}
            ${fileField('Certificate File', 'certificate_link', item?.certificate_link, item?.certificate_visible)}
        `;
    } else if (section === 'internships') {
        fields = `
            <div class="form-group">
                <label>Role / Title</label>
                <input type="text" name="title" value="${item ? item.title : ''}" required>
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" name="company" value="${item ? item.company : ''}" required>
            </div>
            <div class="form-group">
                <label>Timeline (e.g. Aug 2024 - Oct 2024)</label>
                <input type="text" name="period" value="${item ? item.period : ''}">
            </div>
            <div class="form-group">
                <label>Technologies Used</label>
                <input type="text" name="technologies" value="${item ? item.technologies : ''}">
            </div>
            <div class="form-group">
                <label>Display Order</label>
                <input type="number" name="display_order" value="${item ? item.display_order : 0}">
            </div>
            <div class="form-group">
                <label>Description (Use • for bullets)</label>
                <textarea name="description" rows="5">${item ? item.description : ''}</textarea>
            </div>
            ${linkField('Source Code Link', 'source_code_link', item?.source_code_link, item?.source_code_visible)}
            ${linkField('Demo Video Link', 'demo_video_link', item?.demo_video_link, item?.demo_video_visible)}
            ${linkField('Live Demo Link', 'live_demo_link', item?.live_demo_link, item?.live_demo_visible)}
            ${fileField('Certificate File', 'certificate_link', item?.certificate_link, item?.certificate_visible)}
        `;
    } else if (section === 'certifications') {
        fields = `
            ${commonFields}
            <div class="form-group">
                <label>Issuer (e.g. IBM, Microsoft)</label>
                <input type="text" name="issuer" value="${item ? item.issuer : ''}">
            </div>
             <div class="form-group">
                <label>Date (e.g. Jan 2024)</label>
                <input type="text" name="date_issued" value="${item ? item.date_issued : ''}">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" rows="3">${item ? item.description : ''}</textarea>
            </div>
            ${fileField('Certificate File/Image', 'certificate_image_path', item?.certificate_image_path, item?.certificate_visible)}
            <div class="form-group">
                <label>Verify Link (Optional URL)</label>
                <input type="text" name="verify_link" value="${item?.verify_link || ''}">
            </div>
        `;
    } else if (section === 'achievements') {
        fields = `
            ${commonFields}
            <div class="form-group">
                <label>Role (if applicable)</label>
                <input type="text" name="role" value="${item ? item.role : ''}">
            </div>
            <div class="form-group">
                <label>Description (Use • for bullets)</label>
                <textarea name="description" rows="5">${item ? item.description : ''}</textarea>
            </div>
            ${linkField('Source Code Link', 'source_code_link', item?.source_code_link, item?.source_code_visible)}
            ${linkField('Demo Video Link', 'demo_video_link', item?.demo_video_link, item?.demo_video_visible)}
            ${linkField('Live Demo Link', 'live_demo_link', item?.live_demo_link, item?.live_demo_visible)}
            ${fileField('Certificate File', 'certificate_link', item?.certificate_link, item?.certificate_visible)}
        `;
    }

    formFields.innerHTML = fields;
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

// Form Submission
document.getElementById('adminForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const section = document.getElementById('itemType').value;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validation
    const invalidFields = [];
    for (const [key, value] of Object.entries(data)) {
        if (key.includes('link') && value && typeof value === 'string' && !key.includes('visible')) {
            // Check if it looks like a URL (very basic check)
            if (value.startsWith('http')) {
                if (!isValidUrl(value)) invalidFields.push(`${key}: Invalid URL format`);
            }
            // If it's a file path (/uploads/...), we skip URL validation
        }
    }

    if (invalidFields.length > 0) {
        alert('Validation Error:\n' + invalidFields.join('\n'));
        return;
    }

    // Explicitly handle checkbox (if unchecked, it's missing from data, so force it)
    data.is_visible = document.getElementById('isVisible').checked;

    // Handle Link Visibility Checkboxes if they exist
    if (document.getElementById('source_code_visible')) {
        data.source_code_visible = document.getElementById('source_code_visible').checked;
    }
    if (document.getElementById('demo_video_visible')) {
        data.demo_video_visible = document.getElementById('demo_video_visible').checked;
    }
    if (document.getElementById('live_demo_visible')) {
        data.live_demo_visible = document.getElementById('live_demo_visible').checked;
    }
    if (document.getElementById('certificate_visible')) {
        data.certificate_visible = document.getElementById('certificate_visible').checked;
    }
    // Also handle certificate_image_visible if it exists (for Certifications table alias)
    // Actually the function creates 'certificate_visible' because replacer replaces '_image_path' with '_visible'
    // Let's verify: 'certificate_image_path' -> 'certificate_visible'. Yes.

    // Add ID and Table name to payload
    const payload = { ...data, table: section };
    if (editItemId) {
        payload.id = editItemId;
    }

    try {
        const response = await fetch('/api/admin/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Saved successfully!');
            closeModal();
            fetchData(section); // Refresh list
        } else {
            const err = await response.json();
            alert('Error: ' + err.error);
        }
    } catch (err) {
        console.error(err);
        alert('Network error');
    }
});

// Delete
async function deleteItem(section, id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            const response = await fetch(`/api/admin/delete/${section}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchData(section);
            } else {
                alert('Error deleting item');
            }
        } catch (err) { console.error(err); }
    }
}

// Initial Load
fetchData('skills');
