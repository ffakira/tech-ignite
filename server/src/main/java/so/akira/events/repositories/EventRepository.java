package so.akira.events.repositories;

import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import so.akira.events.models.EventModel;

import static so.akira.events.db.tables.Events.EVENTS;

@Repository
public class EventRepository {
    private final DSLContext db;

    public EventRepository(DSLContext db) {
        this.db = db;
    }

    public EventModel getEventById(int id) {
        return db.selectFrom(EVENTS)
                .where(EVENTS.ID.eq(id)).limit(1)
                .fetchOneInto(EventModel.class);
    }

    public void insertEvent(EventModel event) {
        db.insertInto(EVENTS, EVENTS.TITLE, EVENTS.PRICE, EVENTS.START_DATE, EVENTS.END_DATE)
                .values(event.getTitle(), event.getPrice(), event.getStartDate(), event.getEndDate())
                .execute();
    }

    public void updateEvent(int id, EventModel event) {
        db.update(EVENTS)
                .set(EVENTS.TITLE, event.getTitle())
                .set(EVENTS.PRICE, event.getPrice())
                .set(EVENTS.START_DATE, event.getStartDate())
                .set(EVENTS.END_DATE, event.getEndDate())
                .where(EVENTS.ID.eq(id))
                .execute();
    }

    public void deleteEvent(int id) {
        db.deleteFrom(EVENTS)
                .where(EVENTS.ID.eq(id))
                .execute();
    }
}
