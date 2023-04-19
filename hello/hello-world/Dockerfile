FROM golang:1.20.3

WORKDIR /go/src
COPY go.mod go.sum main.go main_test.go ./

RUN go build -o /go/bin

CMD ["hello-world"]
