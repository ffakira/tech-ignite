package so.akira.events.exceptions;

public class CustomNoDataFoundException extends RuntimeException {
    public CustomNoDataFoundException(String message) {
        super(message);
    }

    public CustomNoDataFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
