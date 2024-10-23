package so.akira.events.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.akira.events.models.EventModel;
import so.akira.events.repositories.EventRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public EventModel getEventById(int id) {
        return eventRepository.getEventById(id);
    }

    public void insertEvent(EventModel event) {
        eventRepository.insertEvent(event);
    }

    public void updateEvent(int id, EventModel event) {
        eventRepository.updateEvent(id, event);
    }

    public void deleteEvent(int id) {
        eventRepository.deleteEvent(id);
    }
}
