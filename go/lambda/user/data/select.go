package data

import (
	"log"
	"strings"
)

func (db DB) createWhereClause(filter *Filter) string {
	var query []string

	if filter.Id != "" {
		query = append(query, "AND id = :id")
	}

	if filter.Name != "" {
		query = append(query, "AND name = :name")
	}

	if filter.Email != "" {
		query = append(query, "AND email = :email")
	}

	return strings.Join(query, " ")
}

func (db DB) SelectUserInfo(filter *Filter) User {
	query := `
		SELECT
			id,
			name,
			email
		FROM
			user
		WHERE
			1
	`

	query += db.createWhereClause(filter)

	rows, err := db.NamedQuery(query, filter)

	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var user User
	for rows.Next() {
		err = rows.StructScan(&user)
		if err != nil {
			log.Fatal(err)
		}
	}

	return user
}
