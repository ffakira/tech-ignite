package so.akira.events.services;

import java.sql.SQLIntegrityConstraintViolationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.akira.events.exceptions.CustomNoDataFoundException;
import so.akira.events.exceptions.SQLConstraintViolationException;
import so.akira.events.models.Event;
import so.akira.events.repositories.EventRepository;

@Service
public class EventService {

    private static final Logger logger = LoggerFactory.getLogger(EventService.class);

    @Autowired
    private EventRepository eventRepository;

    public Event getEventById(int id) throws CustomNoDataFoundException {
        try {
            logger.debug("Fetching event with id: {}", id);
            return eventRepository.getEventById(id);
        } catch (CustomNoDataFoundException e) {
            logger.error("No event found with id: {}", id, e);
            throw e;
        } catch (Exception e) {
            logger.error("An error occured while fetching an event with id: {}", id, e);
            throw new RuntimeException("An error occured while fetching an event", e);
        }
    }

    public Iterable<Event> getEvents() throws CustomNoDataFoundException {
        try {
            logger.debug("Fetching events");
            return eventRepository.getEvents();
        } catch (CustomNoDataFoundException e) {
            logger.error("No events found", e);
            throw e;
        } catch (Exception e) {
            logger.error("An error occured while fetching events", e);
            throw new RuntimeException("An error occured while fetching events", e);
        }
    }

    public void insertEvent(Event event) {
        try {
            logger.debug("Inserting event: {}", event);
            eventRepository.insertEvent(event);
        } catch (SQLIntegrityConstraintViolationException e) {
            logger.error("An error occured while inserting an event", e);
            throw new SQLConstraintViolationException("An error occured while inserting an event", e);
        } catch (Exception e) {
            logger.error("An error occured while inserting an event", e);
            throw new RuntimeException("An error occured while inserting an event", e);
        }
    }

    public void updateEvent(int id, Event event) throws CustomNoDataFoundException {
        try {
            logger.debug("Updating event with id: {}", id);
            eventRepository.updateEvent(id, event);
        } catch (SQLIntegrityConstraintViolationException e) {
            logger.error("No event found with id: {}", id);
            throw new SQLConstraintViolationException("An error occured while updating an event", e);
        } catch (CustomNoDataFoundException e) {
            logger.error("An error occured while updating an event with id: {}", id, e);
            throw e;
        } catch (Exception e) {
            logger.error("An error occured while updating an event with id: {}", id, e);
            throw new RuntimeException("An error occured while updating an event", e);
        }
    }

    public void deleteEvent(int id) throws CustomNoDataFoundException {
        try {
            logger.debug("Deleting event with id: {}", id);
            eventRepository.deleteEvent(id);
        } catch (CustomNoDataFoundException e) {
            logger.error("No event found with id: {}", id);
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("An error occured while deleting an event", e);
        }
    }
}
