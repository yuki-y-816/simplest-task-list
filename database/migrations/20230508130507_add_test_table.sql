-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS test (
    id int AUTO_INCREMENT,
    text varchar(256),
    PRIMARY KEY(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE test;
-- +goose StatementEnd
