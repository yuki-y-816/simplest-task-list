package data

import (
	"testing"

	"github.com/DATA-DOG/go-txdb"
)

func TestMain(m *testing.M) {
	txdb.Register("txdb", "mysql", "operator:pass@tcp(host.docker.internal:3306)/todo")

	m.Run()
}
