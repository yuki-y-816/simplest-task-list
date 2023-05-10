-- +goose Up
-- +goose StatementBegin
INSERT INTO test (text) VALUES ('Hello, from DB.');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
TRUNCATE test;
-- +goose StatementEnd
