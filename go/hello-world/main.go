package main

import (
	"encoding/json"
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type MyEvent struct {
	Name string `json:"name"`
}

type Greeting struct {
	str string
}

func HandleRequest(ctx context.Context, name MyEvent) (events.APIGatewayProxyResponse, error) {
	//return fmt.Sprintf("Hello %s!", name.Name), nil
	greeting := Greeting{
		str: fmt.Sprintf("Hello %s!", name.Name),
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
