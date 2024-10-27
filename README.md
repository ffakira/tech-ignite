# tech-ignite

## Getting started

1. Rename inside the `client` folder: 
  * `.env.example` to `.env.local`

```
NODE_ENV=dev
VITE_API_V1_URL=http://localhost:8080/api/v1
```

2. Back to the root project, where `docker-compose.yml` is located, and
run the following command

```
docker compose up 
```

## Assumptions

1. The start and end date are only changed by day. Via API, can easily add an 1 second. The requirements were not clear enough, asides making sure the end date is greater than start date.

**Via SQL:**
```diff
CREATE TRIGGER validate_events_before_insert
BEFORE INSERT ON events FOR EACH ROW
BEGIN
    SELECT CASE
        -- Validate events.title column
        WHEN LENGTH(NEW.title) < 3 OR LENGTH(NEW.title) > 255
        THEN RAISE(ABORT, 'error: events.title column length should be between 3 and 255 characters')

        -- Validate events.price column    
        WHEN NEW.price < 0
        THEN RAISE(ABORT, 'error: events.price must be a positive integer')

        -- Validate events.status column
        WHEN NEW.status NOT IN ('started', 'completed', 'paused')
        THEN RAISE(ABORT, 'error: events.status must be one of the following: started | completed | paused')

        -- Validate events.start_date column
        WHEN NEW.start_date < 0
        THEN RAISE(ABORT, 'error: events.start_date must be a positive integer')

        -- Validate events.end_date column
        WHEN NEW.end_date < 0
        THEN RAISE(ABORT, 'error: events.end_date must be a positive integer')

        -- Validate events.start_date < events.end_date columns
-        WHEN NEW.start_date >= NEW.end_date
+        WHEN NEW.start_date + 86400 >= NEW.end_date
        THEN RAISE(ABORT, 'error: events.start_date should be less than events.end_date')
    END;
END;

# And update for UPDATE trigger also
```

**Via TypeScript:**
```diff
export const eventSchema = baseEventSchema.refine(
  (data) => {
    const startDate = parseDateString(data.startDate);
    const endDate = parseDateString(data.endDate);

-    return endDate >= startDate;
+    return endDate.getTime() >= startDate.getTime() + 86400 * 1000;
  },
  { message: "End date must be after start date", path: ["endDate"] }
);
```

2. The status can only be changed, when updating an event. When creating a new status, the status is automatically set to `started`.

## Client

* SPA (Single Page Application), using the following libraries:
  * `zod` for schema validations
  * `react-aria-components` as for headless UI component, has rich features for accessability (thus improving SEO and Google lighthouse score), developed by Adobe
  * `@tanstack/react-query` handling HTTP requests and handling async operations and has cache strategy
  * `tailwindcss` allows for quick styling and prototyping the application

Run in development mode
```
$ bun dev

# In the case if the environment files are not being expoed
$ bun --bun dev
```

### Folder structure
* `lib`: consists react-query related stuffs for mutations and queries, along with zod schemas and utils.
* `components/ui` consists tailwind variants to style atomic elements
* `components/layouts` consists the root layout with the usage of `<Outlet />` from `react-router-dom`
* `components` consinsts global components that is used across the app
* `pages` consists the business logic and the main UI layout of page, structured the same way how `react-router-dom` is defined
* `routes` file is for routing
* `styles` folder consists an `app.css` for importing tailwind styles

**Note** 
Unlike typical React projects where you create components and import to main UI component. The approach that I've applied, it allows to encapuslate all business logic within a single file. And only export the main UI component. 

The decision for going unconventional approach, allows to debug the component easier. In addition, during early developments, should avoid [pre-maturely DRY code](https://testing.googleblog.com/2024/05/dont-dry-your-code-prematurely.html#:~:text=Applying%20DRY%20principles%20too%20rigidly,redundant%20or%20just%20superficially%20similar.) thus avoiding building technical debts on the early stage.

## Server

### Setting up the server
```
# Ensure you are inside the server folder

# If data folder does exists inside the server folder
$ mkdir -p data

# Clean up anything
$ mvn clean

# Apply migrations from database
$ mvn flyway:migrate
 
# Create jar file
$ mvn package -DskipTests

# You can 
$ java -jar target/events-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

### Folder structure
* `config` contains configuration files for boostraping Srping app
* `controllers` contains the RESTful api
* `models` contains the structure of the object
* `repositories` interacts with the database via JOOQ
* `services` add additional business logic and interact with repository
* `resources/db/migration` contains `flyway` migration files, to sync up with the database

### Improvements 
* Setup different `application.properties` for `dev` | `staging` | `prod` | `test`. Currently there is only one profile
  * Creating an `application-dev.properties` file for dev staging, to have different environments for each stage of development lifecycle
* Integrating Github Actions with CI/CD pipeline to verify the build + run JUnit tests
  * Creating in-memory SQLite database, and have default database seeds, where you can setup unit tests.

* Create maven profiles, with `profiles` tag, and have different id on `pom.xml` file for managing different environments
```xml
<!-- rest of pom.xml file -->
<profiles>
  <profile>
    <id>dev</id>
    <!-- setup for dev stage -->
  </profile>
  <profile>
    <id>prod</id>
    <!-- setup for prod stage -->
  </profile>
</profiles>

* `createdAt`, `updatedAt`, `startDate` and `endDate` currently is set to `int` which will cause an int overflow, from Y2k38 bug, when time reaches on ~Jan 2038. A simple fix, is to use `long` instead of `int`.

* A better docker build, instead of creating flyway migrations and generate JOOQ outside of docker container.
```

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
  "startDate": "number in unix timestamp in seconds",
  "endDate": "number in unix timestamp in seconds"
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
    "startDate": 1757200000,
    "endDate": 1757286400
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
  "startDate": "number in unix timestamp in seconds",
  "endDate": "number in unix timestamp in seconds"
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
    "startDate": 1757200000,
    "endDate": 1757286400
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
