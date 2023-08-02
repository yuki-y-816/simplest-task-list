package main

import (
	"context"
	"encoding/json"
	"fmt"

	"todo/service"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Input struct {
	Method   string       `json:"method"`
	TodoItem service.Item `json:"todoItem"`
}

func HandleRequest(
	ctx context.Context,
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	var input Input
	var jsonBytes []byte

	err := json.Unmarshal([]byte(request.Body), &input)
	if err != nil {
		return getErrResponse(500, err)
	}

	db := service.NewDB()
	defer db.Close()

	switch input.Method {
	case "select":
		todoItems, err := db.SelectTodoItems(&input.TodoItem)
		if err != nil {
			return getErrResponse(500, err)
		}

		jsonBytes, _ = json.Marshal(todoItems)

	case "create":
		item, err := db.CreateNewTodoItem(&input.TodoItem)
		if err != nil {
			return getErrResponse(500, err)
		}

		jsonBytes, _ = json.Marshal(item)

	default:
		return getErrResponse(400, fmt.Errorf("bad request"))
	}

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

func getErrResponse(status int, err error) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: status,
	}, err
}

func main() {
	lambda.Start(HandleRequest)
}
