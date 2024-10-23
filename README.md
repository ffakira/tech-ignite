# tech-ignite

## Client

* SPA (Single Page Application), using the following libraries:
  * `zod` for schema validations
  * `react-aria-components` as for headless UI component, has rich features for accessability (thus improving SEO and Google lighthouse score), developed by Adobe
  * `@tanstack/react-query` handling HTTP requests and handling async operations and has cache strategy
  * `tailwindcss` allows for quick styling and prototyping the application

## Server

### API Documentation

#### GET `api/v1/events/{id}`

**Description:**
Get an event by id

**Request Parameters:**
- `id`: unsigned integer

**Request Body:**
None

**Response Status:**
<table>
  <thead>
    <th>Status</th>
    <th>Description</th>
  </thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>One event fetched by id</td>
    </tr>
    <tr>
      <td>400</td>
      <td>Malformed data from the client side</td>
    </tr>
    <tr>
      <td>404</td>
      <td>Event not found</td>
    </tr>
    <tr>
      <td>500</td>
      <td>Internal server error</td>
    </tr>
  </tbody>
</table>

**Example:**
```sh
$ curl -X GET http://localhost:8080/api/v1/events/9821 \
-H "Accept: application/json"
```

#### POST `/api/v1/events/new`

**Description:**
Create a new event

**Request Parameters:**
- None

**Request Body:**
```json
{
  "title": "string between 3 to 255 characters",
  "price": "number in cents",
  "startDate": "string in dd/mm/yyyy format",
  "endDate": "string in dd/mm/yyyy format"
}
```

**Response Status:**
<table>
  <thead>
    <th>Status</th>
    <th>Description</th>
  </thead>
  <tbody>
    <tr>
      <td>201</td>
      <td>Event succesfully created</td>
    </tr>
    <tr>
      <td>400</td>
      <td>Malformed data from the client side</td>
    </tr>
    <tr>
      <td>500</td>
      <td>Internal server error</td>
    </tr>
  </tbody>
</table>

**Example**
```sh
$ curl -X POST http://localhost:8080/api/v1/events/new \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
    "title": "Halloween 2k24",
    "price": 5500,
    "startDate": "31/10/2024",
    "endDate": "31/10/2024"
}'
```

#### PUT `/api/v1/events/{id}`

**Description:**
Updates an event by id

**Request Parameters:**
- `id`: unsigned integer

**Request Body:**
```json
{
  "title": "string between 3 to 255 characters",
  "price": "number in cents",
  "status": "string: started | completed | paused",
  "startDate": "string in dd/mm/yyyy format",
  "endDate": "string in dd/mm/yyyy format"
}
```

**Response Status:**
<table>
  <thead>
    <th>Status</th>
    <th>Description</th>
  </thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>Event successfully updated</td>
    </tr>
    <tr>
      <td>400</td>
      <td>Malformed data from the client side</td>
    </tr>
    <tr>
      <td>404</td>
      <td>Event not found</td>
    </tr>
    <tr>
      <td>500</td>
      <td>Internal server error</td>
    </tr>
  </tbody>
</table>

**Example:**
```sh
$ curl -X PUT http://localhost:8080/api/v1/events/9999 \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
    "title": "Halloween 2024",
    "price": 0,
    "status": "completed",
    "startDate": "31/10/2024",
    "endDate": "31/10/2024"
}'
```

#### DELETE `/api/v1/events/{id}`

**Description:**
Deletes an event by id

**Request Parameters:**
- `id`: unsigned integer

**Request Body:**
None

**Response Status:**
<table>
  <thead>
    <th>Status</th>
    <th>Description</th>
  </thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>Event succesfully deleted</td>
    </tr>
    <tr>
      <td>400</td>
      <td>Malformed data from the client side</td>
    </tr>
    <tr>
      <td>404</td>
      <td>Event not found</td>
    </tr>
    <tr>
      <td>500</td>
      <td>Internal server error</td>
    </tr>
  </tbody>
</table>

**Example**
```sh
$ curl -X DELETE http://localhost:8080/api/v1/events/9999 \
-H "Accept: application/json"
```

### Sqlite3
The decision going via `sqlite3` (embedded database) is because there were no additional technical requirements added added on the technical challenge:

Few things that I have just assumed were:
* Supports for internal use only
* Low volume of concurrent users
* Low data storage however, SQLite can scale up to +100GB data storage, and there are edge cases where there is production SQLite handling terabytes of data (high read operations and low write operations).
* Very fast read operations since there is no latency between networks, as SQLite is not require TCP connection.

Few things to consider in the future reference, if the application requires to grow:
* Geolocations / Geospatial features will require additional workarounds as by default SQLite does not support. In this case, I would suggest going for Postgres which has a vast support for different extensions.
* Timeseries. If main events have multiple subevents and requires to query through a timeseries data, SQLite will not be idea. One of workarounds, is having `file_name-yyyy.db`, however the additional complexity will consider another alternatives.

#### Table Design

There were few things, that I made assumption. And there could be some clarification on the technical challenge.

Few things I assumed:
* Data integrity: ensuring the data conforms with the requirements, and have several checks to ensure the integretiy of data.
However, having a lot of constraints, will hinger the write operations for higher volume of concurrent users doing write operations.
* No RBAC: anyone can edit, delete or update the events table

Some improvements to the database:

**Integrating normalization table for start_date and end_date**
* `events.start_date` and `events.end_date`, assuming that we only allow users only insert `dd/mm/yyyy`, instead of having the existing table. We could create a new table for `start_date` and `end_date` and have being referred to `events` table

```diff
+ CREATE TABLE IF NOT EXISTS event_date_ranges (
+    id INTEGER PRIMARY KEY AUTOINCREMENT,
+    start_date INTEGER NOT NULL,
+    end_date INTEGER NOT NULL
+ );

+ CREATE INDEX IF NOT EXISTS idx_event_date_ranges_start_date ON event_date_ranges (start_date);
+ CREATE INDEX IF NOT EXISTS idx_event_date_ranges_end_date ON event_date_ranges (end_date);

+ CREATE TRIGGER delete_event_date_ranges_trigger
+ BEFORE DELETE ON event_date_ranges
+ BEGIN
+     SELECT RAISE(ABORT, 'error: not allowed to delete')
+ END;

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    price INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'started',
+   event_date_ranges_id INTEGER NOT NULL,
-   start_date INTEGER NOT NULL,
-   end_date INTEGER NOT NULL,
    created_at INTEGER DEFAULT (strftime ('%s', 'now')),
    updated_at INTEGER DEFAULT NULL,
+   FOREIGN KEY (event_dates_range_id) REFERENCES event_date_ranges (id)
);
```

By integrating normalization, we remove data duplications. Let's say that several people are planning to create
an event for Christmas start_date and end_date is: 25/12/2024

Your table will have multiple duplicates of the data causing wastage on resources. By indexing the `start_date` and `end_date`, it allows you refer to the same column. However, the example I've shown, is an edge case scenario, where resources are limited.

**Data Types and Formats**
* `events.price` is stored in cents, this is to avoid floating precision errors in the case the database requires to do arithmetic operations. (e.g.: `$192.29` is stored in database as `19229`)

* `start_date|end_date|created_at|updated_at` are stored as unix timestamp (seconds) as NUMBER instead of TEXT. Numbers takes less storage than text.

#### Database utilities

* The reason why I chose `JOOQ`, instead of popular ORMs like `JPA`; is simply because JOOQ allows to write close SQL statements closely translating to actual SQLs. While JPA is a popular choice it does tend to perform bad, as the the data relations gets more complex, requiring more complex queries (subqueries, multiple table joins, etc...).

* `Flyway` as a database migration, quite self explanatory. Having multiple members integrating new features, requires the database schema always be up to date.
