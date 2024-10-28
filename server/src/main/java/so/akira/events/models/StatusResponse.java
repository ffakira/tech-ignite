package so.akira.events.models;

import java.util.Map;

public class StatusResponse {
    private String status;
    private String message;
    private Map<String, String> errors;
    private Object data;

    public StatusResponse(String status, String message) {
        this.status = status;
        this.message = message;
    }

    public StatusResponse(String status, String message, Map<String, String> errors) {
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    public StatusResponse(String status, String message, Map<String, String> errors, Object data) {
        this.status = status;
        this.message = message;
        this.errors = errors;
        this.data = data;
    }

    // Getters and setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
