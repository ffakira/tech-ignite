package so.akira.events.repositories;

import org.jooq.DSLContext;
import org.jooq.exception.DataAccessException;
import org.jooq.exception.NoDataFoundException;
import org.springframework.stereotype.Repository;
import org.sqlite.SQLiteErrorCode;
import org.sqlite.SQLiteException;

import so.akira.events.exceptions.SQLConstraintViolationException;
import so.akira.events.models.EventModel;

import static so.akira.events.db.tables.Events.EVENTS;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;

@Repository
public class EventRepository {
    private final DSLContext db;

    public EventRepository(DSLContext db) {
        this.db = db;
    }

    public EventModel getEventById(int id) throws NoDataFoundException {
        try {
            EventModel event = db.selectFrom(EVENTS)
                    .where(EVENTS.ID.eq(id)).limit(1)
                    .fetchOneInto(EventModel.class);
            if (event == null) {
                throw new NoDataFoundException("No event found with id: " + id);
            }
            return event;
        } catch (DataAccessException e) {
            throw e;
        }
    }

    public List<EventModel> getEvents() throws NoDataFoundException {
        try {
            List<EventModel> events = db.selectFrom(EVENTS)
                    .limit(20)
                    .fetchInto(EventModel.class);

            if (events.isEmpty()) {
                throw new NoDataFoundException("No events found");
            }

            return events;
        } catch (DataAccessException e) {
            throw e;
        }
    }

    public void insertEvent(EventModel event) throws SQLIntegrityConstraintViolationException {
        try {
            db.insertInto(EVENTS, EVENTS.TITLE, EVENTS.PRICE, EVENTS.START_DATE, EVENTS.END_DATE)
                    .values(event.getTitle(), event.getPrice(), event.getStartDate(), event.getEndDate())
                    .execute();
        } catch (DataAccessException e) {
            if (e.getCause() instanceof SQLiteException) {
                SQLiteException sqliteException = (SQLiteException) e.getCause();
                if (sqliteException.getResultCode() == SQLiteErrorCode.SQLITE_CONSTRAINT_TRIGGER) {
                    throw new SQLConstraintViolationException(sqliteException.getMessage(), e);
                }
            }
            throw e;
        }
    }

    public void updateEvent(int id, EventModel event) throws SQLIntegrityConstraintViolationException {
        try {
            db.update(EVENTS)
                    .set(EVENTS.TITLE, event.getTitle())
                    .set(EVENTS.PRICE, event.getPrice())
                    .set(EVENTS.START_DATE, event.getStartDate())
                    .set(EVENTS.END_DATE, event.getEndDate())
                    .where(EVENTS.ID.eq(id))
                    .execute();
        } catch (DataAccessException e) {
            if (e.getCause() instanceof SQLiteException) {
                SQLiteException sqliteException = (SQLiteException) e.getCause();
                if (sqliteException.getResultCode() == SQLiteErrorCode.SQLITE_CONSTRAINT_TRIGGER) {
                    throw new SQLConstraintViolationException(sqliteException.getMessage(), e);
                }
            }
            throw e;
        }
    }

    public void deleteEvent(int id) throws SQLiteException {
        try {
            int affectedRows = db.deleteFrom(EVENTS)
                    .where(EVENTS.ID.eq(id))
                    .execute();
            if (affectedRows == 0) {
                throw new NoDataFoundException("No event found with id: " + id);
            }
        } catch (DataAccessException e) {
            throw e;
        }
    }
}
