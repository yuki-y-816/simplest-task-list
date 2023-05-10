package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/yuki-y-816/go-utils/dbconnection"

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

	fmt.Println("-------- start --------")
	db := dbconnection.Connect("operator:pass@tcp(host.docker.internal:3306)/todo")
	defer db.Close()

	rows, err2 := db.Query("SELECT * FROM test")
	if err2 != nil {
		log.Fatal(err2)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			id int64
			text string
		)

		if err = rows.Scan(&id, &text); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("id: %d, text: %s\n", id, text)
	}

	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}

	fmt.Println("-------- end --------")

	greeting := Greeting{
		Greeting: fmt.Sprintf("Hello %s!", input.Name),
	}
	jsonBytes, _ := json.Marshal(greeting)
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
