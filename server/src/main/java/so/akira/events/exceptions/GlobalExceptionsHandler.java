package so.akira.events.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import so.akira.events.models.StatusResponse;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionsHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StatusResponse> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();

        e.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        StatusResponse statusResponse = new StatusResponse("error", "Validation failed", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusResponse);
    }

    @ExceptionHandler(SQLConstraintViolationException.class)
    public ResponseEntity<StatusResponse> handleConstraintViolationException(SQLConstraintViolationException e) {
        StatusResponse statusResponse = new StatusResponse("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusResponse);
    }

    @ExceptionHandler(CustomNoDataFoundException.class)
    public ResponseEntity<StatusResponse> handleNoDataFoundException(CustomNoDataFoundException e) {
        StatusResponse statusResponse = new StatusResponse("error", e.getMessage(), null, new Object[0]);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(statusResponse);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<StatusResponse> handleException(RuntimeException e) {
        StatusResponse statusResponse = new StatusResponse("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(statusResponse);
    }
}
