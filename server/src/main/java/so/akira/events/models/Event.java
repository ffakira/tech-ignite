package so.akira.events.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import so.akira.events.validators.event.ValidEndDate;
import so.akira.events.validators.event.ValidStartDate;

@ValidEndDate
public class Event {
    private int id;

    @NotNull(message = "title is required")
    @NotBlank(message = "title is required")
    @Size(min = 3, max = 255, message = "title must be between 3 and 255 characters")
    private String title;

    @Positive(message = "price must be a positive number")
    private int price;

    @Pattern(regexp = "^(completed|paused|started)$", message = "Status must be one of: completed, paused, started")
    private String status;

    @Positive(message = "startDate must be a positive number")
    @ValidStartDate
    private int startDate;

    @Positive(message = "endDate must be a positive number")
    private int endDate;

    private int createdAt;
    private int updatedAt;

    public Event() {
    }

    public Event(String title, int price, int startDate, int endDate) {
        this.title = title;
        this.price = price;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Event(String title, int price, String status, int startDate, int endDate, int updatedAt) {
        this.title = title;
        this.price = price;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.updatedAt = updatedAt;
    }

    public Event(String title, int price, String status, int startDate, int endDate, int createdAt,
            int updatedAt) {
        this.title = title;
        this.price = price;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Event(int id, String title, int price, String status, int startDate, int endDate, int createdAt,
            int updatedAt) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getStartDate() {
        return startDate;
    }

    public void setStartDate(int startDate) {
        this.startDate = startDate;
    }

    public int getEndDate() {
        return endDate;
    }

    public void setEndDate(int endDate) {
        this.endDate = endDate;
    }

    public int getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(int createdAt) {
        this.createdAt = createdAt;
    }

    public int getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(int updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String toString() {
        return "Event{title=" + title + ", price=" + price + ", status=" + status + ", startDate=" + startDate
                + ", endDate=" + endDate + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "}";
    }
}
