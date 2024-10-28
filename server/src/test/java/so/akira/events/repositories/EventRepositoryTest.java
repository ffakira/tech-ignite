package so.akira.events.repositories;

import org.jooq.DSLContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import so.akira.events.config.JooqTestConfig;
import so.akira.events.exceptions.CustomNoDataFoundException;
import so.akira.events.models.Event;

import java.sql.SQLException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = { JooqTestConfig.class, EventRepository.class })
public class EventRepositoryTest {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private DSLContext dslContext;

    @BeforeEach
    public void setUp() throws SQLException {
        // Clean up the database before each test
        dslContext.execute("DELETE FROM events");
    }

    @Test
    public void testInsertEvent() throws SQLException {
        Event event = new Event();
        event.setTitle("Test Event");
        event.setPrice(100);
        event.setStatus("started");

        // Set startDate to the current day in seconds
        long startOfDayInSeconds = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toEpochSecond();
        event.setStartDate((int) startOfDayInSeconds);

        // Set endDate to one day after startDate
        event.setEndDate((int) startOfDayInSeconds + 86400); // 86400 seconds in a day

        event.setCreatedAt((int) Instant.now().getEpochSecond());

        eventRepository.insertEvent(event);

        List<Event> events = eventRepository.getEvents();
        assertEquals(1, events.size(), "There should be exactly one event in the database");
        assertEquals("Test Event", events.get(0).getTitle(), "The title of the event should be 'Test Event'");
    }

    @Test
    public void testGetEventById() throws SQLException {
        Event event = new Event();
        event.setTitle("Test Event");
        event.setPrice(100);
        event.setStatus("started");

        // Set startDate to the current day in seconds
        long startOfDayInSeconds = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toEpochSecond();
        event.setStartDate((int) startOfDayInSeconds);

        // Set endDate to one day after startDate
        event.setEndDate((int) startOfDayInSeconds + 86400); // 86400 seconds in a day

        event.setCreatedAt((int) Instant.now().getEpochSecond());

        eventRepository.insertEvent(event);

        Event fetchedEvent = eventRepository.getEventById(event.getId());
        assertNotNull(fetchedEvent, "The fetched event should not be null");
        assertEquals("Test Event", fetchedEvent.getTitle(), "The title of the fetched event should be 'Test Event'");
    }

    @Test
    public void testUpdateEvent() throws SQLException {
        Event event = new Event();
        event.setTitle("Test Event");
        event.setPrice(100);
        event.setStatus("started");

        // Set startDate to the current day in seconds
        long startOfDayInSeconds = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toEpochSecond();
        event.setStartDate((int) startOfDayInSeconds);

        // Set endDate to one day after startDate
        event.setEndDate((int) startOfDayInSeconds + 86400); // 86400 seconds in a day

        event.setCreatedAt((int) Instant.now().getEpochSecond());

        eventRepository.insertEvent(event);

        event.setTitle("Updated Event");
        eventRepository.updateEvent(event.getId(), event);

        Event updatedEvent = eventRepository.getEventById(event.getId());
        assertEquals("Updated Event", updatedEvent.getTitle(),
                "The title of the updated event should be 'Updated Event'");
    }

    @Test
    public void testDeleteEvent() throws SQLException {
        Event event = new Event();
        event.setTitle("Test Event");
        event.setPrice(100);
        event.setStatus("started");

        // Set startDate to the current day in seconds
        long startOfDayInSeconds = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toEpochSecond();
        event.setStartDate((int) startOfDayInSeconds);

        // Set endDate to one day after startDate
        event.setEndDate((int) startOfDayInSeconds + 86400); // 86400 seconds in a day

        event.setCreatedAt((int) Instant.now().getEpochSecond());

        eventRepository.insertEvent(event);

        eventRepository.deleteEvent(event.getId());

        assertThrows(CustomNoDataFoundException.class, () -> {
            eventRepository.getEventById(event.getId());
        }, "Fetching the deleted event should throw CustomNoDataFoundException");
    }
}
