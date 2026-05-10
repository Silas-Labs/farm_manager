package models

import "time"

type Crop struct {
	ID                  int       `json:"id"`
	UserID              int       `json:"user_id"`
	Name                string    `json:"name"`
	Brand               string    `json:"brand"`
	Variety             string    `json:"variety"`
	Duration            int       `json:"duration"`
	Stage               string    `json:"stage"`
	PlantedDate         time.Time `json:"planted_date"`
	ExpectedHarvestDate time.Time `json:"expected_harvest_date"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}
