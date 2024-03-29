-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS todo_items (
    id int(11) NOT NULL AUTO_INCREMENT,
    user_id varchar(8) NOT NULL,
    task varchar(255) NOT NULL DEFAULT "",
    created_at datetime NOT NULL DEFAULT NOW(),
    updated_at datetime NOT NULL DEFAULT NOW(),
    PRIMARY KEY(id),
    FOREIGN KEY fk_user_id(user_id) REFERENCES users(id)
);

INSERT INTO todo_items (
    user_id,
    task,
    created_at,
    updated_at
)
VALUES (
    "8n3CeEjw",
    "this is test task",
    "2023-07-7 07:07:07",
    "2023-07-7 07:07:07"
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE todo_items;
-- +goose StatementEnd
