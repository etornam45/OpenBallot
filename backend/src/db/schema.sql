CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  voter_id INTEGER NOT NULL UNIQUE,
  passkey TEXT NOT NULL,
  facial_hash TEXT
);

CREATE TABLE elections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_time INTEGER,
  end_time INTEGER
);

CREATE TABLE constituency (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region TEXT NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE pres_candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  political_party TEXT NOT NULL,
  election_id INTEGER NOT NULL,
  FOREIGN KEY (election_id) REFERENCES elections(id)
);

CREATE TABLE pal_candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  political_party TEXT NOT NULL,
  election_id INTEGER NOT NULL,
  constituency_id INTEGER NOT NULL,
  FOREIGN KEY (election_id) REFERENCES elections(id),
  FOREIGN KEY (constituency_id) REFERENCES constituency(id)
);
