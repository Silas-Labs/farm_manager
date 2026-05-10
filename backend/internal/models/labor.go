package models

import "time"

type Labor struct {
	ID            int       `json:"id"`
	UserID        int       `json:"user_id"`
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
