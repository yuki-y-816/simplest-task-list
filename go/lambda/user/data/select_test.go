package data

import (
	"log"
	"reflect"
	"testing"

	"github.com/jmoiron/sqlx"
)

func TestService_createWhereClause(t *testing.T) {
	type Args struct {
		filter *Filter
	}

	tests := []struct {
		name string
		args Args
		want string
	}{
		{
			"条件なし",
			Args{
				filter: &Filter{
					Id: "", Name: "", Email: "", Password: "",
				},
			},
			"",
		},
		{
			"id 指定",
			Args{
				filter: &Filter{
					Id: "aaa", Name: "", Email: "", Password: "",
				},
			},
			"AND id = :id",
		},
		{
			"name 指定",
			Args{
				filter: &Filter{
					Id: "", Name: "aaa", Email: "", Password: "",
				},
			},
			"AND name = :name",
		},
		{
			"email 指定",
			Args{
				filter: &Filter{
					Id: "", Name: "", Email: "aaa", Password: "",
				},
			},
			"AND email = :email",
		},
		{
			"複数指定",
			Args{
				filter: &Filter{
					Id: "aaa", Name: "bbb", Email: "ccc", Password: "",
				},
			},
			"AND id = :id AND name = :name AND email = :email",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, err := sqlx.Open("txdb", getDns())
			if err != nil {
				log.Fatal(err)
			}
			defer db.Close()

			d := DB{db}
			if got := d.createWhereClause(tt.args.filter); got != tt.want {
				t.Errorf("Service.createWhereClause() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestService_SelectUserInfo(t *testing.T) {
	type Args struct {
		filter *Filter
	}
	tests := []struct {
		name string
		args Args
		want string
	}{
		{
			"条件なし",
			Args{
				filter: &Filter{
					Id: "", Name: "", Email: "", Password: "",
				},
			},
			"8n3CeEjw",
		},
		{
			"id 指定",
			Args{
				filter: &Filter{
					Id: "8n3CeEjw", Name: "", Email: "", Password: "",
				},
			},
			"8n3CeEjw",
		},
		{
			"name 指定",
			Args{
				filter: &Filter{
					Id: "", Name: "Yuki", Email: "", Password: "",
				},
			},
			"8n3CeEjw",
		},
		{
			"email 指定",
			Args{
				filter: &Filter{
					Id: "", Name: "", Email: "test@test.com", Password: "",
				},
			},
			"8n3CeEjw",
		},
		{
			"結果無し",
			Args{
				filter: &Filter{
					Id: "not-exist", Name: "", Email: "", Password: "",
				},
			},
			"",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, err := sqlx.Open("txdb", "operator:pass@tcp(host.docker.internal:3306)/todo")
			if err != nil {
				log.Fatal("database connection error:", err)
			}
			err = db.Ping()
			if err != nil {
				log.Fatal("ping error to database:", err)
			}
			defer db.Close()

			d := DB{db}
			if got := d.SelectUserInfo(tt.args.filter).Id; !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Service.SelectUserInfo() = %v, want %v", got, tt.want)
			}
		})
	}
}
