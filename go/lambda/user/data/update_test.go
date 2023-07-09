package data

import (
	"fmt"
	"testing"

	"github.com/jmoiron/sqlx"
)

func TestDB_UpdateUserInfo(t *testing.T) {
	type args struct {
		filter *Filter
	}
	tests := []struct {
		name       string
		args       args
		wantResult User
		wantErr    error
	}{
		{
			"正しく情報が UPDATE される",
			args{
				filter: &Filter{
					Id: "8n3CeEjw", Name: "somebody", Email: "other@test.com",
				},
			},
			User{
				Id: "8n3CeEjw", Name: "somebody", Email: "other@test.com",
			},
			nil,
		},
		{
			"UPDATE するパラメータがない場合エラーを返す",
			args{
				filter: &Filter{
					Id: "8n3CeEjw", Name: "", Email: "",
				},
			},
			User{
				Id: "8n3CeEjw", Name: "Yuki", Email: "test@test.com",
			},
			fmt.Errorf("no update params"),
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, _ := sqlx.Open("txdb", getDns())
			defer db.Close()

			d := DB{db}

			err := d.UpdateUserInfo(tt.args.filter)
			rows, _ := db.Queryx("SELECT id,name,email FROM user WHERE id = '8n3CeEjw'")
			var user User
			for rows.Next() {
				_ = rows.StructScan(&user)
			}
			if user != tt.wantResult {
				t.Errorf("DB.UpdateUserInfo() update %v, wantResult %v", user, tt.wantResult)
			}
			if err != nil && fmt.Sprintln(err) != fmt.Sprintln(tt.wantErr) {
				t.Errorf("DB.UpdateUserInfo() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestDB_checkFilterEmpty(t *testing.T) {
	type args struct {
		filter *Filter
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{
			"NameもEmailも空文字",
			args{
				filter: &Filter{
					Name: "", Email: "",
				},
			},
			true,
		},
		{
			"NameもEmailも空文字ではない",
			args{
				filter: &Filter{
					Name: "Yuki", Email: "test@test.com",
				},
			},
			false,
		},
		{
			"Nameが空文字ではない",
			args{
				filter: &Filter{
					Name: "Yuki", Email: "",
				},
			},
			false,
		},
		{
			"Emailが空文字ではない",
			args{
				filter: &Filter{
					Name: "", Email: "test@test.com",
				},
			},
			false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, _ := sqlx.Open("txdb", getDns())
			defer db.Close()

			d := DB{db}
			if got := d.checkFilterEmpty(tt.args.filter); got != tt.want {
				t.Errorf("DB.checkFilterEmpty() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestDB_createSetClause(t *testing.T) {
	type args struct {
		filter *Filter
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			"NameもEmailも空",
			args{
				filter: &Filter{
					Name: "", Email: "",
				},
			},
			"",
		},
		{
			"Name指定",
			args{
				filter: &Filter{
					Name: "Yuki", Email: "",
				},
			},
			"name = :name",
		},
		{
			"Email指定",
			args{
				filter: &Filter{
					Name: "", Email: "test@test.com",
				},
			},
			"email = :email",
		},
		{
			"複数指定",
			args{
				filter: &Filter{
					Name: "Yuki", Email: "test@test.com",
				},
			},
			"name = :name,email = :email",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, _ := sqlx.Open("txdb", getDns())
			defer db.Close()

			d := DB{db}
			if got := d.createSetClause(tt.args.filter); got != tt.want {
				t.Errorf("DB.createSetClause() = %v, want %v", got, tt.want)
			}
		})
	}
}
