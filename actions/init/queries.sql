
-- create
CREATE TABLE USER (
  user_id INTEGER PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  password TEXT NOT NULL,
  identifier TEXT NOT NULL
);

CREATE TABLE PRODUCT_TYPE (
  product_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE ACCOUNT (
  account_id INTEGER PRIMARY KEY,
  user_id INTEGER,
  product_id INTEGER,
  date_created TEXT NOT NULL,
  amount_owed REAL NOT NULL,
  amount_available REAL NOT NULL,
  FOREIGN KEY(user_id) REFERENCES USER(user_id),
  FOREIGN KEY(product_id) REFERENCES PRODUCT(product_id)
);

CREATE TABLE ACTIVITY (
  activity_id INTEGER PRIMARY KEY,
  account_id INTEGER,
  amount REAL NOT NULL,
  activity_date TEXT NOT NULL,
  FOREIGN KEY(account_id) REFERENCES ACCOUNT(account_id)
);

-- insert
INSERT INTO USER VALUES (0001, 'Zoran', 'Nikolovski', 'Adobe123', 'nikolovs@adobe.com');
INSERT INTO PRODUCT_TYPE VALUES (0001, 'Savings Account', 'A SecurBank savings account');
INSERT INTO ACCOUNT VALUES (0001, 0001, 0001, '2024-03-07', 0, 1920.00);
INSERT INTO ACTIVITY VALUES (0001, 0001, 236.77, '2025-01-23')


