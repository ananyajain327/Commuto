CREATE TABLE IF NOT EXISTS custom_ride_requests (
    id BIGSERIAL PRIMARY KEY,
    passenger_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_location VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    ride_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    seats_needed INTEGER NOT NULL DEFAULT 1,
    budget_per_seat DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    women_only BOOLEAN NOT NULL DEFAULT FALSE,
    note VARCHAR(1000),
    status VARCHAR(255) NOT NULL DEFAULT 'OPEN',
    accepted_driver_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_custom_ride_requests_status ON custom_ride_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_ride_requests_passenger ON custom_ride_requests(passenger_id, created_at DESC);
