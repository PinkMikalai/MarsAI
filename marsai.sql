-- =====================================================
-- 1. PRÉPARATION ET BASE DE DONNÉES
-- =====================================================
CREATE DATABASE IF NOT EXISTS marsai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE marsai;


-- Sécurité pour l'exécution globale
SET FOREIGN_KEY_CHECKS = 0;


-- =====================================================
-- 2. TABLES INDÉPENDANTES (Niveau 0)
-- =====================================================


CREATE TABLE IF NOT EXISTS tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS acquisition_source (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(300) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS selection_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(250) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS admin_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(250) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS award (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(350) NOT NULL,
    img VARCHAR(350),
    award_rank INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS jury (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(150) NOT NULL,
    lastname VARCHAR(150) NOT NULL,
    illustration VARCHAR(350),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS sponsor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    img VARCHAR(400),
    url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- 3. TABLES AVEC DÉPENDANCES SIMPLES (Niveau 1)
-- =====================================================


-- Table USER (dépend de ROLE)
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(300) NOT NULL UNIQUE,
    password_hash VARCHAR(300) NOT NULL,
    firstname VARCHAR(150),
    lastname VARCHAR(150),
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE INDEX idx_user_role ON user(role_id);


-- Table VIDEO (dépend de ACQUISITION_SOURCE)
CREATE TABLE IF NOT EXISTS video (
    id INT AUTO_INCREMENT PRIMARY KEY,
    youtube_url VARCHAR(350),
    video_file_name VARCHAR(350) NOT NULL,
    srt_file_name VARCHAR(350),
    title_en VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    synopsis_en TEXT NOT NULL,
    synopsis TEXT,
    cover VARCHAR(350) NOT NULL,
    language VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    duration INT COMMENT 'Durée en secondes',
    tech_resume TEXT NOT NULL,
    classification ENUM('100% AI', 'Hybrid') NOT NULL,
    creative_resume TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    realisator_firstname VARCHAR(150),
    realisator_lastname VARCHAR(150),
    realisator_civility ENUM('Mr', 'Mrs', 'Other') DEFAULT 'Mrs',
    birthdate DATE,
    mobile_number VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT NOT NULL,
    social_media_links_json JSON,
    acquisition_source_id INT, -- Correction apportée ici
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_video_acquisition_source FOREIGN KEY (acquisition_source_id) REFERENCES acquisition_source(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE INDEX idx_video_title ON video(title);
CREATE INDEX idx_video_acquisition_source ON video(acquisition_source_id);


-- =====================================================
-- 4. TABLES DÉPENDANT DE USER OU VIDEO (Niveau 2)
-- =====================================================


CREATE TABLE IF NOT EXISTS cms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    element VARCHAR(100) NOT NULL UNIQUE,
    english_content TEXT,
    french_content TEXT,
    illustration VARCHAR(255),
    user_id INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cms_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    duration INT,
    capacity INT,
    illustration VARCHAR(350),
    location VARCHAR(255),
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS still (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    video_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_still_video FOREIGN KEY (video_id) REFERENCES video(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS contributor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(300),
    production_role VARCHAR(150),
    video_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contributor_video FOREIGN KEY (video_id) REFERENCES video(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- 5. TABLES DE GESTION ET LIAISONS COMPLEXES
-- =====================================================


CREATE TABLE IF NOT EXISTS selector_memo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT,
    comment TEXT,
    video_id INT NOT NULL,
    user_id INT NOT NULL,
    selection_status_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_selector_memo_video FOREIGN KEY (video_id) REFERENCES video(id) ON DELETE CASCADE,
    CONSTRAINT fk_selector_memo_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_selector_memo_selection_status FOREIGN KEY (selection_status_id) REFERENCES selection_status(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS admin_video (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment TEXT,
    video_id INT NOT NULL,
    user_id INT NOT NULL,
    admin_status_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_video_video FOREIGN KEY (video_id) REFERENCES video(id) ON DELETE CASCADE,
    CONSTRAINT fk_admin_video_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_admin_video_admin_status FOREIGN KEY (admin_status_id) REFERENCES admin_status(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS assignation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignate_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    video_id INT NOT NULL, 
    user_id INT NOT NULL,
    assigned_by INT NOT NULL, 
    CONSTRAINT fk_assignation_video FOREIGN KEY (video_id) REFERENCES video(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignation_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (video_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    name VARCHAR(255) NOT NULL,
    qrcode VARCHAR(255),
    event_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservation_event FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- 6. TABLES PIVOTS (MANY-TO-MANY)
-- =====================================================


CREATE TABLE IF NOT EXISTS video_tag (
    video_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (video_id, tag_id),
    CONSTRAINT fk_video_tag_video FOREIGN KEY (video_id) REFERENCES video(id) ON DELETE CASCADE,
    CONSTRAINT fk_video_tag_tag FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS video_award (
    video_id INT NOT NULL,
    award_id INT NOT NULL,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (video_id, award_id),
    CONSTRAINT fk_video_award_video FOREIGN KEY (video_id) REFERENCES video(id) ON DELETE CASCADE,
    CONSTRAINT fk_video_award_award FOREIGN KEY (award_id) REFERENCES award(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- 7. RÉACTIVATION DES CLÉS ET INSERTIONS
-- =====================================================
SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO selection_status (name) VALUES 
    ('Favori'), ('à revoir'), ('non-vu'), ('signalé'), ("je n'aime pas"), ("j'aime")
ON DUPLICATE KEY UPDATE name=VALUES(name);


INSERT INTO admin_status (name) VALUES 
    ('En cours de traitement'), ('Validé'), ('Rejeté'), ('En attente de complément')
ON DUPLICATE KEY UPDATE name=VALUES(name);


INSERT INTO role (name) VALUES 
    ('Admin'), ('Selector'), ('Super_admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);