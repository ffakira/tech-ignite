package so.akira.events.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import so.akira.events.models.StatusResponse;
import so.akira.events.models.EventModel;
import so.akira.events.services.EventService;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("")
    public ResponseEntity<?> getEvents() {
        return ResponseEntity.status(HttpStatus.OK).body(eventService.getEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEvent(@PathVariable int id) {
        if (id <= 0) {
            StatusResponse statusResponse = new StatusResponse("error", "Invalid ID params");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusResponse);
        }

        EventModel event = eventService.getEventById(id);
        return ResponseEntity.status(HttpStatus.OK).body(event);
    }

    @PostMapping("/new")
    public ResponseEntity<?> createEvent(@RequestBody EventModel event) {
        eventService.insertEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable int id, @RequestBody EventModel event) {
        if (id <= 0) {
            StatusResponse statusResponse = new StatusResponse("error", "Invalid ID params");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusResponse);
        }

        eventService.updateEvent(id, event);
        return ResponseEntity.status(HttpStatus.OK).body(event);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable int id) {
        if (id <= 0) {
            StatusResponse statusResponse = new StatusResponse("error", "Invalid ID params");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusResponse);
        }

        eventService.deleteEvent(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
