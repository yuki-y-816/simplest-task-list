-- +goose Up
-- +goose StatementBegin
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
TRUNCATE user;
-- +goose StatementEnd
