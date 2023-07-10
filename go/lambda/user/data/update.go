package data

import (
	"fmt"
	"strings"
)

func (db DB) UpdateUserInfo(filter *Filter) error {
	if db.checkFilterEmpty(filter) {
		return fmt.Errorf("no update params")
	}

	query := fmt.Sprintf(`
        UPDATE
            user
        SET
            %s
        WHERE
            id = :id
    `, db.createSetClause(filter))

	_, err := db.NamedExec(query, filter)

	return err
}

func (db DB) checkFilterEmpty(filter *Filter) bool {
	if filter.Name == "" && filter.Email == "" {
		return true
	}

	return false
}

func (db DB) createSetClause(filter *Filter) string {
	var query []string

	if filter.Name != "" {
		query = append(query, "name = :name")
	}

	if filter.Email != "" {
		query = append(query, "email = :email")
	}

	return strings.Join(query, ",")
}
