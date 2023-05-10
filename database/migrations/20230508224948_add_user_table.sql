-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS user (
    id varchar(8) NOT NULL,
    name varchar(256),
    email varchar(256) NOT NULL UNIQUE,
    password varchar(64) NOT NULL,
    PRIMARY KEY(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE user;
-- +goose StatementEnd
