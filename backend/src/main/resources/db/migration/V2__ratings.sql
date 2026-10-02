CREATE TABLE ratings (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT NOT NULL REFERENCES ride_requests(id),
    rater_id BIGINT NOT NULL REFERENCES users(id),
    ratee_id BIGINT NOT NULL REFERENCES users(id),
    score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_rating_request_rater_ratee UNIQUE (request_id, rater_id, ratee_id)
);

CREATE INDEX idx_ratings_ratee_created ON ratings(ratee_id, created_at DESC);