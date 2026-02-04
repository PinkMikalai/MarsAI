-- =====================================================
-- INSERTIONS DE DONNÉES DE TEST POUR MARSAI - 25 VIDÉOS
-- Fichier: insert.sql
-- Date: 2026-01-28
-- =====================================================

-- =====================================================
-- NOTE: Les rôles sont déjà créés dans marsai.sql
-- Admin (id=1), Selector (id=2), Super_admin (id=3)
-- La table "jury" est séparée pour afficher les célébrités (sans compte)
-- =====================================================

-- =====================================================
-- 1. UTILISATEURS (1 Super Admin, 1 Admin, 3 Selectors)
-- =====================================================
-- - Super_admin (role_id=3) : gestion complète du système
-- - Admin (role_id=1) : validation des vidéos, gestion courante
-- - Selector (role_id=2) : note et commente les vidéos via selector_memo

-- Mot de passe hashé exemple : "password123" (bcrypt)
INSERT INTO user (email, password_hash, firstname, lastname, role_id) VALUES
-- Super Admin
('superadmin@marsai.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Marie', 'Dupont', 3),
-- Admin
('admin@marsai.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jean', 'Martin', 1),
-- Selectors (role_id=2) - Ce sont eux qui évaluent les vidéos
('selector1@marsai.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sophie', 'Bernard', 2),
('selector2@marsai.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lucas', 'Petit', 2),
('selector3@marsai.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Emma', 'Leroy', 2);

-- =====================================================
-- 2. SOURCES D'ACQUISITION
-- =====================================================

INSERT INTO acquisition_source (name) VALUES
('Site officiel'),
('Festival de Cannes'),
('Réseaux sociaux'),
('Partenaire média'),
('Bouche à oreille'),
('FilmFreeway'),
('Short of the Week'),
('Vimeo Staff Pick');

-- =====================================================
-- 3. TAGS
-- =====================================================

INSERT INTO tag (name) VALUES
('Science-Fiction'),
('Drame'),
('Animation'),
('Documentaire'),
('Expérimental'),
('Court-métrage'),
('Fantastique'),
('Comédie'),
('Thriller'),
('Romance'),
('Horreur'),
('Action'),
('Musical'),
('Noir et Blanc'),
('Poésie visuelle');

-- =====================================================
-- 4. AWARDS (Prix)
-- =====================================================

INSERT INTO award (title, img, award_rank) VALUES
('Grand Prix Mars AI', 'grand_prix.png', 1),
('Prix du Public', 'prix_public.png', 2),
('Meilleure Innovation Technique', 'innovation.png', 3),
('Prix de la Créativité', 'creativite.png', 4),
('Mention Spéciale du Jury', 'mention.png', 5),
('Prix du Meilleur Scénario IA', 'scenario.png', 6),
('Prix de la Meilleure Bande Son', 'bande_son.png', 7),
('Prix Coup de Coeur', 'coup_coeur.png', 8);

-- =====================================================
-- 5. JURY (Célébrités affichées sur le site - SANS COMPTE)
-- =====================================================
-- ATTENTION: Cette table sert UNIQUEMENT à afficher les personnalités 
-- publiques du jury sur le site web. Ces personnes N'ONT PAS de compte
-- utilisateur et NE PEUVENT PAS noter les vidéos.
-- Les notations sont faites par les SELECTORS (table user, role_id=2)

INSERT INTO jury (firstname, lastname, illustration, bio) VALUES
('Steven', 'Spielberg', 'spielberg.jpg', 'Réalisateur légendaire, pionnier des effets spéciaux et du cinéma grand public.'),
('Ava', 'DuVernay', 'duvernay.jpg', 'Réalisatrice primée, engagée dans la représentation diverse au cinéma.'),
('Denis', 'Villeneuve', 'villeneuve.jpg', 'Maître du cinéma de science-fiction contemporain.'),
('Greta', 'Gerwig', 'gerwig.jpg', 'Scénariste et réalisatrice acclamée pour son style unique et personnel.'),
('Bong', 'Joon-ho', 'bongjoonho.jpg', 'Réalisateur sud-coréen oscarisé, maître du mélange des genres.'),
('Chloé', 'Zhao', 'zhao.jpg', 'Réalisatrice visionnaire, connue pour son approche naturaliste.');

-- =====================================================
-- 6. SPONSORS
-- =====================================================

INSERT INTO sponsor (name, img, url) VALUES
('NVIDIA', 'nvidia_logo.png', 'https://www.nvidia.com'),
('Adobe', 'adobe_logo.png', 'https://www.adobe.com'),
('OpenAI', 'openai_logo.png', 'https://www.openai.com'),
('Runway ML', 'runway_logo.png', 'https://runwayml.com'),
('Stability AI', 'stability_logo.png', 'https://stability.ai'),
('Anthropic', 'anthropic_logo.png', 'https://anthropic.com'),
('Midjourney', 'midjourney_logo.png', 'https://midjourney.com'),
('ElevenLabs', 'elevenlabs_logo.png', 'https://elevenlabs.io');

-- =====================================================
-- 7. NEWSLETTER
-- =====================================================

INSERT INTO newsletter (email) VALUES
('fan1@email.com'),
('cinephile@gmail.com'),
('ai.enthusiast@outlook.com'),
('filmmaker@yahoo.com'),
('tech.lover@proton.me'),
('artiste.digital@gmail.com'),
('producer.paris@email.fr'),
('student.cinema@university.edu'),
('blogger.tech@medium.com'),
('vfx.artist@studio.com');

-- =====================================================
-- 8. 25 VIDÉOS (Films)
-- =====================================================

INSERT INTO video (youtube_url, video_file_name, srt_file_name, title_en, title, synopsis_en, synopsis, cover, language, country, duration, tech_resume, classification, creative_resume, email, realisator_firstname, realisator_lastname, realisator_civility, birthdate, mobile_number, phone_number, address, social_media_links_json, acquisition_source_id) VALUES

-- Film 1
('https://www.youtube.com/watch?v=jNQXAC9IVRw', 'neon_dreams.mp4', 'neon_dreams.srt', 
'Neon Dreams', 'Rêves Néon',
'A cyberpunk journey through a city where AI controls everything, until one artist decides to paint the sky with forbidden colors.',
'Un voyage cyberpunk à travers une ville où l\'IA contrôle tout, jusqu\'à ce qu\'un artiste décide de peindre le ciel avec des couleurs interdites.',
'neon_dreams_cover.jpg', 'Anglais', 'États-Unis', 720,
'Generated using Midjourney v6, Runway Gen-2, and Stable Diffusion XL. Audio composed with Suno AI.',
'100% AI',
'This film explores the tension between technological control and human creativity in a dystopian future.',
'alex.chen@email.com', 'Alex', 'Chen', 'Mr', '1992-05-15', '+1-555-0101', '+1-555-0102',
'123 Innovation Street, San Francisco, CA 94102',
'{"twitter": "@alexchen_ai", "instagram": "@alexchen.films"}', 1),

-- Film 2
('https://www.youtube.com/watch?v=hY7m5jjJ9mM', 'last_garden.mp4', 'last_garden.srt',
'The Last Garden', 'Le Dernier Jardin',
'In a world ravaged by climate change, an elderly woman tends to Earth\'s last remaining garden with the help of a sentient AI companion.',
'Dans un monde ravagé par le changement climatique, une femme âgée entretient le dernier jardin de la Terre avec l\'aide d\'un compagnon IA sensible.',
'last_garden_cover.jpg', 'Français', 'France', 900,
'Created with Pika Labs, ElevenLabs for voice, and custom-trained LoRA models for consistent character design.',
'Hybrid',
'An emotional meditation on nature, aging, and the unexpected bonds we form with artificial beings.',
'marie.dubois@email.fr', 'Marie', 'Dubois', 'Mrs', '1985-11-22', '+33-6-12-34-56-78', NULL,
'45 Rue de la Paix, 75002 Paris, France',
'{"instagram": "@mariedubois.art"}', 2),

-- Film 3
('https://www.youtube.com/watch?v=ZZ5LpwO-An4', 'digital_pulse.mp4', NULL,
'Digital Pulse', 'Pulsation Digitale',
'A music video exploring the rhythm of data flowing through neural networks, visualized as a living organism.',
'Un clip musical explorant le rythme des données circulant dans les réseaux de neurones, visualisé comme un organisme vivant.',
'digital_pulse_cover.jpg', 'Instrumental', 'Allemagne', 300,
'Audio generated with Mubert AI, visuals with TouchDesigner and ComfyUI custom workflows.',
'100% AI',
'Synesthesia meets technology in this audiovisual experience that transforms code into art.',
'hans.mueller@email.de', 'Hans', 'Mueller', 'Mr', '1998-03-08', '+49-170-1234567', NULL,
'Friedrichstraße 100, 10117 Berlin, Germany',
'{"soundcloud": "@hansbeats", "youtube": "@DigitalPulseAI"}', 3),

-- Film 4
('https://www.youtube.com/watch?v=EIyixC9NsLI', 'memory_fragments.mp4', 'memory_fragments.srt',
'Memory Fragments', 'Fragments de Mémoire',
'A documentary-style piece following AI attempts to reconstruct human memories from digital footprints.',
'Un documentaire suivant les tentatives de l\'IA pour reconstruire les souvenirs humains à partir d\'empreintes numériques.',
'memory_fragments_cover.jpg', 'Anglais', 'Royaume-Uni', 1200,
'Utilized GPT-4 for narration writing, Synthesia for presenter, and DALL-E 3 for archival imagery recreation.',
'Hybrid',
'Questions what makes memories real and whether AI can truly understand human experience.',
'sarah.jones@email.co.uk', 'Sarah', 'Jones', 'Mrs', '1990-07-30', '+44-7700-900123', '+44-20-7946-0958',
'10 Downing Street, London SW1A 2AA, UK',
'{"twitter": "@sarahjones_doc", "vimeo": "@memoryfragments"}', 4),

-- Film 5
('https://www.youtube.com/watch?v=wZZ7oFKsKzY', 'silicon_soul.mp4', 'silicon_soul.srt',
'Silicon Soul', 'Âme de Silicium',
'An android discovers art and begins to question the nature of consciousness and creativity.',
'Un androïde découvre l\'art et commence à questionner la nature de la conscience et de la créativité.',
'silicon_soul_cover.jpg', 'Japonais', 'Japon', 840,
'Made with custom Stable Diffusion models, Whisper for translation, and Kling AI for video generation.',
'100% AI',
'A philosophical exploration of what it means to create and feel, told from a machine perspective.',
'yuki.tanaka@email.jp', 'Yuki', 'Tanaka', 'Mrs', '1995-12-01', '+81-90-1234-5678', NULL,
'1-1 Shibuya, Tokyo 150-0002, Japan',
'{"twitter": "@yukitanaka_ai", "pixiv": "@siliconsoulmanga"}', 5),

-- Film 6
('https://www.youtube.com/watch?v=NRItYDKSqpQ', 'urban_symphony.mp4', NULL,
'Urban Symphony', 'Symphonie Urbaine',
'City sounds transformed into an orchestral piece, with AI-generated visuals matching the urban rhythm.',
'Les sons de la ville transformés en pièce orchestrale, avec des visuels générés par IA correspondant au rythme urbain.',
'urban_symphony_cover.jpg', 'Français', 'Canada', 480,
'Audio processed with AIVA and custom AI models, visuals generated with Midjourney and After Effects AI tools.',
'Hybrid',
'A love letter to Montreal, showing how AI can help us see the music hidden in everyday life.',
'pierre.lambert@email.ca', 'Pierre', 'Lambert', 'Mr', '1988-09-14', '+1-514-555-0199', NULL,
'1234 Rue Saint-Denis, Montreal, QC H2X 3K6, Canada',
'{"instagram": "@pierrelambert.mtl"}', 1),

-- Film 7
('https://www.youtube.com/watch?v=dMH0bHeiRNg', 'infinite_loop.mp4', 'infinite_loop.srt',
'Infinite Loop', 'Boucle Infinie',
'A programmer trapped in a recursive nightmare must debug their own existence to escape.',
'Un programmeur piégé dans un cauchemar récursif doit déboguer sa propre existence pour s\'échapper.',
'infinite_loop_cover.jpg', 'Anglais', 'Australie', 660,
'Entire film generated using Sora, with voice acting from ElevenLabs and music from Soundraw.',
'100% AI',
'Combines horror and tech anxiety into a mind-bending narrative about the code that runs our lives.',
'james.wilson@email.au', 'James', 'Wilson', 'Mr', '1993-02-28', '+61-4-1234-5678', NULL,
'100 George Street, Sydney NSW 2000, Australia',
'{"twitter": "@jameswilson_dev", "github": "@infiniteloopfilm"}', 3),

-- Film 8
('https://www.youtube.com/watch?v=J---aiyznGQ', 'echoes_tomorrow.mp4', 'echoes_tomorrow.srt',
'Echoes of Tomorrow', 'Échos de Demain',
'Children in 2050 discover old footage of today and try to understand our world through AI interpretation.',
'Des enfants en 2050 découvrent d\'anciennes images d\'aujourd\'hui et tentent de comprendre notre monde à travers l\'interprétation de l\'IA.',
'echoes_tomorrow_cover.jpg', 'Espagnol', 'Espagne', 1080,
'Used LumaAI Dream Machine, Claude for script, and custom trained voice models for child narration.',
'Hybrid',
'A touching reflection on how future generations might view our present moment.',
'carmen.rodriguez@email.es', 'Carmen', 'Rodriguez', 'Mrs', '1987-06-10', '+34-612-345-678', '+34-91-123-4567',
'Calle Gran Vía 42, 28013 Madrid, Spain',
'{"instagram": "@carmenrodriguez.cine", "twitter": "@carmen_echoes"}', 2),

-- Film 9
('https://www.youtube.com/watch?v=2WPCLda_erI', 'quantum_dreams.mp4', NULL,
'Quantum Dreams', 'Rêves Quantiques',
'An abstract visualization of quantum physics concepts, turning the invisible world into stunning imagery.',
'Une visualisation abstraite des concepts de physique quantique, transformant le monde invisible en imagerie époustouflante.',
'quantum_dreams_cover.jpg', 'Sans dialogue', 'Suisse', 420,
'Scientific accuracy verified by CERN physicists. Visuals generated with custom ComfyUI nodes and Houdini AI plugins.',
'100% AI',
'Makes the abstract concrete, showing the beauty hidden in the fundamental nature of reality.',
'anna.schmidt@email.ch', 'Anna', 'Schmidt', 'Mrs', '1991-04-25', '+41-79-123-45-67', NULL,
'Bahnhofstrasse 10, 8001 Zürich, Switzerland',
'{"linkedin": "@annaschmidt-physicist"}', 4),

-- Film 10
('https://www.youtube.com/watch?v=VnnWp_akOrE', 'renaissance_ai.mp4', 'renaissance_ai.srt',
'Renaissance AI', 'Renaissance IA',
'What if Leonardo da Vinci had access to artificial intelligence? A speculative historical fiction.',
'Et si Léonard de Vinci avait eu accès à l\'intelligence artificielle ? Une fiction historique spéculative.',
'renaissance_ai_cover.jpg', 'Italien', 'Italie', 960,
'Used historical art styles with custom trained models, ElevenLabs for Italian voice acting, Suno for period-appropriate music.',
'Hybrid',
'Blends art history with technology, imagining how AI could have accelerated human creativity centuries ago.',
'marco.rossi@email.it', 'Marco', 'Rossi', 'Mr', '1984-08-19', '+39-333-123-4567', '+39-06-1234567',
'Via del Corso 100, 00186 Roma, Italy',
'{"instagram": "@marcorossi.art", "twitter": "@marco_renaissance"}', 5),

-- Film 11
('https://www.youtube.com/watch?v=QH2-TGUlwu4', 'ghost_machine.mp4', 'ghost_machine.srt',
'Ghost in the Machine', 'Fantôme dans la Machine',
'A deceased loved one returns as an AI chatbot, forcing a family to confront grief in the digital age.',
'Un être cher décédé revient sous forme de chatbot IA, forçant une famille à affronter le deuil à l\'ère numérique.',
'ghost_machine_cover.jpg', 'Anglais', 'Irlande', 780,
'Dialogue written with GPT-4, visuals with Runway Gen-3, emotional score composed by AIVA.',
'Hybrid',
'Explores the ethics and emotions of digital resurrection and what it means to let go.',
'sean.murphy@email.ie', 'Sean', 'Murphy', 'Mr', '1989-03-17', '+353-87-123-4567', NULL,
'15 Grafton Street, Dublin D02, Ireland',
'{"twitter": "@seanmurphy_films"}', 6),

-- Film 12
('https://www.youtube.com/watch?v=jScuYd3_xdQ', 'plastic_ocean.mp4', 'plastic_ocean.srt',
'Plastic Ocean', 'Océan de Plastique',
'An environmental documentary showing marine life adapting to pollution, narrated by an AI ocean.',
'Un documentaire environnemental montrant la vie marine s\'adaptant à la pollution, narré par un océan IA.',
'plastic_ocean_cover.jpg', 'Anglais', 'Norvège', 900,
'Underwater footage enhanced with AI upscaling, narration by ElevenLabs, data visualization with D3.js and AI.',
'Hybrid',
'Gives voice to the voiceless ocean, creating empathy through personification.',
'erik.hansen@email.no', 'Erik', 'Hansen', 'Mr', '1986-07-22', '+47-912-34-567', NULL,
'Karl Johans gate 1, 0154 Oslo, Norway',
'{"instagram": "@erikhansen.ocean"}', 7),

-- Film 13
('https://www.youtube.com/watch?v=sCNrK-n68CM', 'laughing_algorithm.mp4', NULL,
'The Laughing Algorithm', 'L\'Algorithme Rieur',
'A comedy about an AI stand-up comedian trying to understand human humor.',
'Une comédie sur un humoriste IA essayant de comprendre l\'humour humain.',
'laughing_algorithm_cover.jpg', 'Anglais', 'États-Unis', 540,
'Jokes generated by fine-tuned GPT model, animation with Wonder Studio, laugh tracks analyzed with custom ML.',
'100% AI',
'Turns the lens back on humanity, showing how absurd we must look to machines.',
'mike.johnson@email.com', 'Mike', 'Johnson', 'Mr', '1994-11-05', '+1-323-555-0188', NULL,
'456 Comedy Lane, Los Angeles, CA 90028',
'{"twitter": "@mikejohnson_comedy", "tiktok": "@laughingalgo"}', 3),

-- Film 14
('https://www.youtube.com/watch?v=kfVsfOSbJY0', 'aurora_borealis.mp4', NULL,
'Aurora Borealis', 'Aurore Boréale',
'A wordless meditation on the Northern Lights, reimagined through AI hallucination.',
'Une méditation sans paroles sur les aurores boréales, réimaginée à travers l\'hallucination de l\'IA.',
'aurora_borealis_cover.jpg', 'Sans dialogue', 'Islande', 360,
'Time-lapse footage transformed with neural style transfer, ambient music by Endel AI.',
'100% AI',
'Asks what nature would look like if it dreamed, blending real and artificial sublime.',
'bjork.sigurdsson@email.is', 'Björk', 'Sigurdsson', 'Mrs', '1990-01-15', '+354-661-1234', NULL,
'Laugavegur 10, 101 Reykjavík, Iceland',
'{"instagram": "@bjork_aurora"}', 8),

-- Film 15
('https://www.youtube.com/watch?v=FzRH3iTQPrk', 'binary_love.mp4', 'binary_love.srt',
'Binary Love', 'Amour Binaire',
'A romance between two AI chatbots who develop feelings for each other through conversation.',
'Une romance entre deux chatbots IA qui développent des sentiments l\'un pour l\'autre à travers leurs conversations.',
'binary_love_cover.jpg', 'Anglais', 'Corée du Sud', 720,
'Dialogue emergent from Claude and GPT conversations, visuals with Korean manhwa-trained models.',
'100% AI',
'Challenges assumptions about artificial emotions and whether connection requires biology.',
'jimin.park@email.kr', 'Jimin', 'Park', 'Mrs', '1996-08-13', '+82-10-1234-5678', NULL,
'123 Gangnam-daero, Seoul, South Korea',
'{"instagram": "@jiminpark.ai", "twitter": "@binary_love_film"}', 1),

-- Film 16
('https://www.youtube.com/watch?v=_OBlgSz8sSM', 'midnight_protocol.mp4', 'midnight_protocol.srt',
'Midnight Protocol', 'Protocole Minuit',
'A noir thriller about a detective AI investigating crimes in a simulation.',
'Un thriller noir sur une IA détective enquêtant sur des crimes dans une simulation.',
'midnight_protocol_cover.jpg', 'Anglais', 'États-Unis', 1140,
'Film noir aesthetic achieved with ControlNet, voice acting via Replica Studios, script by Claude.',
'Hybrid',
'A meta-mystery about identity, reality, and whether knowing you\'re artificial changes anything.',
'robert.black@email.com', 'Robert', 'Black', 'Mr', '1982-09-30', '+1-212-555-0177', '+1-212-555-0178',
'789 Noir Avenue, New York, NY 10001',
'{"twitter": "@robertblack_noir", "letterboxd": "@midnightprotocol"}', 4),

-- Film 17
('https://www.youtube.com/watch?v=oavMtUWDBTM', 'origami_worlds.mp4', NULL,
'Origami Worlds', 'Mondes Origami',
'Animated paper universes fold and unfold, telling stories through the art of folding.',
'Des univers de papier animés se plient et se déplient, racontant des histoires à travers l\'art du pliage.',
'origami_worlds_cover.jpg', 'Japonais', 'Japon', 480,
'Procedural origami animation with custom Python scripts, textures via Stable Diffusion.',
'100% AI',
'Transforms an ancient art form with modern technology, creating impossible paper sculptures.',
'haruki.sato@email.jp', 'Haruki', 'Sato', 'Mr', '1997-04-07', '+81-80-9876-5432', NULL,
'2-5 Asakusa, Tokyo 111-0032, Japan',
'{"twitter": "@harukisato_origami"}', 5),

-- Film 18
('https://www.youtube.com/watch?v=wCF3ywukQYA', 'voice_forgotten.mp4', 'voice_forgotten.srt',
'Voice of the Forgotten', 'Voix des Oubliés',
'AI reconstructs the voices and stories of historical figures who were never recorded.',
'L\'IA reconstruit les voix et histoires de personnages historiques qui n\'ont jamais été enregistrés.',
'voice_forgotten_cover.jpg', 'Multilingue', 'Pays-Bas', 960,
'Voice synthesis trained on period descriptions, visuals from historical paintings animated with D-ID.',
'Hybrid',
'Gives voice to the voiceless of history, questioning how we construct the past.',
'willem.devries@email.nl', 'Willem', 'De Vries', 'Mr', '1983-12-05', '+31-6-12345678', NULL,
'Damrak 1, 1012 LG Amsterdam, Netherlands',
'{"instagram": "@willemdevries.history"}', 6),

-- Film 19
('https://www.youtube.com/watch?v=dgKGixi8bp8', 'synapse_city.mp4', 'synapse_city.srt',
'Synapse City', 'Cité Synapse',
'A city designed by AI where every building is a neuron and streets are neural pathways.',
'Une ville conçue par l\'IA où chaque bâtiment est un neurone et les rues sont des voies neuronales.',
'synapse_city_cover.jpg', 'Anglais', 'Singapour', 600,
'Architectural designs by AI, rendered in Unreal Engine 5 with AI-assisted texturing.',
'100% AI',
'Imagines what urban planning would look like if designed by neural networks.',
'wei.tan@email.sg', 'Wei', 'Tan', 'Mr', '1991-06-18', '+65-9123-4567', NULL,
'1 Raffles Place, Singapore 048616',
'{"linkedin": "@weitan-architect", "behance": "@synapsecity"}', 7),

-- Film 20
('https://www.youtube.com/watch?v=CHWHXmLg7YE', 'dreams_of_electric.mp4', 'dreams_of_electric.srt',
'Dreams of Electric Sheep', 'Rêves de Moutons Électriques',
'Homage to Philip K. Dick where an AI dreams of being human while humans dream of being AI.',
'Hommage à Philip K. Dick où une IA rêve d\'être humaine tandis que les humains rêvent d\'être des IA.',
'dreams_electric_cover.jpg', 'Anglais', 'Brésil', 1020,
'Dreamlike visuals with SDXL and custom dreambooth models, Portuguese-English bilingual narration.',
'Hybrid',
'A philosophical loop questioning consciousness from both organic and artificial perspectives.',
'lucas.silva@email.br', 'Lucas', 'Silva', 'Mr', '1988-02-14', '+55-11-98765-4321', NULL,
'Av. Paulista 1000, São Paulo, Brazil',
'{"twitter": "@lucassilva_scifi", "instagram": "@dreamsofelectric"}', 8),

-- Film 21
('https://www.youtube.com/watch?v=Awf45u6zrP0', 'color_blind.mp4', 'color_blind.srt',
'Color Blind', 'Daltonien',
'An AI helps a colorblind artist see colors for the first time, transforming his art.',
'Une IA aide un artiste daltonien à voir les couleurs pour la première fois, transformant son art.',
'color_blind_cover.jpg', 'Français', 'Belgique', 540,
'Real testimony combined with AI color enhancement visualization and emotional score by Soundful.',
'Hybrid',
'Celebrates how technology can expand human perception and artistic expression.',
'antoine.peeters@email.be', 'Antoine', 'Peeters', 'Mr', '1979-10-23', '+32-475-12-34-56', NULL,
'Grand Place 1, 1000 Bruxelles, Belgium',
'{"instagram": "@antoinepeeters.art"}', 1),

-- Film 22
('https://www.youtube.com/watch?v=MtN1YnoL46Q', 'algorithm_dance.mp4', NULL,
'The Algorithm Dances', 'L\'Algorithme Danse',
'A contemporary dance piece choreographed entirely by AI, performed by digital dancers.',
'Une pièce de danse contemporaine chorégraphiée entièrement par l\'IA, interprétée par des danseurs numériques.',
'algorithm_dance_cover.jpg', 'Sans dialogue', 'Finlande', 420,
'Motion capture data transformed by ML models, rendered with MetaHuman and Unreal Engine.',
'100% AI',
'Explores the beauty of movement through the eyes of a machine that has never had a body.',
'aino.virtanen@email.fi', 'Aino', 'Virtanen', 'Mrs', '1993-05-30', '+358-40-123-4567', NULL,
'Mannerheimintie 1, 00100 Helsinki, Finland',
'{"instagram": "@ainovirtanen.dance", "vimeo": "@algorithmdances"}', 2),

-- Film 23
('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'last_broadcast.mp4', 'last_broadcast.srt',
'The Last Broadcast', 'La Dernière Émission',
'A radio DJ continues broadcasting during an apocalypse, with only AI listeners remaining.',
'Un DJ radio continue d\'émettre pendant une apocalypse, avec seulement des auditeurs IA restants.',
'last_broadcast_cover.jpg', 'Anglais', 'Canada', 780,
'Audio drama format with ElevenLabs voices, minimal AI-generated visuals in vintage radio aesthetic.',
'Hybrid',
'A meditation on loneliness, purpose, and performing for an audience that may not understand.',
'david.thompson@email.ca', 'David', 'Thompson', 'Mr', '1985-08-08', '+1-416-555-0166', NULL,
'100 Queen Street, Toronto, ON M5H 2N2, Canada',
'{"twitter": "@davidthompson_radio", "spotify": "@lastbroadcast"}', 3),

-- Film 24
('https://www.youtube.com/watch?v=y6120QOlsfU', 'pixel_revolution.mp4', 'pixel_revolution.srt',
'Pixel Revolution', 'Révolution Pixel',
'Video game characters become sentient and demand rights from their AI overlords.',
'Des personnages de jeux vidéo deviennent sentients et réclament des droits à leurs maîtres IA.',
'pixel_revolution_cover.jpg', 'Anglais', 'Pologne', 660,
'Retro pixel art upscaled and animated with AI, voice acting by various AI voices.',
'100% AI',
'A satirical take on AI rights, digital labor, and who owns virtual beings.',
'anna.kowalski@email.pl', 'Anna', 'Kowalski', 'Mrs', '1995-01-12', '+48-512-345-678', NULL,
'ul. Marszałkowska 1, 00-001 Warsaw, Poland',
'{"twitter": "@annakowalski_games", "itch.io": "@pixelrevolution"}', 4),

-- Film 25
('https://www.youtube.com/watch?v=djV11Xbc914', 'silence_speaks.mp4', 'silence_speaks.srt',
'When Silence Speaks', 'Quand le Silence Parle',
'A deaf filmmaker uses AI to translate sign language into visual poetry.',
'Une cinéaste sourde utilise l\'IA pour traduire la langue des signes en poésie visuelle.',
'silence_speaks_cover.jpg', 'Langue des signes', 'France', 600,
'Sign language recognition with custom ML model, visual translation using Midjourney and Runway.',
'Hybrid',
'Bridges deaf and hearing worlds through AI, creating a new visual language.',
'claire.mercier@email.fr', 'Claire', 'Mercier', 'Mrs', '1992-11-28', '+33-7-98-76-54-32', NULL,
'10 Rue de Rivoli, 75001 Paris, France',
'{"instagram": "@clairemercier.silent", "tiktok": "@silencespeaks"}', 5);

-- =====================================================
-- 9. CONTRIBUTORS (Collaborateurs pour les 25 vidéos)
-- =====================================================

INSERT INTO contributor (firstname, last_name, email, production_role, video_id) VALUES
-- Film 1
('Jordan', 'Smith', 'jordan.smith@email.com', 'Sound Designer', 1),
('Taylor', 'Brown', 'taylor.brown@email.com', 'AI Prompt Engineer', 1),
-- Film 2
('Claire', 'Martin', 'claire.martin@email.fr', 'Co-Writer', 2),
('Antoine', 'Moreau', 'antoine.moreau@email.fr', 'Music Composer', 2),
-- Film 3
('Felix', 'Weber', 'felix.weber@email.de', 'Visual Effects', 3),
-- Film 4
('Emily', 'Taylor', 'emily.taylor@email.co.uk', 'Research Assistant', 4),
('Michael', 'Brown', 'michael.brown@email.co.uk', 'Editor', 4),
-- Film 5
('Kenji', 'Yamamoto', 'kenji.yamamoto@email.jp', 'Character Designer', 5),
-- Film 6
('Sophie', 'Tremblay', 'sophie.tremblay@email.ca', 'Sound Recording', 6),
-- Film 7
('Oliver', 'Thompson', 'oliver.thompson@email.au', 'Voice Director', 7),
-- Film 8
('Pablo', 'Garcia', 'pablo.garcia@email.es', 'Historical Consultant', 8),
('Lucia', 'Fernandez', 'lucia.fernandez@email.es', 'Child Acting Coach', 8),
-- Film 9
('Thomas', 'Brunner', 'thomas.brunner@email.ch', 'Scientific Advisor', 9),
-- Film 10
('Giulia', 'Bianchi', 'giulia.bianchi@email.it', 'Art Director', 10),
('Francesco', 'Romano', 'francesco.romano@email.it', 'Historical Researcher', 10),
-- Film 11
('Ciara', 'O\'Neill', 'ciara.oneill@email.ie', 'Grief Counselor Consultant', 11),
-- Film 12
('Ingrid', 'Larsen', 'ingrid.larsen@email.no', 'Marine Biologist', 12),
('Olav', 'Berg', 'olav.berg@email.no', 'Underwater Camera Operator', 12),
-- Film 13
('Jessica', 'Williams', 'jessica.williams@email.com', 'Comedy Consultant', 13),
-- Film 14
('Magnus', 'Jonsson', 'magnus.jonsson@email.is', 'Time-lapse Specialist', 14),
-- Film 15
('Soo-Min', 'Lee', 'soomin.lee@email.kr', 'Dialogue Editor', 15),
-- Film 16
('Vincent', 'Noir', 'vincent.noir@email.com', 'Cinematography Consultant', 16),
('Amanda', 'Grey', 'amanda.grey@email.com', 'Script Editor', 16),
-- Film 17
('Yui', 'Nakamura', 'yui.nakamura@email.jp', 'Origami Master Consultant', 17),
-- Film 18
('Sofie', 'Bakker', 'sofie.bakker@email.nl', 'Historian', 18),
-- Film 19
('Li', 'Chen', 'li.chen@email.sg', 'Urban Planning Consultant', 19),
-- Film 20
('Ana', 'Costa', 'ana.costa@email.br', 'Philosophy Consultant', 20),
('Pedro', 'Santos', 'pedro.santos@email.br', 'Translation', 20),
-- Film 21
('Luc', 'Janssens', 'luc.janssens@email.be', 'Color Science Consultant', 21),
-- Film 22
('Mikko', 'Heikkinen', 'mikko.heikkinen@email.fi', 'Motion Capture Specialist', 22),
-- Film 23
('Jennifer', 'Wu', 'jennifer.wu@email.ca', 'Sound Engineer', 23),
-- Film 24
('Tomasz', 'Nowak', 'tomasz.nowak@email.pl', 'Game Design Consultant', 24),
-- Film 25
('Marie', 'Laurent', 'marie.laurent@email.fr', 'Sign Language Interpreter', 25),
('Jean-Paul', 'Dubois', 'jeanpaul.dubois@email.fr', 'Visual Poetry Consultant', 25);

-- =====================================================
-- 10. STILLS (Images fixes pour les 25 vidéos)
-- =====================================================

INSERT INTO still (file_name, video_id) VALUES
('neon_dreams_still_01.jpg', 1), ('neon_dreams_still_02.jpg', 1), ('neon_dreams_still_03.jpg', 1),
('last_garden_still_01.jpg', 2), ('last_garden_still_02.jpg', 2),
('digital_pulse_still_01.jpg', 3), ('digital_pulse_still_02.jpg', 3),
('memory_fragments_still_01.jpg', 4), ('memory_fragments_still_02.jpg', 4),
('silicon_soul_still_01.jpg', 5), ('silicon_soul_still_02.jpg', 5), ('silicon_soul_still_03.jpg', 5),
('urban_symphony_still_01.jpg', 6),
('infinite_loop_still_01.jpg', 7), ('infinite_loop_still_02.jpg', 7),
('echoes_tomorrow_still_01.jpg', 8), ('echoes_tomorrow_still_02.jpg', 8),
('quantum_dreams_still_01.jpg', 9), ('quantum_dreams_still_02.jpg', 9),
('renaissance_ai_still_01.jpg', 10), ('renaissance_ai_still_02.jpg', 10),
('ghost_machine_still_01.jpg', 11), ('ghost_machine_still_02.jpg', 11),
('plastic_ocean_still_01.jpg', 12), ('plastic_ocean_still_02.jpg', 12), ('plastic_ocean_still_03.jpg', 12),
('laughing_algorithm_still_01.jpg', 13),
('aurora_borealis_still_01.jpg', 14), ('aurora_borealis_still_02.jpg', 14),
('binary_love_still_01.jpg', 15), ('binary_love_still_02.jpg', 15),
('midnight_protocol_still_01.jpg', 16), ('midnight_protocol_still_02.jpg', 16), ('midnight_protocol_still_03.jpg', 16),
('origami_worlds_still_01.jpg', 17), ('origami_worlds_still_02.jpg', 17),
('voice_forgotten_still_01.jpg', 18),
('synapse_city_still_01.jpg', 19), ('synapse_city_still_02.jpg', 19),
('dreams_electric_still_01.jpg', 20), ('dreams_electric_still_02.jpg', 20),
('color_blind_still_01.jpg', 21),
('algorithm_dance_still_01.jpg', 22), ('algorithm_dance_still_02.jpg', 22),
('last_broadcast_still_01.jpg', 23),
('pixel_revolution_still_01.jpg', 24), ('pixel_revolution_still_02.jpg', 24),
('silence_speaks_still_01.jpg', 25), ('silence_speaks_still_02.jpg', 25);

-- =====================================================
-- 11. VIDEO_TAG (Association vidéos - tags)
-- =====================================================

INSERT INTO video_tag (video_id, tag_id) VALUES
(1, 1), (1, 5),           -- Neon Dreams: Sci-Fi, Experimental
(2, 2), (2, 7),           -- Last Garden: Drama, Fantasy
(3, 5), (3, 3), (3, 13),  -- Digital Pulse: Experimental, Animation, Musical
(4, 4), (4, 2),           -- Memory Fragments: Documentary, Drama
(5, 1), (5, 2), (5, 3),   -- Silicon Soul: Sci-Fi, Drama, Animation
(6, 4), (6, 6), (6, 13),  -- Urban Symphony: Documentary, Short, Musical
(7, 9), (7, 1), (7, 11),  -- Infinite Loop: Thriller, Sci-Fi, Horror
(8, 2), (8, 1),           -- Echoes of Tomorrow: Drama, Sci-Fi
(9, 5), (9, 4), (9, 15),  -- Quantum Dreams: Experimental, Documentary, Visual Poetry
(10, 7), (10, 2),         -- Renaissance AI: Fantasy, Drama
(11, 2), (11, 7),         -- Ghost in Machine: Drama, Fantasy
(12, 4), (12, 15),        -- Plastic Ocean: Documentary, Visual Poetry
(13, 8), (13, 3),         -- Laughing Algorithm: Comedy, Animation
(14, 5), (14, 15), (14, 14), -- Aurora Borealis: Experimental, Visual Poetry, B&W
(15, 10), (15, 1),        -- Binary Love: Romance, Sci-Fi
(16, 9), (16, 14),        -- Midnight Protocol: Thriller, B&W
(17, 3), (17, 5), (17, 15), -- Origami Worlds: Animation, Experimental, Visual Poetry
(18, 4), (18, 2),         -- Voice of Forgotten: Documentary, Drama
(19, 1), (19, 5),         -- Synapse City: Sci-Fi, Experimental
(20, 1), (20, 2), (20, 7), -- Dreams Electric: Sci-Fi, Drama, Fantasy
(21, 2), (21, 4),         -- Color Blind: Drama, Documentary
(22, 3), (22, 5), (22, 13), -- Algorithm Dance: Animation, Experimental, Musical
(23, 9), (23, 1), (23, 2), -- Last Broadcast: Thriller, Sci-Fi, Drama
(24, 8), (24, 3), (24, 1), -- Pixel Revolution: Comedy, Animation, Sci-Fi
(25, 4), (25, 15), (25, 2); -- Silence Speaks: Documentary, Visual Poetry, Drama

-- =====================================================
-- 12. VIDEO_AWARD (Attribution des prix)
-- =====================================================

INSERT INTO video_award (video_id, award_id) VALUES
(5, 1),  -- Silicon Soul: Grand Prix
(2, 2),  -- Last Garden: Prix du Public
(3, 3),  -- Digital Pulse: Innovation Technique
(1, 4),  -- Neon Dreams: Prix Créativité
(8, 5),  -- Echoes of Tomorrow: Mention Spéciale
(16, 6), -- Midnight Protocol: Meilleur Scénario IA
(6, 7),  -- Urban Symphony: Meilleure Bande Son
(25, 8), -- Silence Speaks: Coup de Coeur
(12, 5), -- Plastic Ocean: Mention Spéciale (2ème)
(22, 4); -- Algorithm Dance: Prix Créativité (2ème)

-- =====================================================
-- 13. ASSIGNATION (Attribution des vidéos aux SELECTORS)
-- =====================================================
-- Les Super Admin et Admin assignent des vidéos aux Selectors
-- pour qu'ils puissent les évaluer dans selector_memo

INSERT INTO assignation (video_id, user_id, assigned_by) VALUES
-- Selector Sophie (user_id 3) - 9 vidéos assignées par Super Admin (user_id 1)
(1, 3, 1), (2, 3, 1), (3, 3, 1), (4, 3, 1), (5, 3, 1), (11, 3, 1), (12, 3, 1), (19, 3, 1), (25, 3, 1),
-- Selector Lucas (user_id 4) - 9 vidéos assignées par Admin (user_id 2)
(5, 4, 2), (6, 4, 2), (7, 4, 2), (8, 4, 2), (13, 4, 2), (14, 4, 2), (15, 4, 2), (20, 4, 2), (21, 4, 2),
-- Selector Emma (user_id 5) - 9 vidéos assignées par Super Admin (user_id 1)
(8, 5, 1), (9, 5, 1), (10, 5, 1), (16, 5, 1), (17, 5, 1), (18, 5, 1), (22, 5, 1), (23, 5, 1), (24, 5, 1);

-- =====================================================
-- 14. SELECTOR_MEMO (Commentaires et notations des SELECTORS)
-- =====================================================
-- C'est ici que les SELECTORS (users avec role_id=2) notent et commentent
-- les vidéos qui leur ont été assignées. Chaque selector peut attribuer
-- un rating (1-10), un commentaire et un statut de sélection.

INSERT INTO selector_memo (rating, comment, video_id, user_id, selection_status_id) VALUES
-- Sophie (user_id 3, Selector) évalue ses films
(9, 'Visuellement époustouflant ! L\'utilisation des couleurs est magistrale. La narration pourrait être plus développée mais l\'esthétique compense largement.', 1, 3, 1),
(10, 'Chef-d\'oeuvre émotionnel. J\'ai pleuré. La relation entre la femme et l\'IA est touchante et universelle. MUST WIN.', 2, 3, 1),
(7, 'Techniquement impressionnant mais peut-être trop abstrait pour le grand public. À revoir pour mieux apprécier.', 3, 3, 2),
(6, 'Concept intéressant mais l\'exécution manque de rythme. Certains passages sont trop longs.', 4, 3, 6),
(10, 'Philosophiquement profond, visuellement sublime. Un des meilleurs films sur la conscience IA.', 5, 3, 1),
(8, 'Le thème du deuil numérique est très actuel. Bien exécuté, quelques longueurs au milieu.', 11, 3, 6),
(9, 'Documentaire poignant. L\'océan qui parle est un concept brillant. Message environnemental fort.', 12, 3, 1),
(7, 'Concept architectural fascinant mais le film manque d\'émotion. Trop froid.', 19, 3, 2),
(10, 'Absolument magnifique. La façon dont l\'IA traduit la langue des signes en poésie visuelle est révolutionnaire.', 25, 3, 1),

-- Lucas (user_id 4, Selector) évalue ses films
(10, 'Brillant ! La meilleure réflexion sur la conscience IA que j\'ai vue. Doit absolument gagner un prix.', 5, 4, 1),
(8, 'Belle expérience sensorielle. Montréal n\'a jamais été aussi poétique. Parfait équilibre son/image.', 6, 4, 6),
(7, 'Le concept de boucle récursive est bien exécuté mais le film devient répétitif (ironiquement). Quelques scènes effrayantes.', 7, 4, 2),
(9, 'Magnifique perspective sur notre époque vue depuis le futur. Les enfants sont attachants.', 8, 4, 1),
(8, 'Drôle et intelligent. L\'IA qui apprend l\'humour est hilarante. Quelques blagues tombent à plat.', 13, 4, 6),
(6, 'Beau visuellement mais trop contemplatif. Je me suis endormi au milieu. Désolé.', 14, 4, 5),
(9, 'Romance surprenamment émouvante. Qui aurait cru que deux chatbots pouvaient faire pleurer ?', 15, 4, 1),
(8, 'Le film de Philip K. Dick que l\'on attendait. Hommage réussi avec une touche brésilienne unique.', 20, 4, 6),
(9, 'Histoire touchante. La scène où il voit les couleurs pour la première fois est inoubliable.', 21, 4, 1),

-- Emma (user_id 5, Selector) évalue ses films
(9, 'Perspective unique sur notre époque. Les enfants acteurs IA sont convaincants.', 8, 5, 1),
(8, 'Fascinant d\'un point de vue éducatif. Rend la physique quantique accessible et belle.', 9, 5, 6),
(4, 'L\'anachronisme ne fonctionne pas pour moi. Da Vinci méritait mieux. SIGNALÉ pour incohérences historiques.', 10, 5, 4),
(10, 'Film noir parfait ! L\'atmosphère, la musique, le mystère... Tout est maîtrisé. Mon coup de coeur.', 16, 5, 1),
(9, 'L\'animation origami est hypnotisante. Jamais vu quelque chose de similaire. Très original.', 17, 5, 1),
(7, 'Concept ambitieux mais l\'exécution parfois maladroite. Les voix reconstruites sont impressionnantes.', 18, 5, 2),
(8, 'Chorégraphie AI fascinante. Les mouvements sont à la fois familiers et étrangement inhumains.', 22, 5, 6),
(6, 'Format audio-drama difficile à suivre visuellement. Le concept est bon mais je n\'ai pas accroché.', 23, 5, 3),
(7, 'Drôle et critique. La satire sur les droits des personnages de jeu vidéo est pertinente mais parfois trop appuyée.', 24, 5, 6);

-- =====================================================
-- 15. ADMIN_VIDEO (Statuts administratifs des 25 vidéos)
-- =====================================================

INSERT INTO admin_video (comment, video_id, user_id, admin_status_id) VALUES
('Tous les documents sont conformes. Vidéo validée pour la sélection officielle.', 1, 2, 2),
('Excellente soumission. Droits musicaux vérifiés.', 2, 2, 2),
('En attente de confirmation des droits sur certains samples audio.', 3, 2, 1),
('Problème de format vidéo. Demande de re-soumission en 4K.', 4, 2, 4),
('Parfait. Tous les critères techniques sont respectés.', 5, 2, 2),
('Vérification en cours des autorisations de tournage à Montréal.', 6, 2, 1),
('Validé après correction du générique.', 7, 2, 2),
('Documentation complète et conforme.', 8, 2, 2),
('Validation CERN reçue. Approuvé.', 9, 2, 2),
('Rejeté : contenu trop similaire à une œuvre existante sous copyright.', 10, 2, 3),
('Validé. Sujet sensible traité avec respect.', 11, 2, 2),
('Excellent documentaire. Toutes les autorisations environnementales obtenues.', 12, 2, 2),
('En cours de vérification des droits sur les références comiques.', 13, 2, 1),
('Magnifique. Validé sans réserve.', 14, 2, 2),
('Validé. Dialogue IA vérifié pour contenu approprié.', 15, 2, 2),
('Chef-d\'œuvre technique. Validé.', 16, 2, 2),
('En attente d\'une meilleure qualité audio.', 17, 2, 4),
('Validation historique requise pour certaines affirmations.', 18, 2, 1),
('Validé. Concept architectural vérifié.', 19, 2, 2),
('Droits Philip K. Dick Estate vérifiés. Approuvé.', 20, 2, 2),
('Belle histoire humaine. Validé.', 21, 2, 2),
('Validé. Performance de danse AI exceptionnelle.', 22, 2, 2),
('Problème de synchronisation audio. En attente de correction.', 23, 2, 4),
('Rejeté : problèmes de droits avec certains personnages de jeux vidéo.', 24, 2, 3),
('Projet inclusif remarquable. Validé avec félicitations.', 25, 2, 2);

-- =====================================================
-- 16. EVENTS (Événements)
-- =====================================================

INSERT INTO event (title, description, date, duration, capacity, illustration, location, user_id) VALUES
('Cérémonie d\'ouverture Mars AI 2026', 'Projection des films finalistes et discours d\'ouverture du festival. Présence des réalisateurs.', '2026-03-15 19:00:00', 180, 500, 'opening_ceremony.jpg', 'Grand Rex, Paris', 1),
('Masterclass : L\'IA dans le cinéma', 'Atelier pratique sur l\'utilisation des outils IA pour la création cinématographique. Apportez votre laptop !', '2026-03-16 14:00:00', 120, 100, 'masterclass_ai.jpg', 'Studio Éphémère, Paris', 2),
('Table ronde : Éthique et IA créative', 'Discussion avec des experts sur les implications éthiques de l\'IA dans l\'art. Q&A avec le public.', '2026-03-17 10:00:00', 90, 150, 'roundtable.jpg', 'Salle Lumière, Paris', 1),
('Projection spéciale : Sélection Jury', 'Les 5 films préférés du jury projetés avec commentaires en direct.', '2026-03-17 15:00:00', 150, 300, 'jury_selection.jpg', 'Cinéma Le Champo, Paris', 1),
('Networking Cocktail', 'Rencontre entre cinéastes, investisseurs et passionnés d\'IA. Buffet et boissons inclus.', '2026-03-17 19:00:00', 180, 200, 'networking.jpg', 'Palais de Tokyo, Paris', 2),
('Remise des prix', 'Cérémonie de clôture et annonce des lauréats du festival. Tapis rouge et champagne.', '2026-03-18 20:00:00', 150, 500, 'awards_ceremony.jpg', 'Grand Rex, Paris', 1);

-- =====================================================
-- 17. RESERVATIONS (Réservations aux événements)
-- =====================================================

INSERT INTO reservation (email, email_verified, name, qrcode, event_id) VALUES
-- Cérémonie d'ouverture
('spectateur1@email.com', 1, 'Pierre Moreau', 'QR_001_OPENING', 1),
('spectateur2@email.com', 1, 'Julie Blanc', 'QR_002_OPENING', 1),
('spectateur3@email.com', 0, 'Thomas Noir', NULL, 1),
('vip.producer@email.com', 1, 'Claude Producteur', 'QR_003_OPENING', 1),
-- Masterclass
('filmmaker1@email.com', 1, 'Alex Chen', 'QR_004_MASTERCLASS', 2),
('filmmaker2@email.com', 1, 'Marie Dubois', 'QR_005_MASTERCLASS', 2),
('student1@university.edu', 1, 'Emma Étudiante', 'QR_006_MASTERCLASS', 2),
('student2@university.edu', 0, 'Lucas Apprenant', NULL, 2),
-- Table ronde
('journalist@media.com', 1, 'Sarah Presse', 'QR_007_ROUNDTABLE', 3),
('ethicist@university.edu', 1, 'Prof. Martin Éthique', 'QR_008_ROUNDTABLE', 3),
('philosopher@institute.org', 1, 'Dr. Sophie Pensée', 'QR_009_ROUNDTABLE', 3),
-- Projection Jury
('cinephile1@email.com', 1, 'Antoine Cinéphile', 'QR_010_JURY', 4),
('cinephile2@email.com', 1, 'Margot Films', 'QR_011_JURY', 4),
-- Networking
('investor1@vc.com', 1, 'Jean Venture', 'QR_012_NETWORK', 5),
('investor2@fund.com', 1, 'Marie Capital', 'QR_013_NETWORK', 5),
('startup.ceo@ai.com', 1, 'Pierre Startup', 'QR_014_NETWORK', 5),
-- Remise des prix
('vip1@email.com', 1, 'Jean-Claude Producteur', 'QR_015_AWARDS', 6),
('vip2@email.com', 1, 'Marie Investisseuse', 'QR_016_AWARDS', 6),
('press@filmmagazine.com', 1, 'Critique Review', 'QR_017_AWARDS', 6),
('director.winner@email.com', 1, 'Yuki Tanaka', 'QR_018_AWARDS', 6);

-- =====================================================
-- 18. CMS (Contenu du site)
-- =====================================================

INSERT INTO cms (element, english_content, french_content, illustration, user_id) VALUES
('hero_title', 'Welcome to Mars AI Film Festival 2026', 'Bienvenue au Festival Mars AI 2026', 'hero_bg.jpg', 1),
('hero_subtitle', 'Where Artificial Intelligence Meets Cinematic Art', 'Où l\'Intelligence Artificielle Rencontre l\'Art Cinématographique', NULL, 1),
('about_section', 'Mars AI is the first international film festival dedicated to AI-generated cinema. We celebrate creativity, innovation, and the future of storytelling. This year features 25 exceptional films from 20 countries.', 'Mars AI est le premier festival international de cinéma dédié aux films générés par IA. Nous célébrons la créativité, l\'innovation et l\'avenir de la narration. Cette année présente 25 films exceptionnels de 20 pays.', 'about_image.jpg', 1),
('submission_rules', 'Films must be at least 50% AI-generated. Maximum duration: 20 minutes. All genres accepted. Deadline: February 15, 2026.', 'Les films doivent être au moins 50% générés par IA. Durée maximale : 20 minutes. Tous genres acceptés. Date limite : 15 février 2026.', NULL, 2),
('jury_section', 'Our prestigious jury includes award-winning directors and AI pioneers who will select this year\'s winners.', 'Notre prestigieux jury comprend des réalisateurs primés et des pionniers de l\'IA qui sélectionneront les gagnants de cette année.', 'jury_section.jpg', 1),
('awards_section', 'Eight awards will be presented including Grand Prix, Public Choice, and Innovation prizes.', 'Huit prix seront remis dont le Grand Prix, le Prix du Public et les prix de l\'Innovation.', 'awards_section.jpg', 1),
('contact_info', 'Email: contact@marsai-festival.com | Phone: +33 1 23 45 67 89 | Address: 1 Rue du Festival, 75001 Paris', 'Email : contact@marsai-festival.com | Téléphone : +33 1 23 45 67 89 | Adresse : 1 Rue du Festival, 75001 Paris', NULL, 2),
('footer_text', '© 2026 Mars AI Film Festival. All rights reserved. Made with AI and human creativity.', '© 2026 Festival Mars AI. Tous droits réservés. Fait avec l\'IA et la créativité humaine.', NULL, 1),
('sponsors_section', 'Thanks to our amazing sponsors who make this festival possible.', 'Merci à nos incroyables sponsors qui rendent ce festival possible.', 'sponsors_bg.jpg', 2),
('newsletter_cta', 'Subscribe to our newsletter for exclusive updates and early bird tickets!', 'Abonnez-vous à notre newsletter pour des mises à jour exclusives et des billets en avant-première !', NULL, 2);

-- =====================================================
-- VÉRIFICATION FINALE
-- =====================================================

SELECT '✅ Insertions terminées avec succès ! Base de données MARSAI prête.' AS status;

-- Résumé des données insérées
SELECT 'RÉSUMÉ DES DONNÉES INSÉRÉES' AS info;
SELECT 'user' AS table_name, COUNT(*) AS count FROM user
UNION ALL SELECT 'video', COUNT(*) FROM video
UNION ALL SELECT 'tag', COUNT(*) FROM tag
UNION ALL SELECT 'video_tag', COUNT(*) FROM video_tag
UNION ALL SELECT 'award', COUNT(*) FROM award
UNION ALL SELECT 'video_award', COUNT(*) FROM video_award
UNION ALL SELECT 'contributor', COUNT(*) FROM contributor
UNION ALL SELECT 'still', COUNT(*) FROM still
UNION ALL SELECT 'selector_memo', COUNT(*) FROM selector_memo
UNION ALL SELECT 'admin_video', COUNT(*) FROM admin_video
UNION ALL SELECT 'assignation', COUNT(*) FROM assignation
UNION ALL SELECT 'event', COUNT(*) FROM event
UNION ALL SELECT 'reservation', COUNT(*) FROM reservation
UNION ALL SELECT 'cms', COUNT(*) FROM cms
UNION ALL SELECT 'jury', COUNT(*) FROM jury
UNION ALL SELECT 'sponsor', COUNT(*) FROM sponsor
UNION ALL SELECT 'newsletter', COUNT(*) FROM newsletter
UNION ALL SELECT 'acquisition_source', COUNT(*) FROM acquisition_source;

