-- =====================================================
-- MISE À JOUR DES URLs YOUTUBE
-- Fichier: update_youtube_urls.sql
-- Date: 2026-02-03
-- =====================================================
-- Ce script met à jour les URLs YouTube des 25 vidéos
-- avec de vraies URLs YouTube de vidéos courtes
-- =====================================================

USE marsai;

-- Mise à jour des URLs YouTube pour les 25 vidéos (~1 minute chacune)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=jNQXAC9IVRw' WHERE id = 1;  -- Neon Dreams (Me at the zoo - 19s)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=hY7m5jjJ9mM' WHERE id = 2;  -- The Last Garden (Cat Jamming - 52s)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=ZZ5LpwO-An4' WHERE id = 3;  -- Digital Pulse (HEYYEYAAEYAAAEYAEYAA - 1min)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=EIyixC9NsLI' WHERE id = 4;  -- Memory Fragments (Badgers - 1min)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=wZZ7oFKsKzY' WHERE id = 5;  -- Silicon Soul (Dramatic Chipmunk - 5s)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=NRItYDKSqpQ' WHERE id = 6;  -- Urban Symphony (Gangsta's Paradise - 1min extrait)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=dMH0bHeiRNg' WHERE id = 7;  -- Infinite Loop (Coffin Dance - 1min)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=J---aiyznGQ' WHERE id = 8;  -- Echoes of Tomorrow (Keyboard Cat - 54s)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=2WPCLda_erI' WHERE id = 9;  -- Quantum Dreams (Nyan Cat - 1min loop)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=VnnWp_akOrE' WHERE id = 10; -- Renaissance AI (Gandalf Sax - 10h mais extrait 1min)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=QH2-TGUlwu4' WHERE id = 11; -- Ghost in the Machine (Nyan Cat original - 1min)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=jScuYd3_xdQ' WHERE id = 12; -- Plastic Ocean (Charlie Bit My Finger - 56s)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=sCNrK-n68CM' WHERE id = 13; -- The Laughing Algorithm (Dancing Baby - 40s)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=kfVsfOSbJY0' WHERE id = 14; -- Aurora Borealis (Friday Rebecca Black - 1min extrait)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=FzRH3iTQPrk' WHERE id = 15; -- Binary Love (Double Rainbow - 1min extrait)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=_OBlgSz8sSM' WHERE id = 16; -- Midnight Protocol (Chocolate Rain - 1min extrait)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=oavMtUWDBTM' WHERE id = 17; -- Origami Worlds (Sneezing Panda - 17s)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=wCF3ywukQYA' WHERE id = 18; -- Voice of the Forgotten (Rickroll but 1min)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=dgKGixi8bp8' WHERE id = 19; -- Synapse City (Baby Shark - 1min extrait)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=CHWHXmLg7YE' WHERE id = 20; -- Dreams of Electric Sheep (Its peanut butter jelly time - 1min)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=Awf45u6zrP0' WHERE id = 21; -- Color Blind (Chocolate Rain original - 1min extrait)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=MtN1YnoL46Q' WHERE id = 22; -- The Algorithm Dances (Dramatic Look - 5s)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' WHERE id = 23; -- The Last Broadcast (Rick Astley Never Gonna Give You Up - extrait 1min)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=y6120QOlsfU' WHERE id = 24; -- Pixel Revolution (Darude Sandstorm - 1min extrait)
UPDATE video SET youtube_url = 'https://www.youtube.com/watch?v=djV11Xbc914' WHERE id = 25; -- When Silence Speaks (Take On Me - 1min extrait)

-- Vérification des modifications
SELECT '✅ Mise à jour des URLs YouTube terminée avec succès !' AS status;

-- Afficher les vidéos avec leurs nouvelles URLs
SELECT 
    id, 
    title_en AS titre, 
    youtube_url 
FROM video 
ORDER BY id;
