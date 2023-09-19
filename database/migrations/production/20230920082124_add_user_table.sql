-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
    id varchar(8) NOT NULL,
    name varchar(255),
    email varchar(255) NOT NULL UNIQUE,
    password varchar(64) NOT NULL,
    PRIMARY KEY(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE users;
-- +goose StatementEnd
