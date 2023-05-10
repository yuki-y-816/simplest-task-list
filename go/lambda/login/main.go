package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/yuki-y-816/go-utils/dbconnection"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"golang.org/x/crypto/bcrypt"
)

type Input struct {
	Email    string `json:"email" db:"email"`
	Password string `json:"password"`
}

type User struct {
	ID       string `db:"id" json:"id"`
	Name     string `db:"name" json:"name"`
	Email    string `db:"email" json:"email"`
	Password string `db:"password" json:"password"`
}

type ResponseData struct {
	Input Input `json:"input"`
	User  User  `json:"user"`
}

type Response struct {
	Data          ResponseData `json:"data"`
	Authenticated bool         `json:"authenticated"`
}

func HandleRequest(
	ctx context.Context,
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	// POST されてきたパラメータをデコード
	var input Input

	err := json.Unmarshal([]byte(request.Body), &input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}

	// DB に接続
	dataSrc := fmt.Sprintf(
		"%s:%s@tcp(%s)/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_DATABASE"),
	)
	db := dbconnection.Connect(dataSrc)
	defer db.Close()

	// ユーザー情報取得
	rows, err := db.NamedQuery(`
		SELECT
			id,
			name,
			email,
			password
		FROM
			user
		WHERE
			email = :email
		LIMIT
			1
	`, input)

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

	// ユーザー認証
	result := true
	err = bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(input.Password),
	)
	if err != nil {
		result = false
		user = User{}
	}

	// フロントに返すデータ
	response := Response{
		Data: ResponseData{
			Input: input,
			User:  user,
		},
		Authenticated: result,
	}
	jsonBytes, _ := json.Marshal(response)

	return events.APIGatewayProxyResponse{
		Body:       string(jsonBytes),
		StatusCode: 200,
		Headers: map[string]string{
			"Access-Control-Allow-Origin":      "*",
			"Access-Control-Allow-Credentials": "true",
			"Access-Control-Allow-Methods":     "POST, OPTIONS",
			"Access-Control-Allow-Headers":     "Content-Type,X-CSRF-TOKEN",
		},
	}, nil
}

func main() {
	lambda.Start(HandleRequest)
}
