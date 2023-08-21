package service

func (db DB) UpdateTodoItem(item *Item) (int, error) {
	if item.Id == 0 || item.Task == "" {
		return 400, nil
	}

	result, err := db.NamedExec(`
		UPDATE
			todo_items
		SET
			task = :task,
			updated_at = NOW()
		WHERE
			id = :id
	`, item)
	if err != nil {
		return 0, err
	}

	if affected, _ := result.RowsAffected(); affected == 0 {
		return 400, nil
	}

	return 204, nil
}
