package models

import "time"

type Expense struct {
	ID          int       `json:"id"`
	UserID      int       `json:"user_id"`
	Title       string    `json:"title"`
	Amount      float64   `json:"amount"`
	Category    string    `json:"category"`
	ExpenseType string    `json:"expense_type"`
	Date        time.Time `json:"date"`
	Notes       string    `json:"notes"`
	CreatedAt   time.Time `json:"created_at"`
}
