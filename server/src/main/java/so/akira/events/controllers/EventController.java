package so.akira.events.controllers;

import org.jooq.exception.NoDataFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import so.akira.events.models.StatusResponse;
import so.akira.events.models.Event;
import so.akira.events.services.EventService;

@RestController
@RequestMapping("/api/v1/events")
@Validated
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<?> getEvents() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(eventService.getEvents());
        } catch (NoDataFoundException e) {
            StatusResponse statusResponse = new StatusResponse("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(statusResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEvent(@PathVariable int id) {
        if (id <= 0) {
            StatusResponse statusResponse = new StatusResponse("error", "Invalid ID params");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusResponse);
        }

        try {
            Event event = eventService.getEventById(id);
            return ResponseEntity.status(HttpStatus.OK).body(event);
        } catch (NoDataFoundException e) {
            StatusResponse statusResponse = new StatusResponse("error", "Event not found", null, new Object[0]);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(statusResponse);
        }
    }

    @PostMapping("/new")
    public ResponseEntity<?> createEvent(@Valid @RequestBody Event event) {
        eventService.insertEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable int id, @Valid @RequestBody Event event) {
        if (id <= 0) {
            StatusResponse statusResponse = new StatusResponse("error", "Invalid ID params");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusResponse);
        }

        try {
            eventService.updateEvent(id, event);
            return ResponseEntity.status(HttpStatus.OK).body(event);
        } catch (NoDataFoundException e) {
            StatusResponse statusResponse = new StatusResponse("error", "Event not found", null, new Object[0]);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(statusResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable int id) {
        if (id <= 0) {
            StatusResponse statusResponse = new StatusResponse("error", "Invalid ID params");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusResponse);
        }

        try {
            eventService.deleteEvent(id);
            StatusResponse statusResponse = new StatusResponse("success", "Event deleted successfully");
            return ResponseEntity.status(HttpStatus.OK).body(statusResponse);
        } catch (NoDataFoundException e) {
            StatusResponse statusResponse = new StatusResponse("error", "Event not found", null, new Object[0]);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(statusResponse);
        }
    }
}
