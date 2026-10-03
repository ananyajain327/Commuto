CREATE TABLE ride_chat_messages (
    id BIGSERIAL PRIMARY KEY,
    ride_id BIGINT NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_ride_chat_ride_id ON ride_chat_messages(ride_id);
