package service

import (
	"testing"

	"github.com/jmoiron/sqlx"
)

func TestDB_DeleteTodoItem(t *testing.T) {
	type args struct {
		item *Item
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			"タスクの id がない場合エラーが返る",
			args{
				item: &Item{UserId: "8n3CeEjw"},
			},
			true,
		},
		{
			"タスクの UserId がない場合エラーが返る",
			args{
				item: &Item{Id: 1},
			},
			true,
		},
		{
			"正しくタスクを削除できる",
			args{
				item: &Item{Id: 1, UserId: "8n3CeEjw"},
			},
			false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			d, _ := sqlx.Open("txdb", getDns())
			defer d.Close()

			db := DB{d}

			before := getRowCount(d)

			err := db.DeleteTodoItem(tt.args.item)
			// DELETE が失敗している場合
			if (err != nil) != tt.wantErr {
				t.Errorf("DB.DeleteTodoItem() error = %v, wantErr %v", err, tt.wantErr)

				if after := getRowCount(d); after != before {
					t.Errorf("counted todo_items number want = %v, actual = %v", before, after)
				}
			}

			// DELETE 成功している場合
			if err == nil {
				after := getRowCount(d)
				want := before - 1
				if after != want {
					t.Errorf("counted todo_items number want = %v, actual = %v", want, after)
				}
			}
		})
	}
}

func getRowCount(db *sqlx.DB) int {
	var count int

	_ = db.QueryRow(`
		SELECT
			COUNT(*)
		FROM
			todo_items
		WHERE
			id = 1
			AND user_id = "8n3CeEjw"
	`).Scan(&count)

	return count
}
