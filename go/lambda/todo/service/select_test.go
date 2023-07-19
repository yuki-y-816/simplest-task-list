package service

import (
	"reflect"
	"testing"

	"github.com/jmoiron/sqlx"
)

func TestDB_createWhereClause(t *testing.T) {
	type args struct {
		item *Item
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			"userId 指定",
			args{
				item: &Item{UserId: "8n3CeEjw"},
			},
			"AND user_id = :user_id",
		},
		{
			"指定なし",
			args{
				item: &Item{},
			},
			"",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			d, _ := sqlx.Open("txdb", getDns())
			defer d.Close()

			db := DB{d}

			if got := db.createWhereClause(tt.args.item); got != tt.want {
				t.Errorf("DB.createWhereClause() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestDB_SelectTodoItems(t *testing.T) {
	var todoItems TodoItems
	type args struct {
		item *Item
	}
	tests := []struct {
		name    string
		args    args
		want    TodoItems
		wantErr bool
	}{
		{
			"絞り込み条件なし",
			args{
				item: &Item{},
			},
			todoItems,
			true,
		},
		{
			"userId 指定",
			args{
				item: &Item{UserId: "8n3CeEjw"},
			},
			append(
				todoItems,
				Item{
					Id:        1,
					UserId:    "8n3CeEjw",
					Task:      "this is test task",
					UpdatedAt: "2023-07-07 07:07:07",
				},
			),
			false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			d, _ := sqlx.Open("txdb", getDns())
			defer d.Close()

			db := DB{d}

			got, err := db.SelectTodoItems(tt.args.item)
			if (err != nil) != tt.wantErr {
				t.Errorf("DB.SelectTodoItems() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("DB.SelectTodoItems() = %v, want %v", got, tt.want)
			}
		})
	}
}
