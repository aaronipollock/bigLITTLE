-- Seed data for local development.
-- Run with: psql -d biglittle_dev -f db/seed.sql
-- Safe to re-run: does nothing if meditations already has rows.

INSERT INTO meditations (title, description, category, duration_seconds, audio_key)
SELECT * FROM (VALUES
    ('Mountains',    'Wind through high pines.',        'nature', 600, 'trees.mp3'),
    ('Rivers',       'Moving water over stone.',        'water',  600, 'river.mp3'),
    ('Sunset',       'Stillness under a single tree.',  'nature', 600, 'meditate-under-tree.mp3'),
    ('Beaches',      'Slow surf on an open shore.',     'water',  600, 'beach.mp3'),
    ('Starry Night', 'A clear night in the valley.',    'night',  600, 'yosemite-stars.mp3'),
    ('Waterfall',    'Steady falling water.',           'water',  600, 'waterfall.mp3')
) AS seed (title, description, category, duration_seconds, audio_key)
WHERE NOT EXISTS (SELECT 1 FROM meditations);
