package service

import (
    "fmt"
)

func (db DB) DeleteTodoItem(item *Item) error {
    if item.Id == 0 || item.UserId == "" {
        return fmt.Errorf("lack of required parameters")
    }

    _, err := db.NamedExec(`
        DELETE
        FROM
            todo_items
        WHERE
            id = :id
            AND user_id = :user_id
    `, item)
    if err != nil {
        return err
    }

    return nil
}
