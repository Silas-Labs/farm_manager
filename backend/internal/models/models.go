// Project: Farm Manager | Module: models.go
package models

import "time"


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
	Title        string    `json:"title"`
	Amount       float64   `json:"amount"`
	Category     string    `json:"category"`
	ExpenseType  string    `json:"expense_type"`
	Date         time.Time `json:"date"`
	Notes        string    `json:"notes"`
	CropID       *int64    `json:"crop_id"`
	IsSharedCost bool      `json:"is_shared_cost"`
}


type HarvestRequest struct {
	CropID      *int64    `json:"crop_id"`
	CropName    string    `json:"crop_name"`
	Yield       float64   `json:"yield"`
	Unit        string    `json:"unit"`
	Revenue     float64   `json:"revenue"`
	HarvestDate time.Time `json:"harvest_date"`
	Notes       string    `json:"notes"`
}

// User model for central DB
type User struct {
    ID           int       `json:"id"`
    Name         string    `json:"name"`
    Email        string    `json:"email"`
    PasswordHash string    `json:"-"`
    FarmName     string    `json:"farm_name"`
    Location     string    `json:"location"`
    DBPath       string    `json:"-"`
    Role         string    `json:"role"`
    CreatedAt    time.Time `json:"created_at"`
    UpdatedAt    time.Time `json:"updated_at"`
}

// Crop model - NO user_id
type Crop struct {
    ID                 int       `json:"id"`
    Name               string    `json:"name"`
    Brand              string    `json:"brand"`
    Variety            string    `json:"variety"`
    Duration           int       `json:"duration"`
    Stage              string    `json:"stage"`
    PlantedDate        time.Time `json:"planted_date"`
    ExpectedHarvestDate time.Time `json:"expected_harvest_date"`
    CreatedAt          time.Time `json:"created_at"`
    UpdatedAt          time.Time `json:"updated_at"`
}

// Equipment model - NO user_id
type Equipment struct {
    ID           int       `json:"id"`
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

// Labor model - NO user_id
type Labor struct {
    ID            int       `json:"id"`
    Name          string    `json:"name"`
    Role          string    `json:"role"`
    Phone         string    `json:"phone"`
    Location      string    `json:"location"`
    Status        string    `json:"status"`
    HourlyRate    float64   `json:"hourly_rate"`
    MonthlySalary float64   `json:"monthly_salary"`
    StartDate     time.Time `json:"start_date"`
    CreatedAt     time.Time `json:"created_at"`
    UpdatedAt     time.Time `json:"updated_at"`
}

// Expense model - NO user_id
type Expense struct {
    ID          int       `json:"id"`
    Title       string    `json:"title"`
    Amount      float64   `json:"amount"`
    Category    string    `json:"category"`
    ExpenseType string    `json:"expense_type"`
    Date        time.Time `json:"date"`
    Notes       string    `json:"notes"`
    CropID      *int64    `json:"crop_id"`
    IsSharedCost bool     `json:"is_shared_cost"`
    CreatedAt   time.Time `json:"created_at"`
}

// Harvest model - NO user_id
type Harvest struct {
    ID          int       `json:"id"`
    CropID      *int64    `json:"crop_id"`
    CropName    string    `json:"crop_name"`
    Yield       float64   `json:"yield"`
    Unit        string    `json:"unit"`
    Revenue     float64   `json:"revenue"`
    HarvestDate time.Time `json:"harvest_date"`
    Notes       string    `json:"notes"`
    CreatedAt   time.Time `json:"created_at"`
}

// Request/Response models (unchanged)
type RegisterRequest struct {
    Name     string `json:"name"`
    Email    string `json:"email"`
    Password string `json:"password"`
    FarmName string `json:"farm_name"`
    Location string `json:"location"`
}

type LoginRequest struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}

type LoginResponse struct {
    Token string `json:"token"`
    User  *User  `json:"user"`
}

type ErrorResponse struct {
    Error string `json:"error"`
}

type SuccessResponse struct {
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
}