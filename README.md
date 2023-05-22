# SimpleToDo

### AWS SAM でのローカル API テスト

```bash
sam build && \
sam local start-api --env-vars local-env.json
```

---

### マイグレーションコマンド

```bash
goose mysql "user:pass@/todo?parseTime=true&multiStatements=true" up
```

参照: [goose](https://github.com/pressly/goose)

---
