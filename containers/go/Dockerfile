FROM golang:1.20.3-alpine3.17 AS build

# $GOPATH/go.mod exists but should not 回避
ENV GOPATH=

ADD ./go/go.mod ./go/go.sum ./
RUN go mod download
# build
ADD ./go/cmd/ cmd/
RUN go build -o /main cmd/main.go
# copy artifacts to a clean image
FROM alpine:3.17
WORKDIR /
COPY --from=build /main /main
# (Optional) Add Lambda Runtime Interface Emulator and use a script in the ENTRYPOINT for simpler local runs
ADD https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie /usr/bin/aws-lambda-rie
RUN chmod 755 /usr/bin/aws-lambda-rie
COPY ./go/entry.sh /
RUN chmod 755 /entry.sh
ENTRYPOINT [ "/entry.sh" ]
