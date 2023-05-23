package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"signup/service"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Input struct {
	User service.User `json:"user"`
}

type Response struct {
	Id string `json:"id"`
}

func HandleRequest(
	cts context.Context,
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	// POST されたパラメータを input に格納
	var input Input
	err := json.Unmarshal([]byte(request.Body), &input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}

	// ユーザー作成用の構造体の準備
	srv := service.New(&input.User)
	defer srv.DB.Close()

	// ユーザー作成
	err = srv.CreateNewUser()
	if err != nil {
		// email の一意制約違反
		if column, isDup := srv.ChkDuplicateEntry(err); isDup && column == "email" {
			fmt.Println("409 error!")
			return events.APIGatewayProxyResponse{
				StatusCode: 409,
			}, err
		}

		log.Fatal(err)
	}

	// 作成したユーザーの id を返す
	response := Response{
		Id: srv.User.Id,
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
