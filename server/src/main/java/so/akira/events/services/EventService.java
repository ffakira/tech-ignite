package so.akira.events.services;

import java.sql.SQLIntegrityConstraintViolationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.akira.events.exceptions.NoDataFoundException;
import so.akira.events.exceptions.SQLConstraintViolationException;
import so.akira.events.models.EventModel;
import so.akira.events.repositories.EventRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public EventModel getEventById(int id) {
        try {
            return eventRepository.getEventById(id);
        } catch (NoDataFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("An error occured while fetching an event", e);
        }
    }

    public Iterable<EventModel> getEvents() {
        try {
            return eventRepository.getEvents();
        } catch (NoDataFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("An error occured while fetching events", e);
        }
    }

    public void insertEvent(EventModel event) {
        try {
            eventRepository.insertEvent(event);
        } catch (SQLIntegrityConstraintViolationException e) {
            throw new SQLConstraintViolationException("An error occured while inserting an event", e);
        } catch (Exception e) {
            throw new RuntimeException("An error occured while inserting an event", e);
        }
    }

    public void updateEvent(int id, EventModel event) {
        try {
            eventRepository.updateEvent(id, event);
        } catch (SQLIntegrityConstraintViolationException e) {
            throw new SQLConstraintViolationException("An error occured while updating an event", e);
        } catch (Exception e) {
            throw new RuntimeException("An error occured while updating an event", e);
        }
    }

    public void deleteEvent(int id) {
        try {
            eventRepository.deleteEvent(id);
        } catch (Exception e) {
            throw new RuntimeException("An error occured while deleting an event", e);
        }
    }
}
