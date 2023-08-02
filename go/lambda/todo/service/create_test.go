package service

import (
	"testing"

	"github.com/jmoiron/sqlx"
)

func TestDB_CreateNewTodoItem(t *testing.T) {
	type args struct {
		item *Item
	}
	addItem := Item{UserId: "8n3CeEjw", Task: "added task in create_test"}

	tests := []struct {
		name    string
		args    args
		want    *Item
		wantErr bool
	}{
		{
			"UserIdやTaskが渡されていない時エラーが返ってくる",
			args{&Item{UserId: "", Task: ""}},
			nil,
			true,
		},
		{
			"正しくデータが追加される",
			args{&addItem},
			&addItem,
			false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			d, _ := sqlx.Open("txdb", getDns())
			defer d.Close()

			db := DB{d}

			got, err := db.CreateNewTodoItem(tt.args.item)
			if (err != nil) != tt.wantErr {
				t.Errorf("DB.CreateNewTodoItem() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != nil && (got.UserId != tt.want.UserId || got.Task != tt.want.Task) {
				t.Errorf("DB.CreateNewTodoItem() = %v, want %v", got, tt.want)
			}
		})
	}
}
