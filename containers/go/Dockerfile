FROM alpine:3.17 as build
# install build tools
RUN apk add go git
RUN go env -w GOPROXY=direct
# cache dependencies
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
