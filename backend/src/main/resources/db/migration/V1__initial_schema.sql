CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rides (
    id BIGSERIAL PRIMARY KEY,
    driver_id BIGINT NOT NULL REFERENCES users(id),
    start_location VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    ride_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    available_seats INTEGER NOT NULL,
    expected_fare DOUBLE PRECISION NOT NULL,
    vehicle_model VARCHAR(255) NOT NULL,
    vehicle_number VARCHAR(255) NOT NULL,
    women_only BOOLEAN NOT NULL DEFAULT FALSE,
    notes VARCHAR(500),
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ride_requests (
    id BIGSERIAL PRIMARY KEY,
    ride_id BIGINT NOT NULL REFERENCES rides(id),
    passenger_id BIGINT NOT NULL REFERENCES users(id),
    seats_requested INTEGER NOT NULL,
    pickup_preference VARCHAR(500),
    note VARCHAR(500),
    fare DOUBLE PRECISION NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    women_only BOOLEAN NOT NULL DEFAULT FALSE,
    ride_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    safety_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    promotional_notifications BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_ride_requests_passenger_created ON ride_requests(passenger_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ride_requests_ride_created ON ride_requests(ride_id, created_at DESC);