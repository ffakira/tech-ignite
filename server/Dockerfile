# build stage: setup jdk 21, install maven and download dependencies
FROM jelastic/maven:3.9.5-openjdk-21 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

# run flyway migration
FROM build AS migrate
WORKDIR /app

# optional: to install sqlite3, allows to access the database
# RUN apt-get update && apt-get install -y sqlite3

# [!] attach the volume to the container, to ensure the data is persisted
# and apply migrations to the database
RUN mkdir -p /app/data

COPY --from=build /app/pom.xml . 
COPY src/main/resources/db /app/src/main/resources/db
COPY src/main/resources/application.properties /app/src/main/resources/application.properties

RUN mvn flyway:migrate

# build stage: build the application
FROM migrate AS stage
WORKDIR /app

COPY --from=build /app/pom.xml .
COPY --from=migrate /app/data /app/data
COPY --from=migrate /app/src /app/src

COPY src/main/java /app/src/main/java

RUN mvn clean package -DskipTests

# run stage: run the application on port 8080
FROM stage AS run
WORKDIR /app

COPY --from=stage /app/target/*.jar app.jar
RUN rm -rf /app/src && rm -rf /app/target && rm -rf /app/pom.xml

EXPOSE 8080
