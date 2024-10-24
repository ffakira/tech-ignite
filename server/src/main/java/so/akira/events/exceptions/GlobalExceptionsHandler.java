package so.akira.events.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import so.akira.events.models.StatusResponse;

@ControllerAdvice
public class GlobalExceptionsHandler {

    @ExceptionHandler(SQLConstraintViolationException.class)
    public ResponseEntity<StatusResponse> handleConstraintViolationException(SQLConstraintViolationException e) {
        StatusResponse statusResponse = new StatusResponse("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusResponse);
    }

    @ExceptionHandler(NoDataFoundException.class)
    public ResponseEntity<StatusResponse> handleNoDataFoundException(NoDataFoundException e) {
        StatusResponse statusResponse = new StatusResponse("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(statusResponse);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<StatusResponse> handleException(RuntimeException e) {
        StatusResponse statusResponse = new StatusResponse("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(statusResponse);
    }
}
