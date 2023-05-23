package service

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"regexp"

	"github.com/go-sql-driver/mysql"

	"github.com/yuki-y-816/go-utils/dbconnection"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id       string `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type Service struct {
	DB   *sqlx.DB
	User *User
}

func randomStr(n int) string {
	letters := []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

	slice := make([]rune, n)
	for i := range slice {
		slice[i] = letters[rand.Intn(len(letters))]
	}

	return string(slice)
}

func encryptPassword(pass []byte) string {
	encryped, err := bcrypt.GenerateFromPassword(pass, 10)
	if err != nil {
		log.Fatal(err)
	}

	return string(encryped)
}

func New(user *User) *Service {
	dataSrc := fmt.Sprintf(
		"%s:%s@tcp(%s)/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_DATABASE"),
	)

	return &Service{
		DB: dbconnection.Connect(dataSrc),
		User: &User{
			Id:       randomStr(8),
			Name:     user.Name,
			Email:    user.Email,
			Password: encryptPassword([]byte(user.Password)),
		},
	}
}

func (s *Service) RandomStr(n int) string {
	return randomStr(n)
}

func (s *Service) CreateNewUser() error {
	err := s.AttemptInsert()

	if err != nil {
		column, isDup := s.ChkDuplicateEntry(err)
		if !isDup {
			log.Fatal(err)
		}

		// id の被りが無くなるまで繰り返す
		for isDup && column == "id" {
			fmt.Println("A duplicate id was attempted to be inserted")
			s.User.Id = randomStr(8)
			err = s.AttemptInsert()
			column, isDup = s.ChkDuplicateEntry(err)
		}
	}

	return err
}

func (s *Service) AttemptInsert() error {
	_, err := s.DB.NamedExec(`
		INSERT INTO user(
			id,
			name,
			email,
			password
		)
		VALUES(
			:id,
			:name,
			:email,
			:password
		)
	`, s.User)

	return err
}

// DBの一意制約に反するエラーか確認する
func (s *Service) ChkDuplicateEntry(err error) (string, bool) {
	if mysqlErr, ok := err.(*mysql.MySQLError); ok {
		num := mysqlErr.Number
		msg := mysqlErr.Message
		regexId := regexp.MustCompile(`user\.id`)
		regexEmail := regexp.MustCompile(`user\.email`)

		if num != 1062 {
			return "", false
		}

		// 問題になってるカラムを確認する
		var column string
		switch true {
		case regexId.MatchString(msg):
			column = "id"
		case regexEmail.MatchString(msg):
			column = "email"
		default:
			column = ""
		}

		return column, true
	}

	return "", false
}
