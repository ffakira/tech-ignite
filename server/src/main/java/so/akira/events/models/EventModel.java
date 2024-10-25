package so.akira.events.models;

public class EventModel {
    private int id;
    private String title;
    private int price;
    private String status;
    private int startDate;
    private int endDate;
    private int createdAt;
    private int updatedAt;

    public EventModel() {
    }

    public EventModel(String title, int price, int startDate, int endDate) {
        this.title = title;
        this.price = price;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public EventModel(String title, int price, String status, int startDate, int endDate, int updatedAt) {
        this.title = title;
        this.price = price;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.updatedAt = updatedAt;
    }

    public EventModel(String title, int price, String status, int startDate, int endDate, int createdAt,
            int updatedAt) {
        this.title = title;
        this.price = price;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public EventModel(int id, String title, int price, String status, int startDate, int endDate, int createdAt,
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
        return "EventModel{title=" + title + ", price=" + price + ", status=" + status + ", startDate=" + startDate
                + ", endDate=" + endDate + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "}";
    }
}