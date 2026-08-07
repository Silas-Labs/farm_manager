package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

// Central DB for users
var CentralDB *sql.DB

// UserDBs map to store connections (optional caching)
var UserDBs = make(map[int]*sql.DB)

// InitCentralDB initializes the central users database
func InitCentralDB() error {
	// Create data directory if not exists
	if err := os.MkdirAll("./data", 0755); err != nil {
		return fmt.Errorf("failed to create data directory: %w", err)
	}

	dbPath := "./data/users.db"
	var err error
	CentralDB, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		return fmt.Errorf("failed to open central database: %w", err)
	}

	if err = CentralDB.Ping(); err != nil {
		return fmt.Errorf("failed to ping central database: %w", err)
	}

	log.Println("Central database connected successfully")
	return createCentralTables()
}

func createCentralTables() error {
	query := `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            farm_name TEXT,
            location TEXT,
            db_path TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `
	_, err := CentralDB.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to create users table: %w", err)
	}
	log.Println("Central database tables created/verified")
	return nil
}

// CreateUserDatabase creates a new SQLite database for a user
func CreateUserDatabase(userID int, farmName string) (string, error) {
	dbPath := fmt.Sprintf("./data/farm_%d.db", userID)

	// Check if file already exists
	if _, err := os.Stat(dbPath); err == nil {
		return dbPath, fmt.Errorf("database already exists for user %d", userID)
	}

	// Create new database file
	userDB, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return "", fmt.Errorf("failed to create user database: %w", err)
	}
	defer userDB.Close()

	// Create all tables for the user
	if err := createUserTables(userDB); err != nil {
		return "", err
	}

	log.Printf("Created user database for user %d at %s", userID, dbPath)
	return dbPath, nil
}

func createUserTables(db *sql.DB) error {
	queries := []string{
		// Crops table
		`CREATE TABLE IF NOT EXISTS crops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            brand TEXT,
            variety TEXT,
            duration INTEGER,
            stage TEXT DEFAULT 'Planted',
            planted_date DATE,
            expected_harvest_date DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

		// Equipment table
		`CREATE TABLE IF NOT EXISTS equipment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT,
            model TEXT,
            description TEXT,
            status TEXT DEFAULT 'Working',
            quantity INTEGER DEFAULT 1,
            purchase_date DATE,
            price DECIMAL(10,2),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

		// Labor table
		`CREATE TABLE IF NOT EXISTS labor (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT,
            phone TEXT,
            location TEXT,
            status TEXT DEFAULT 'Active',
            hourly_rate DECIMAL(10,2),
            monthly_salary DECIMAL(10,2),
            start_date DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

		// Expenses table
		`CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category TEXT,
            expense_type TEXT,
            date DATE,
            notes TEXT,
            crop_id INTEGER,
            is_shared_cost INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

		// Harvests table
		`CREATE TABLE IF NOT EXISTS harvests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_id INTEGER,
            crop_name TEXT,
            yield_amount DECIMAL(10,2),
            yield_unit TEXT,
            revenue DECIMAL(10,2),
            harvest_date DATE,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL
        )`,
	}

	for _, query := range queries {
		if _, err := db.Exec(query); err != nil {
			return fmt.Errorf("failed to create user table: %w", err)
		}
	}

	if err := migrateExistingColumns(db); err != nil {
		return err
	}

	log.Println("User database tables created successfully")
	return nil
}

// migrateExistingColumns adds columns introduced after a database already
// exists. Existing records keep their current values (newly added columns get
// their default), so nothing is deleted or silently corrupted.
func migrateExistingColumns(db *sql.DB) error {
	ensureColumn := func(table, column, definition string) error {
		rows, err := db.Query("PRAGMA table_info(" + table + ")")
		if err != nil {
			return err
		}
		defer rows.Close()
		for rows.Next() {
			var cid, notnull, pk int
			var name, ctype string
			var dflt sql.NullString
			if err := rows.Scan(&cid, &name, &ctype, &notnull, &dflt, &pk); err != nil {
				return err
			}
			if name == column {
				return nil
			}
		}
		_, err = db.Exec(fmt.Sprintf("ALTER TABLE %s ADD COLUMN %s", table, definition))
		return err
	}

	if err := ensureColumn("expenses", "crop_id", "crop_id INTEGER"); err != nil {
		return fmt.Errorf("failed to migrate expenses.crop_id: %w", err)
	}
	if err := ensureColumn("expenses", "is_shared_cost", "is_shared_cost INTEGER DEFAULT 0"); err != nil {
		return fmt.Errorf("failed to migrate expenses.is_shared_cost: %w", err)
	}
	return nil
}

// GetUserDB gets or creates a connection to a user's database
func GetUserDB(userID int) (*sql.DB, error) {
	// Check cache first
	if db, exists := UserDBs[userID]; exists {
		return db, nil
	}

	// Get user's db_path from central DB
	var dbPath string
	query := `SELECT db_path FROM users WHERE id = ?`
	err := CentralDB.QueryRow(query, userID).Scan(&dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to get user database path: %w", err)
	}

	// Open the database
	userDB, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open user database: %w", err)
	}

	if err := userDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping user database: %w", err)
	}

	// Ensure tables + any missing columns exist (idempotent, also migrates
	// databases created before new columns were introduced).
	if err := createUserTables(userDB); err != nil {
		return nil, err
	}

	// Cache the connection
	UserDBs[userID] = userDB
	return userDB, nil
}

// CloseUserDB closes a user's database connection
func CloseUserDB(userID int) {
	if db, exists := UserDBs[userID]; exists {
		db.Close()
		delete(UserDBs, userID)
	}
}

// CloseAllUserDBs closes all cached user database connections
func CloseAllUserDBs() {
	for userID, db := range UserDBs {
		db.Close()
		delete(UserDBs, userID)
	}
}

// CloseCentralDB closes the central database
func CloseCentralDB() {
	if CentralDB != nil {
		CentralDB.Close()
	}
}
