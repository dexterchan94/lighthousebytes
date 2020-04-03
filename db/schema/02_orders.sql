DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  completed_at TIMESTAMP,
  special_request TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, completed, cancelled
  rating SMALLINT,
  feedback TEXT
);
