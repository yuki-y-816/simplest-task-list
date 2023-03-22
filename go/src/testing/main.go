package main

import (
	"io"
	"log"
	"net/http"
)

func main() {
	h1 := func(w http.ResponseWriter, _ *http.Request) {
		io.WriteString(w, "Hello from a HandleFunc #1\n")
	}

	h2 := func(w http.ResponseWriter, _ *http.Request) {
		io.WriteString(w, "Hello from a HandleFunc #2\n")
	}

	http.HandleFunc("/h1", h1)
	http.HandleFunc("/h2", h2)

	log.Fatal(http.ListenAndServe(":80", nil))
}
