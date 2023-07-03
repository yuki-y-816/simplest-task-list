package main

import (
	"context"
	"encoding/json"

	"user/data"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Input struct {
	Method string      `json:"method"`
	Filter data.Filter `json:"filter"`
}

func HandleRequest(
	ctx context.Context,
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	var input Input
	var user data.User

	err := json.Unmarshal([]byte(request.Body), &input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}

	// service := data.NewService()
	// defer service.Db.Close()
	db := data.NewDB()
	defer db.Close()

	switch input.Method {
	case "select":
		// user = service.SelectUserInfo(&input.Filter)
		user = db.SelectUserInfo(&input.Filter)
	default:
	}

	jsonBytes, _ := json.Marshal(user)

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
