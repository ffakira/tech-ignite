# Technical Challenge Cogynte 

## Client

* SPA (Single Page Application), using the following libraries:
  * `zod` for schema validations
  * `react-aria-components` as for headless UI component, has rich features for accessability (thus improving SEO and Google lighthouse score), developed by Adobe
  * `@tanstack/react-query` handling HTTP requests and handling async operations and has cache strategy
  * `tailwindcss` allows for quick styling and prototyping the application

## Server

* Java Spring Boot
* Sqlite3: the decision going via sqlite3 (embedded database) is because, no additional requirements. However the biggest advantage, there is no latency between server and database connection, therefore allowing to write simple queries, in comparison to traditional databases that requires to write more complex queries due it's nature requiring a TPC connection open to communicate with the server.