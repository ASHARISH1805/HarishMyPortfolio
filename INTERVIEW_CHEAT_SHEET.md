# 🚀 Portfolio Project Interview Cheat Sheet

## 🛠️ Tech Stack
| Component | Technology | Reasoning |
|-----------|------------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JS | Lightweight, fast load times (FCP), full control over DOM. |
| **Backend** | Node.js, Express.js | Non-blocking I/O, great for API development, shared language (JS) with frontend. |
| **Database** | PostgreSQL | Structured relational data, ACID compliance for data integrity. |
| **Auth** | Google OAuth2 | Secure, passwordless login for Admin. |
| **Media** | Multer | Efficient handling of file uploads (images/videos). |

## 🌟 Key Features & Implementation
### 1. Dynamic Admin Panel
*   **What it does:** Allows live editing of projects, skills, and certifications without code changes.
*   **How:** Protected REST API (`/api/admin/*`) consumes JSON from the frontend.
*   **Cool Tech:** Uses **Sortable.js** for drag-and-drop reordering.

### 2. Security (Google OAuth)
*   **Flow:** Frontend gets Google ID Token -> Sends to Backend -> Backend verifies with Google -> Checks email against a **Whitelist** (e.g., `ushawin2020@gmail.com`).
*   **Why:** Prevents unauthorized access to the admin panel.

### 3. Database Auto-Migration
*   **Feature:** `ensureSchema()` function in `server.js`.
*   **Logic:** On startup, checks if tables exist. If not, it creates them.
*   **Benefit:** Zero-configuration deployment; no manual SQL scripts needed.

### 4. Contact Form
*   **Tech:** **Nodemailer**.
*   **Flow:** User submits form -> Data saved to DB -> Async email sent to your inbox.
*   **Benefit:** Persists data (in case email fails) AND gives instant notification.

## 💾 Database Schema (PostgreSQL)
*   **Tables:** `projects`, `skills`, `internships`, `certifications`, `achievements`, `micro_saas`, `messages`.
*   **Key Columns:** `is_visible` (toggle visibility), `display_order` (sorting), `technologies` (text).

## 💡 "How Did You Handle..." (STAR Method)

### Challenge: Large File Uploads
*   **Situation:** Users need to upload demo videos.
*   **Task:** Handle large binaries without crashing the server.
*   **Action:** Used `Multer` middleware to stream files to disk storage instead of holding them in RAM. Added unique timestamp naming to avoid overwrites.
*   **Result:** Stable upload of 50MB+ video files.

### Challenge: Real-time Reordering
*   **Situation:** Wanted to arrange skills by priority, not just alphabetical.
*   **Task:** Implement drag-and-drop.
*   **Action:** Used `Sortable.js` on UI. On "drop", sent array of IDs to backend. Backend used a **SQL Transaction** to update `display_order` for all items atomically.
*   **Result:** Custom sorting that persists across reloads.

### Challenge: Deployment Conflicts
*   **Situation:** Git push timeouts with large video files.
*   **Action:** Configured Git HTTP buffer settings (`git config http.postBuffer`) and learned to exclude heavy assets from version control in favor of object storage (S3) concepts.

## 🔗 Quick API Endpoints
*   `GET /api/projects` - Public project data.
*   `POST /api/admin/save` - Create/Update items (Admin only).
*   `POST /api/contact` - Submit contact form.
