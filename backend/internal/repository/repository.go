// Project: Farm Manager | Module: repository.go
package repository

import (
	"backend/internal/models"
	"database/sql"
	"fmt"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) error {
	query := `INSERT INTO users (name, email, password_hash, farm_name, location, role)
              VALUES (?, ?, ?, ?, ?, ?)
              RETURNING id, created_at, updated_at`

	return r.db.QueryRow(query, user.Name, user.Email, user.PasswordHash,
		user.FarmName, user.Location, user.Role).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	query := `SELECT id, name, email, password_hash, farm_name, location, role, created_at, updated_at
              FROM users WHERE email = ?`

	var user models.User
	err := r.db.QueryRow(query, email).Scan(
		&user.ID, &user.Name, &user.Email, &user.PasswordHash,
		&user.FarmName, &user.Location, &user.Role,
		&user.CreatedAt, &user.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &user, err
}

func (r *UserRepository) FindByID(id int) (*models.User, error) {
	query := `SELECT id, name, email, farm_name, location, role, created_at, updated_at
              FROM users WHERE id = ?`

	var user models.User
	err := r.db.QueryRow(query, id).Scan(
		&user.ID, &user.Name, &user.Email,
		&user.FarmName, &user.Location, &user.Role,
		&user.CreatedAt, &user.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &user, err
}

type CropRepository struct {
	db *sql.DB
}

func NewCropRepository(db *sql.DB) *CropRepository {
	return &CropRepository{db: db}
}

func (r *CropRepository) Create(crop *models.Crop) error {
	query := `INSERT INTO crops (user_id, name, brand, variety, duration, stage, planted_date, expected_harvest_date)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              RETURNING id, created_at, updated_at`

	return r.db.QueryRow(query, crop.UserID, crop.Name, crop.Brand, crop.Variety,
		crop.Duration, crop.Stage, crop.PlantedDate, crop.ExpectedHarvestDate).
		Scan(&crop.ID, &crop.CreatedAt, &crop.UpdatedAt)
}

func (r *CropRepository) GetAll(userID int) ([]models.Crop, error) {
	query := `SELECT id, user_id, name, brand, variety, duration, stage, planted_date, expected_harvest_date, created_at, updated_at
              FROM crops WHERE user_id = ? ORDER BY created_at DESC`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var crops []models.Crop
	for rows.Next() {
		var c models.Crop
		err := rows.Scan(&c.ID, &c.UserID, &c.Name, &c.Brand, &c.Variety,
			&c.Duration, &c.Stage, &c.PlantedDate, &c.ExpectedHarvestDate,
			&c.CreatedAt, &c.UpdatedAt)
		if err != nil {
			return nil, err
		}
		crops = append(crops, c)
	}
	return crops, nil
}

func (r *CropRepository) GetByID(id, userID int) (*models.Crop, error) {
	query := `SELECT id, user_id, name, brand, variety, duration, stage, planted_date, expected_harvest_date, created_at, updated_at
              FROM crops WHERE id = ? AND user_id = ?`

	var c models.Crop
	err := r.db.QueryRow(query, id, userID).Scan(
		&c.ID, &c.UserID, &c.Name, &c.Brand, &c.Variety,
		&c.Duration, &c.Stage, &c.PlantedDate, &c.ExpectedHarvestDate,
		&c.CreatedAt, &c.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &c, err
}

func (r *CropRepository) Update(crop *models.Crop) error {
	query := `UPDATE crops SET name=?, brand=?, variety=?, duration=?, stage=?, planted_date=?, expected_harvest_date=?, updated_at=CURRENT_TIMESTAMP
              WHERE id=? AND user_id=? RETURNING updated_at`

	return r.db.QueryRow(query, crop.Name, crop.Brand, crop.Variety,
		crop.Duration, crop.Stage, crop.PlantedDate, crop.ExpectedHarvestDate,
		crop.ID, crop.UserID).Scan(&crop.UpdatedAt)
}

func (r *CropRepository) Delete(id, userID int) error {
	query := `DELETE FROM crops WHERE id = ? AND user_id = ?`
	result, err := r.db.Exec(query, id, userID)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("crop not found")
	}
	return nil
}

func (r *CropRepository) GetStats(userID int) (map[string]interface{}, error) {
	query := `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN stage = 'Planted' THEN 1 ELSE 0 END) as planted,
            SUM(CASE WHEN stage = 'Growing' THEN 1 ELSE 0 END) as growing,
            SUM(CASE WHEN stage = 'Ready to Harvest' THEN 1 ELSE 0 END) as ready_to_harvest,
            SUM(CASE WHEN stage = 'Harvested' THEN 1 ELSE 0 END) as harvested
        FROM crops WHERE user_id = ?
    `
	var total, planted, growing, readyToHarvest, harvested int
	err := r.db.QueryRow(query, userID).Scan(&total, &planted, &growing, &readyToHarvest, &harvested)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"total":            total,
		"planted":          planted,
		"growing":          growing,
		"ready_to_harvest": readyToHarvest,
		"harvested":        harvested,
	}, nil
}

// Equipment Repository
type EquipmentRepository struct {
	db *sql.DB
}

func NewEquipmentRepository(db *sql.DB) *EquipmentRepository {
	return &EquipmentRepository{db: db}
}

func (r *EquipmentRepository) Create(eq *models.Equipment) error {
	query := `INSERT INTO equipment (user_id, name, type, model, description, status, quantity, purchase_date, price)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              RETURNING id, created_at, updated_at`

	return r.db.QueryRow(query, eq.UserID, eq.Name, eq.Type, eq.Model, eq.Description,
		eq.Status, eq.Quantity, eq.PurchaseDate, eq.Price).
		Scan(&eq.ID, &eq.CreatedAt, &eq.UpdatedAt)
}

func (r *EquipmentRepository) GetAll(userID int) ([]models.Equipment, error) {
	query := `SELECT id, user_id, name, type, model, description, status, quantity, purchase_date, price, created_at, updated_at
              FROM equipment WHERE user_id = ? ORDER BY created_at DESC`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.Equipment
	for rows.Next() {
		var e models.Equipment
		err := rows.Scan(&e.ID, &e.UserID, &e.Name, &e.Type, &e.Model, &e.Description,
			&e.Status, &e.Quantity, &e.PurchaseDate, &e.Price, &e.CreatedAt, &e.UpdatedAt)
		if err != nil {
			return nil, err
		}
		items = append(items, e)
	}
	return items, nil
}

func (r *EquipmentRepository) GetByID(id, userID int) (*models.Equipment, error) {
	query := `SELECT id, user_id, name, type, model, description, status, quantity, purchase_date, price, created_at, updated_at
              FROM equipment WHERE id = ? AND user_id = ?`

	var e models.Equipment
	err := r.db.QueryRow(query, id, userID).Scan(
		&e.ID, &e.UserID, &e.Name, &e.Type, &e.Model, &e.Description,
		&e.Status, &e.Quantity, &e.PurchaseDate, &e.Price, &e.CreatedAt, &e.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &e, err
}

func (r *EquipmentRepository) Update(eq *models.Equipment) error {
	query := `UPDATE equipment SET name=?, type=?, model=?, description=?, status=?, quantity=?, purchase_date=?, price=?, updated_at=CURRENT_TIMESTAMP
              WHERE id=? AND user_id=? RETURNING updated_at`

	return r.db.QueryRow(query, eq.Name, eq.Type, eq.Model, eq.Description,
		eq.Status, eq.Quantity, eq.PurchaseDate, eq.Price, eq.ID, eq.UserID).
		Scan(&eq.UpdatedAt)
}

func (r *EquipmentRepository) Delete(id, userID int) error {
	query := `DELETE FROM equipment WHERE id = ? AND user_id = ?`
	result, err := r.db.Exec(query, id, userID)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("equipment not found")
	}
	return nil
}

// Similar repositories for Labor, Expenses, Harvests...
// (I'll provide these in the next message due to length)
