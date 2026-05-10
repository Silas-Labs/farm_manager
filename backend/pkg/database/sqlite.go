// Project: Farm Manager | Module: sqlite.go
package database

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() error {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./farm_manager.db"
	}

	var err error
	DB, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		return err
	}

	if err = DB.Ping(); err != nil {
		return err
	}

	log.Println("SQLite database connected successfully")
	return createTables()
}

func createTables() error {
	queries := []string{
		// Users table
		`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            farm_name TEXT,
            location TEXT,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

		// Crops table
		`CREATE TABLE IF NOT EXISTS crops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            brand TEXT,
            variety TEXT,
            duration INTEGER,
            stage TEXT DEFAULT 'Planted',
            planted_date DATE,
            expected_harvest_date DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

		// Equipment table
		`CREATE TABLE IF NOT EXISTS equipment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            type TEXT,
            model TEXT,
            description TEXT,
            status TEXT DEFAULT 'Working',
            quantity INTEGER DEFAULT 1,
            purchase_date DATE,
            price DECIMAL(10,2),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

		// Labor table
		`CREATE TABLE IF NOT EXISTS labor (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            role TEXT,
            phone TEXT,
            location TEXT,
            status TEXT DEFAULT 'Active',
            hourly_rate DECIMAL(10,2),
            monthly_salary DECIMAL(10,2),
            start_date DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

		// Expenses table
		`CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category TEXT,
            expense_type TEXT,
            date DATE,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

		// Harvests table
		`CREATE TABLE IF NOT EXISTS harvests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            crop_id INTEGER,
            crop_name TEXT,
            yield_amount DECIMAL(10,2),
            yield_unit TEXT,
            revenue DECIMAL(10,2),
            harvest_date DATE,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL
        )`,
	}

	for _, query := range queries {
		if _, err := DB.Exec(query); err != nil {
			return err
		}
	}

	log.Println("Database tables created/verified successfully")
	return nil
}

func CloseDB() {
	if DB != nil {
		DB.Close()
	}
}
