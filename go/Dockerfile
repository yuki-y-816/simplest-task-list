### build stage
FROM golang:1.20.3 as build-image
WORKDIR /go/src

# cache common packages
COPY ./lambda/go.mod ./
RUN go mod download

# copy & build go app
COPY ./lambda ./
RUN find . -type d -and -not -name . -exec sh -c '(cd {} && go build -o /go/bin)' ';'

### runtime stage
FROM public.ecr.aws/lambda/go:1

# copy binary
COPY --from=build-image /go/bin/ /var/task/
