package main

import (
	"encoding/json"
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Input struct {
	Name string `json:"name"`
}

type Greeting struct {
	Greeting string
}

func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	//return fmt.Sprintf("Hello %s!", name.Name), nil
	var input Input
	err := json.Unmarshal([]byte(request.Body), &input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}

	greeting := Greeting{
		Greeting: fmt.Sprintf("Hello %s!", input.Name),
	}
	jsonBytes, _ := json.Marshal(greeting)
	return events.APIGatewayProxyResponse{
        Body:       string(jsonBytes),
        StatusCode: 200,
    }, nil
}

func main() {
	lambda.Start(HandleRequest)
}
