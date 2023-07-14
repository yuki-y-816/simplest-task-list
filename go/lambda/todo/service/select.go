package service

import "strings"

func (db DB) createWhereClause(item *Item) string {
	var query []string

	if item.UserId != "" {
		query = append(query, "AND user_id = :user_id")
	}

	return strings.Join(query, " ")
}

func (db DB) SelectTodoItems(item *Item) (TodoItems, error) {
	var todoItems TodoItems
	query := `
        SELECT
            user_id,
            task,
            updated_at
        FROM
            todo_items
        WHERE
            1
    `

	query += db.createWhereClause(item)

	rows, err := db.NamedQuery(query, item)
	if err != nil {
		return todoItems, err
	}
	defer rows.Close()

	for rows.Next() {
		var i Item
		err = rows.StructScan(&i)
		if err != nil {
			return todoItems, err
		}

		todoItems = append(todoItems, i)
	}

	return todoItems, nil
}
