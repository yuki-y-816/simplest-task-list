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
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE todo_items;
-- +goose StatementEnd
