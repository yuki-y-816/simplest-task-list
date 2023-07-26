package service

import (
	"fmt"
)

func (db DB) CreateNewTodoItem(item *Item) (*Item, error) {
	if item.UserId == "" || item.Task == "" {
		return nil, fmt.Errorf("lack of required parameters")
	}

	result, err := db.NamedExec(`
        INSERT INTO todo_items(
            user_id,
            task
        )
        VALUES(
            :user_id,
            :task
        )
    `, item)
	if err != nil {
		return nil, err
	}

	insertedId, _ := result.LastInsertId()

	item.Id = int(insertedId)

	return item, nil
}
