-- Skills Section
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    technologies TEXT NOT NULL, -- Stored as comma separated or simple text
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Section
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    technologies TEXT, -- Comma separated tags
    source_code_link VARCHAR(500),
    demo_video_link VARCHAR(500),
    live_demo_link VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE, -- For "Major Project" badge
    icon_class VARCHAR(50) DEFAULT 'fas fa-briefcase', -- FontAwesome icon class
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Internships Section
CREATE TABLE IF NOT EXISTS internships (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT, -- Can store bullet points separated by newlines or pipes
    technologies TEXT,
    source_code_link VARCHAR(500),
    demo_video_link VARCHAR(500),
    live_demo_link VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    icon_class VARCHAR(50) DEFAULT 'fas fa-briefcase',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certifications Section
CREATE TABLE IF NOT EXISTS certifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    date_issued VARCHAR(100),
    description TEXT,
    certificate_image_path VARCHAR(500), -- Path to image or URL
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    icon_class VARCHAR(50) DEFAULT 'fas fa-certificate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements & Hackathons Section
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    role VARCHAR(255), -- e.g., "Finalist", "Participant"
    description TEXT,
    source_code_link VARCHAR(500),
    demo_video_link VARCHAR(500),
    live_demo_link VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    icon_class VARCHAR(50) DEFAULT 'fas fa-trophy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
