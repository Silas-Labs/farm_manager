package database

import (
	"database/sql"
	"strings"
	"testing"
)

// TestCreateUserTablesMigratesLegacyExpenses verifies that calling
// createUserTables on a database whose expenses table predates the
// crop_id / is_shared_cost columns adds those columns without dropping data.
func TestCreateUserTablesMigratesLegacyExpenses(t *testing.T) {
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatalf("open db: %v", err)
	}
	defer db.Close()

	// Simulate a legacy user database created before crop_id was introduced.
	if _, err := db.Exec(`
		CREATE TABLE expenses (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			amount DECIMAL(10,2) NOT NULL,
			category TEXT,
			expense_type TEXT,
			date DATE,
			notes TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`); err != nil {
		t.Fatalf("create legacy expenses: %v", err)
	}
	if _, err := db.Exec(
		`INSERT INTO expenses (title, amount, category) VALUES ('seeds', 100, 'crop')`,
	); err != nil {
		t.Fatalf("seed legacy row: %v", err)
	}

	if err := createUserTables(db); err != nil {
		t.Fatalf("createUserTables failed to migrate: %v", err)
	}

	cols := tableColumns(t, db, "expenses")
	for _, want := range []string{"crop_id", "is_shared_cost"} {
		if !contains(cols, want) {
			t.Errorf("expected column %q after migration, got %v", want, cols)
		}
	}

	// Existing data must be preserved.
	var count int
	if err := db.QueryRow(`SELECT COUNT(*) FROM expenses`).Scan(&count); err != nil {
		t.Fatalf("count: %v", err)
	}
	if count != 1 {
		t.Errorf("expected 1 preserved row, got %d", count)
	}

	// Running again must be idempotent (no duplicate-column error).
	if err := createUserTables(db); err != nil {
		t.Errorf("createUserTables is not idempotent: %v", err)
	}
}

func tableColumns(t *testing.T, db *sql.DB, table string) []string {
	t.Helper()
	rows, err := db.Query("PRAGMA table_info(" + table + ")")
	if err != nil {
		t.Fatalf("pragma: %v", err)
	}
	defer rows.Close()
	var cols []string
	for rows.Next() {
		var cid, notnull, pk int
		var name, ctype string
		var dflt sql.NullString
		if err := rows.Scan(&cid, &name, &ctype, &notnull, &dflt, &pk); err != nil {
			t.Fatalf("scan: %v", err)
		}
		cols = append(cols, name)
	}
	return cols
}

func contains(list []string, want string) bool {
	for _, s := range list {
		if strings.EqualFold(s, want) {
			return true
		}
	}
	return false
}