// Project: Farm Manager | Module: models.go
package models

import "time"

// User models


type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
	FarmName string `json:"farm_name"`
	Location string `json:"location"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  *User  `json:"user"`
}

// Crop models


type CropRequest struct {
	Name        string    `json:"name"`
	Brand       string    `json:"brand"`
	Variety     string    `json:"variety"`
	Duration    int       `json:"duration"`
	PlantedDate time.Time `json:"planted_date"`
}

// Equipment models


type EquipmentRequest struct {
	Name         string    `json:"name"`
	Type         string    `json:"type"`
	Model        string    `json:"model"`
	Description  string    `json:"description"`
	Status       string    `json:"status"`
	Quantity     int       `json:"quantity"`
	PurchaseDate time.Time `json:"purchase_date"`
	Price        float64   `json:"price"`
}

// Labor models


type LaborRequest struct {
	Name          string    `json:"name"`
	Role          string    `json:"role"`
	Phone         string    `json:"phone"`
	Location      string    `json:"location"`
	Status        string    `json:"status"`
	HourlyRate    float64   `json:"hourly_rate"`
	MonthlySalary float64   `json:"monthly_salary"`
	StartDate     time.Time `json:"start_date"`
}

// Expense models


type ExpenseRequest struct {
	Title       string    `json:"title"`
	Amount      float64   `json:"amount"`
	Category    string    `json:"category"`
	ExpenseType string    `json:"expense_type"`
	Date        time.Time `json:"date"`
	Notes       string    `json:"notes"`
}

// Harvest models
type Harvest struct {
	ID          int       `json:"id"`
	UserID      int       `json:"user_id"`
	CropID      int       `json:"crop_id"`
	CropName    string    `json:"crop_name"`
	Yield       float64   `json:"yield"`
	Unit        string    `json:"unit"`
	Revenue     float64   `json:"revenue"`
	HarvestDate time.Time `json:"harvest_date"`
	Notes       string    `json:"notes"`
	CreatedAt   time.Time `json:"created_at"`
}

type HarvestRequest struct {
	CropID      int       `json:"crop_id"`
	CropName    string    `json:"crop_name"`
	Yield       float64   `json:"yield"`
	Unit        string    `json:"unit"`
	Revenue     float64   `json:"revenue"`
	HarvestDate time.Time `json:"harvest_date"`
	Notes       string    `json:"notes"`
}

// Response models
type ErrorResponse struct {
	Error string `json:"error"`
}

type SuccessResponse struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// EOF: models.go
