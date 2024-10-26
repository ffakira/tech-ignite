CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    price INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'started',
    start_date INTEGER NOT NULL,
    end_date INTEGER NOT NULL,
    created_at INTEGER DEFAULT (strftime ('%s', 'now')),
    updated_at INTEGER DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_title ON events (title);

CREATE INDEX IF NOT EXISTS idx_events_start_date ON events (start_date);

CREATE INDEX IF NOT EXISTS idx_events_end_date ON events (end_date);

DROP TRIGGER IF EXISTS validate_events_before_insert;

-- Trigger to validate the status value before inserting a new event
CREATE TRIGGER validate_events_before_insert
BEFORE INSERT ON events FOR EACH ROW
BEGIN
    SELECT CASE
        -- Validate events.title column
        WHEN LENGTH(NEW.title) < 3 OR LENGTH(NEW.title) > 255
        THEN RAISE(ABORT, 'error: events.title column length should be between 3 and 255 characters')

        -- Validate events.price column    
        WHEN NEW.price < 0
        THEN RAISE(ABORT, 'error: events.price must be a positive integer')

        -- Validate events.status column
        WHEN NEW.status NOT IN ('started', 'completed', 'paused')
        THEN RAISE(ABORT, 'error: events.status must be one of the following: started | completed | paused')

        -- Validate events.start_date column
        WHEN NEW.start_date < 0
        THEN RAISE(ABORT, 'error: events.start_date must be a positive integer')

        -- Validate events.end_date column
        WHEN NEW.end_date < 0
        THEN RAISE(ABORT, 'error: events.end_date must be a positive integer')

        -- Validate events.start_date < events.end_date columns
        WHEN NEW.start_date >= NEW.end_date
        THEN RAISE(ABORT, 'error: events.start_date should be less than events.end_date')
    END;
END;

DROP TRIGGER IF EXISTS validate_events_before_update;

-- Trigger to validate the status value before updating an event
CREATE TRIGGER validate_events_before_update
BEFORE UPDATE ON events FOR EACH ROW
BEGIN
    SELECT CASE
        -- Validate events.title column
        WHEN LENGTH(NEW.title) < 3 OR LENGTH(NEW.title) > 255
        THEN RAISE(ABORT, 'error: events.title column length should be between 3 and 255 characters')

        -- Validate events.price column    
        WHEN NEW.price < 0
        THEN RAISE(ABORT, 'error: events.price must be a positive integer')

        -- Validate events.status column
        WHEN NEW.status NOT IN ('started', 'completed', 'paused')
        THEN RAISE(ABORT, 'error: events.status must be one of the following: started | completed | paused')

        -- Validate events.start_date column
        WHEN NEW.start_date < 0
        THEN RAISE(ABORT, 'error: events.start_date must be a positive integer')

        -- Validate events.end_date column
        WHEN NEW.end_date < 0
        THEN RAISE(ABORT, 'error: events.end_date must be a positive integer')

        -- Validate events.start_date < events.end_date columns
        WHEN NEW.start_date >= NEW.end_date
        THEN RAISE(ABORT, 'error: events.start_date should be less than events.end_date')
    END;
END;