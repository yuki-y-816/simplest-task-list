package data

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/yuki-y-816/go-utils/dbconnection"

	"github.com/jmoiron/sqlx"
)

type Service struct {
	Db *sqlx.DB
}

type SearchFilter struct {
	Id       string `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type User struct {
	Id       string `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

func NewService() *Service {
	dataSrc := fmt.Sprintf(
		"%s:%s@tcp(%s)/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_DATABASE"),
	)
	db := dbconnection.Connect(dataSrc)

	return &Service{
		Db: db,
	}
}

func (s *Service) createWhereClause(filter *SearchFilter) string {
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

func (s *Service) SelectUserInfo(filter *SearchFilter) User {
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

	query += s.createWhereClause(filter)

	rows, err := s.Db.NamedQuery(query, filter)

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
