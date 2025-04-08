### ✅ **Allowed commit types:**

You can use any of these as the `<type>` in your commit messages:

```
feat | fix | chore | docs | style | refactor | test | ui
```

---

### ✅ **Allowed scopes:**

You can use any of these as the `<scope>`:

```
auth | button | ui | format
```

---

### ⚠️ **Rules Summary:**

| Rule                 | Description                         | Severity       |
| -------------------- | ----------------------------------- | -------------- |
| `type-enum`          | Only allowed types listed above     | ❌ Error (2)   |
| `scope-enum`         | Only allowed scopes listed above    | ⚠️ Warning (1) |
| `subject-max-length` | Max subject line: **72 characters** | ❌ Error (2)   |
| `scope-case`         | Scope must be **lowercase**         | ❌ Error (2)   |

---

### ✅ **Valid commit example:**

```
feat(ui): add collapsible sidebar component
```
