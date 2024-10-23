package so.akira.events.models;

public class EventModel {
    private String title;
    private int price;
    private String status;
    private String startDate;
    private String endDate;
    private int createdAt;
    private int updatedAt;

    public EventModel() {
    }

    public EventModel(String title, int price, String startDate, String endDate) {
        this.title = title;
        this.price = price;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public EventModel(String title, int price, String status, String startDate, String endDate, int updatedAt) {
        this.title = title;
        this.price = price;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.updatedAt = updatedAt;
    }

    public EventModel(String title, int price, String status, String startDate, String endDate, int createdAt,
            int updatedAt) {
        this.title = title;
        this.price = price;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
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