FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn -pl payment-service -am clean package -DskipTests

FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/payment-service/target/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
