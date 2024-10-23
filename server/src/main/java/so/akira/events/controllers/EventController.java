package so.akira.events.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    @GetMapping("/{id}")
    public ResponseEntity<?> getEvent() {
        return ResponseEntity.status(501).build();
    }

    @PostMapping("/new")
    public ResponseEntity<?> createEvent() {
        return ResponseEntity.status(501).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent() {
        return ResponseEntity.status(501).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent() {
        return ResponseEntity.status(501).build();
    }
}
