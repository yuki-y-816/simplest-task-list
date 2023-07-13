-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
    id varchar(8) NOT NULL,
    name varchar(255),
    email varchar(255) NOT NULL UNIQUE,
    password varchar(64) NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO users (
    id,
    name,
    email,
    password
)
VALUES (
    "8n3CeEjw",
    "Yuki",
    "test@test.com",
    "$2a$10$lc4oxk59e68YIhqP1pTz2uLCe/.X60WJ0wizz/NtqV3Zve4BAFsCC" /* password */
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE users;
-- +goose StatementEnd
