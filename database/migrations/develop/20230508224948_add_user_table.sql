-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS user (
    id varchar(8) NOT NULL,
    name varchar(256),
    email varchar(256) NOT NULL UNIQUE,
    password varchar(64) NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO user (
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
DROP TABLE user;
-- +goose StatementEnd
