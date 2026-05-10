// Project: Farm Manager | Module: equipment.go
package models

import "time"

type Equipment struct {
	ID           int       `json:"id"`
	UserID       int       `json:"user_id"`
	Name         string    `json:"name"`
	Type         string    `json:"type"`
	Model        string    `json:"model"`
	Description  string    `json:"description"`
	Status       string    `json:"status"`
	Quantity     int       `json:"quantity"`
	PurchaseDate time.Time `json:"purchase_date"`
	Price        float64   `json:"price"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// EOF: equipment.go
