-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  dob DATE,
  phone VARCHAR(50) NOT NULL, -- e.g 7781112222
  post_code VARCHAR(50), -- e.g. H0H0H0
  photo_url VARCHAR(255),
  type VARCHAR(50) DEFAULT 'customer'
);
