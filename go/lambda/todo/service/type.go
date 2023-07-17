package service

import (
	"fmt"
	"os"

	"github.com/yuki-y-816/go-utils/dbconnection"

	"github.com/jmoiron/sqlx"
)

type Item struct {
	Id        int    `json:"id" db:"id"`
	UserId    string `json:"userId" db:"user_id"`
	Task      string `json:"task" db:"task"`
	CreatedAt string `json:"createdAt" db:"created_at"`
	UpdatedAt string `json:"updatedAt" db:"updated_at"`
}

type TodoItems []Item

type DB struct{ *sqlx.DB }

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
