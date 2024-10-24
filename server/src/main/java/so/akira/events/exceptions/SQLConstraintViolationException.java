package so.akira.events.exceptions;

public class SQLConstraintViolationException extends RuntimeException {
    public SQLConstraintViolationException(String message, Throwable cause) {
        super(message, cause);
    }
}
