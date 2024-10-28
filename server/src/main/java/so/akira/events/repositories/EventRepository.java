package so.akira.events.repositories;

import org.jooq.DSLContext;
import org.jooq.exception.DataAccessException;
import org.jooq.exception.NoDataFoundException;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sqlite.SQLiteErrorCode;
import org.sqlite.SQLiteException;

import so.akira.events.exceptions.SQLConstraintViolationException;
import so.akira.events.exceptions.CustomNoDataFoundException;
import so.akira.events.models.Event;

import static so.akira.events.db.tables.Events.EVENTS;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;

@Repository
public class EventRepository {

    private static final Logger logger = LoggerFactory.getLogger(EventRepository.class);
    private final DSLContext db;

    public EventRepository(DSLContext db) {
        this.db = db;
    }

    public Event getEventById(int id) throws CustomNoDataFoundException {
        try {
            Event event = db.selectFrom(EVENTS)
                    .where(EVENTS.ID.eq(id)).limit(1)
                    .fetchOneInto(Event.class);
            if (event == null) {
                throw new CustomNoDataFoundException("No event found with id: " + id);
            }
            return event;
        } catch (NoDataFoundException e) {
            logger.error("Error fetching event with id: {}", id, e);
            throw new CustomNoDataFoundException("No event found with id: " + id, e);
        } catch (DataAccessException e) {
            logger.error("Error fetching event with id: {}", id, e);
            throw new RuntimeException("Error fetching event bud id: " + id, e);
        }
    }

    public List<Event> getEvents() throws CustomNoDataFoundException {
        try {
            List<Event> events = db.selectFrom(EVENTS)
                    .limit(20)
                    .fetchInto(Event.class);

            if (events.isEmpty()) {
                logger.error("No events found");
                throw new CustomNoDataFoundException("No events found");
            }

            return events;
        } catch (NoDataFoundException e) {
            logger.error("No events found", e);
            throw new CustomNoDataFoundException("No events found", e);
        } catch (DataAccessException e) {
            logger.error("Error fetching events", e);
            throw new RuntimeException("Error fetching events", e);
        }
    }

    public void insertEvent(Event event) throws SQLIntegrityConstraintViolationException {
        try {
            int id = db.insertInto(EVENTS, EVENTS.TITLE, EVENTS.PRICE, EVENTS.START_DATE, EVENTS.END_DATE)
                    .values(event.getTitle(), event.getPrice(), event.getStartDate(), event.getEndDate())
                    .returning(EVENTS.ID)
                    .fetchOne()
                    .getId();

            event.setId(id);

        } catch (DataAccessException e) {
            logger.error("Error inserting event", e);
            throw new SQLConstraintViolationException("error inserting event", e);
        }
    }

    public void updateEvent(int id, Event event)
            throws CustomNoDataFoundException, SQLIntegrityConstraintViolationException {
        try {
            int updateRows = db.update(EVENTS)
                    .set(EVENTS.TITLE, event.getTitle())
                    .set(EVENTS.PRICE, event.getPrice())
                    .set(EVENTS.STATUS, event.getStatus())
                    .set(EVENTS.START_DATE, event.getStartDate())
                    .set(EVENTS.END_DATE, event.getEndDate())
                    .set(EVENTS.UPDATED_AT, DSL.field("strftime('%s', 'now')", Integer.class))
                    .where(EVENTS.ID.eq(id))
                    .execute();
            if (updateRows == 0) {
                throw new CustomNoDataFoundException("No event found with id: " + id);
            }
        } catch (NoDataFoundException e) {
            logger.error("No event found with id: {}", id, e);
            throw new CustomNoDataFoundException("No event found with id: " + id, e);
        } catch (DataAccessException e) {
            logger.error("Error inserting event", e);
            throw new SQLConstraintViolationException("error inserting event", e);
        }
    }

    public void deleteEvent(int id) throws CustomNoDataFoundException {
        try {
            int affectedRows = db.deleteFrom(EVENTS)
                    .where(EVENTS.ID.eq(id))
                    .execute();
            if (affectedRows == 0) {
                throw new NoDataFoundException("No event found with id: " + id);
            }
        } catch (NoDataFoundException e) {
            logger.error("No event found with id: {}", id, e);
            throw new CustomNoDataFoundException("No event found with id: " + id, e);
        } catch (DataAccessException e) {
            logger.error("Error deleting event with id: {}", id, e);
            throw new RuntimeException("Error deleting event with id:" + id, e);
        }
    }
}
