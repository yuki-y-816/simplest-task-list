package data

import (
	"fmt"
	"os"

	"github.com/yuki-y-816/go-utils/dbconnection"

	"github.com/jmoiron/sqlx"
)

type DB struct{ *sqlx.DB }

type User struct {
	Id       string `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type Filter User

func NewDB() DB {
	db := dbconnection.Connect(getDns())

	return DB{db}
}

func getDns() string {
	return fmt.Sprintf(
		"%s:%s@tcp(%s)/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_DATABASE"),
	)
}
