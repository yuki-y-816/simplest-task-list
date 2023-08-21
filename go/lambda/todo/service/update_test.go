package service

import (
	"testing"

	"github.com/jmoiron/sqlx"
)

type args struct {
	item *Item
}

var cases = []struct {
	situation string
	args      args
}{
	{
		"id が渡されていない場合",
		args{item: &Item{Task: "hello"}},
	},
	{
		"task が渡されていない場合",
		args{item: &Item{Id: 1}},
	},
	{
		"存在しない id が渡されている場合",
		args{item: &Item{Id: 999, Task: "hello"}},
	},
	{
		"正常に処理できた場合",
		args{item: &Item{Id: 1, Task: "hello"}},
	},
}

func TestDB_UpdateTodoItem_Result(t *testing.T) {
	tests := []struct {
		name    string
		args    args
		want    int
		wantErr bool
	}{
		{
			cases[0].situation + "正しいレスポンスが返る",
			cases[0].args,
			400,
			false,
		},
		{
			cases[1].situation + "正しいレスポンスが返る",
			cases[1].args,
			400,
			false,
		},
		{
			cases[2].situation + "正しいレスポンスが返る",
			cases[2].args,
			400,
			false,
		},
		{
			cases[3].situation + "正しいレスポンスが返る",
			cases[3].args,
			204,
			false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			d, _ := sqlx.Open("txdb", getDns())
			defer d.Close()

			db := DB{d}

			got, err := db.UpdateTodoItem(tt.args.item)
			if (err != nil) != tt.wantErr {
				t.Errorf("DB.UpdateTodoItem() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("DB.UpdateTodoItem() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestDB_UpdateTodoItem_DB_Operation(t *testing.T) {
	tests := []struct {
		name string
		args args
		want int
	}{
		{
			cases[0].situation + "DB が更新されない",
			cases[0].args,
			0,
		},
		{
			cases[1].situation + "DB が更新されない",
			cases[1].args,
			0,
		},
		{
			cases[2].situation + "DB が更新されない",
			cases[2].args,
			0,
		},
		{
			cases[3].situation + "DB が更新されている",
			cases[3].args,
			1,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			d, _ := sqlx.Open("txdb", getDns())
			defer d.Close()

			db := DB{d}

			db.UpdateTodoItem(tt.args.item)

			var count int
			row := d.QueryRow(`
				SELECT
					COUNT(*)
				FROM
					todo_items
				WHERE
					task = ?
			`, tt.args.item.Task)

			row.Scan(&count)

			if count != tt.want {
				t.Errorf("after DB.UpdateTodoItem() db count want = %d, actual = %d", tt.want, count)
			}
		})
	}
}
