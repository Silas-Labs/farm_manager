package repository

import (
    "database/sql"
    "backend/internal/models"
    "fmt"
    "time"
)

// ==================== USER REPOSITORY ====================
type UserRepository struct {
    db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
    return &UserRepository{db: db}
}

// Change the Create method to not require db_path initially
func (r *UserRepository) Create(user *models.User) error {
    query := `INSERT INTO users (name, email, password_hash, farm_name, location, role, db_path)
              VALUES (?, ?, ?, ?, ?, ?, ?)
              RETURNING id, created_at, updated_at`
    
    // Use empty string as placeholder, will be updated later
    return r.db.QueryRow(query, user.Name, user.Email, user.PasswordHash,
        user.FarmName, user.Location, user.Role, "").
        Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
    query := `SELECT id, name, email, password_hash, farm_name, location, role, db_path, created_at, updated_at
              FROM users WHERE email = ?`
    
    var user models.User
    err := r.db.QueryRow(query, email).Scan(
        &user.ID, &user.Name, &user.Email, &user.PasswordHash,
        &user.FarmName, &user.Location, &user.Role, &user.DBPath,
        &user.CreatedAt, &user.UpdatedAt)
    
    if err == sql.ErrNoRows {
        return nil, nil
    }
    return &user, err
}

func (r *UserRepository) FindByID(id int) (*models.User, error) {
    query := `SELECT id, name, email, farm_name, location, role, db_path, created_at, updated_at
              FROM users WHERE id = ?`
    
    var user models.User
    err := r.db.QueryRow(query, id).Scan(
        &user.ID, &user.Name, &user.Email,
        &user.FarmName, &user.Location, &user.Role, &user.DBPath,
        &user.CreatedAt, &user.UpdatedAt)
    
    if err == sql.ErrNoRows {
        return nil, nil
    }
    return &user, err
}

func (r *UserRepository) UpdateDBPath(id int, dbPath string) error {
    query := `UPDATE users SET db_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING updated_at`
    var updatedAt time.Time
    err := r.db.QueryRow(query, dbPath, id).Scan(&updatedAt)
    return err
}

func (r *UserRepository) Delete(id int) error {
    query := `DELETE FROM users WHERE id = ?`
    result, err := r.db.Exec(query, id)
    if err != nil {
        return err
    }
    
    rowsAffected, _ := result.RowsAffected()
    if rowsAffected == 0 {
        return fmt.Errorf("user not found")
    }
    return nil
}

// ==================== CROP REPOSITORY ====================
type CropRepository struct {
    db *sql.DB
}

func NewCropRepository(db *sql.DB) *CropRepository {
    return &CropRepository{db: db}
}

func (r *CropRepository) Create(crop *models.Crop) error {
    query := `INSERT INTO crops (name, brand, variety, duration, stage, planted_date, expected_harvest_date)
              VALUES (?, ?, ?, ?, ?, ?, ?)
              RETURNING id, created_at, updated_at`
    
    return r.db.QueryRow(query, crop.Name, crop.Brand, crop.Variety,
        crop.Duration, crop.Stage, crop.PlantedDate, crop.ExpectedHarvestDate).
        Scan(&crop.ID, &crop.CreatedAt, &crop.UpdatedAt)
}

func (r *CropRepository) GetAll() ([]models.Crop, error) {
    query := `SELECT id, name, brand, variety, duration, stage, planted_date, expected_harvest_date, created_at, updated_at
              FROM crops ORDER BY created_at DESC`
    
    rows, err := r.db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var crops []models.Crop
    for rows.Next() {
        var c models.Crop
        err := rows.Scan(&c.ID, &c.Name, &c.Brand, &c.Variety,
            &c.Duration, &c.Stage, &c.PlantedDate, &c.ExpectedHarvestDate,
            &c.CreatedAt, &c.UpdatedAt)
        if err != nil {
            return nil, err
        }
        crops = append(crops, c)
    }
    return crops, nil
}

func (r *CropRepository) GetByID(id int) (*models.Crop, error) {
    query := `SELECT id, name, brand, variety, duration, stage, planted_date, expected_harvest_date, created_at, updated_at
              FROM crops WHERE id = ?`
    
    var c models.Crop
    err := r.db.QueryRow(query, id).Scan(
        &c.ID, &c.Name, &c.Brand, &c.Variety,
        &c.Duration, &c.Stage, &c.PlantedDate, &c.ExpectedHarvestDate,
        &c.CreatedAt, &c.UpdatedAt)
    
    if err == sql.ErrNoRows {
        return nil, nil
    }
    return &c, err
}

func (r *CropRepository) Update(crop *models.Crop) error {
    query := `UPDATE crops SET name=?, brand=?, variety=?, duration=?, stage=?, planted_date=?, expected_harvest_date=?, updated_at=CURRENT_TIMESTAMP
              WHERE id=? RETURNING updated_at`
    
    return r.db.QueryRow(query, crop.Name, crop.Brand, crop.Variety,
        crop.Duration, crop.Stage, crop.PlantedDate, crop.ExpectedHarvestDate,
        crop.ID).Scan(&crop.UpdatedAt)
}

func (r *CropRepository) Delete(id int) error {
    query := `DELETE FROM crops WHERE id = ?`
    result, err := r.db.Exec(query, id)
    if err != nil {
        return err
    }
    
    rowsAffected, _ := result.RowsAffected()
    if rowsAffected == 0 {
        return fmt.Errorf("crop not found")
    }
    return nil
}

func (r *CropRepository) GetStats() (map[string]interface{}, error) {
    query := `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN stage = 'Planted' THEN 1 ELSE 0 END) as planted,
            SUM(CASE WHEN stage = 'Growing' THEN 1 ELSE 0 END) as growing,
            SUM(CASE WHEN stage = 'Ready to Harvest' THEN 1 ELSE 0 END) as ready_to_harvest,
            SUM(CASE WHEN stage = 'Harvested' THEN 1 ELSE 0 END) as harvested
        FROM crops
    `
    var total, planted, growing, readyToHarvest, harvested int
    err := r.db.QueryRow(query).Scan(&total, &planted, &growing, &readyToHarvest, &harvested)
    if err != nil {
        return nil, err
    }
    
    return map[string]interface{}{
        "total": total,
        "planted": planted,
        "growing": growing,
        "ready_to_harvest": readyToHarvest,
        "harvested": harvested,
    }, nil
}

// ==================== EQUIPMENT REPOSITORY ====================
type EquipmentRepository struct {
    db *sql.DB
}

func NewEquipmentRepository(db *sql.DB) *EquipmentRepository {
    return &EquipmentRepository{db: db}
}

func (r *EquipmentRepository) Create(eq *models.Equipment) error {
    query := `INSERT INTO equipment (name, type, model, description, status, quantity, purchase_date, price)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              RETURNING id, created_at, updated_at`
    
    return r.db.QueryRow(query, eq.Name, eq.Type, eq.Model, eq.Description,
        eq.Status, eq.Quantity, eq.PurchaseDate, eq.Price).
        Scan(&eq.ID, &eq.CreatedAt, &eq.UpdatedAt)
}

func (r *EquipmentRepository) GetAll() ([]models.Equipment, error) {
    query := `SELECT id, name, type, model, description, status, quantity, purchase_date, price, created_at, updated_at
              FROM equipment ORDER BY created_at DESC`
    
    rows, err := r.db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var items []models.Equipment
    for rows.Next() {
        var e models.Equipment
        err := rows.Scan(&e.ID, &e.Name, &e.Type, &e.Model, &e.Description,
            &e.Status, &e.Quantity, &e.PurchaseDate, &e.Price, &e.CreatedAt, &e.UpdatedAt)
        if err != nil {
            return nil, err
        }
        items = append(items, e)
    }
    return items, nil
}

func (r *EquipmentRepository) GetByID(id int) (*models.Equipment, error) {
    query := `SELECT id, name, type, model, description, status, quantity, purchase_date, price, created_at, updated_at
              FROM equipment WHERE id = ?`
    
    var e models.Equipment
    err := r.db.QueryRow(query, id).Scan(
        &e.ID, &e.Name, &e.Type, &e.Model, &e.Description,
        &e.Status, &e.Quantity, &e.PurchaseDate, &e.Price, &e.CreatedAt, &e.UpdatedAt)
    
    if err == sql.ErrNoRows {
        return nil, nil
    }
    return &e, err
}

func (r *EquipmentRepository) Update(eq *models.Equipment) error {
    query := `UPDATE equipment SET name=?, type=?, model=?, description=?, status=?, quantity=?, purchase_date=?, price=?, updated_at=CURRENT_TIMESTAMP
              WHERE id=? RETURNING updated_at`
    
    return r.db.QueryRow(query, eq.Name, eq.Type, eq.Model, eq.Description,
        eq.Status, eq.Quantity, eq.PurchaseDate, eq.Price, eq.ID).
        Scan(&eq.UpdatedAt)
}

func (r *EquipmentRepository) Delete(id int) error {
    query := `DELETE FROM equipment WHERE id = ?`
    result, err := r.db.Exec(query, id)
    if err != nil {
        return err
    }
    
    rowsAffected, _ := result.RowsAffected()
    if rowsAffected == 0 {
        return fmt.Errorf("equipment not found")
    }
    return nil
}

// ==================== LABOR REPOSITORY ====================
type LaborRepository struct {
    db *sql.DB
}

func NewLaborRepository(db *sql.DB) *LaborRepository {
    return &LaborRepository{db: db}
}

func (r *LaborRepository) Create(labor *models.Labor) error {
    query := `INSERT INTO labor (name, role, phone, location, status, hourly_rate, monthly_salary, start_date)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              RETURNING id, created_at, updated_at`
    
    return r.db.QueryRow(query, labor.Name, labor.Role, labor.Phone,
        labor.Location, labor.Status, labor.HourlyRate, labor.MonthlySalary, labor.StartDate).
        Scan(&labor.ID, &labor.CreatedAt, &labor.UpdatedAt)
}

func (r *LaborRepository) GetAll() ([]models.Labor, error) {
    query := `SELECT id, name, role, phone, location, status, hourly_rate, monthly_salary, start_date, created_at, updated_at
              FROM labor ORDER BY created_at DESC`
    
    rows, err := r.db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var laborList []models.Labor
    for rows.Next() {
        var l models.Labor
        err := rows.Scan(&l.ID, &l.Name, &l.Role, &l.Phone, &l.Location,
            &l.Status, &l.HourlyRate, &l.MonthlySalary, &l.StartDate, &l.CreatedAt, &l.UpdatedAt)
        if err != nil {
            return nil, err
        }
        laborList = append(laborList, l)
    }
    return laborList, nil
}

func (r *LaborRepository) GetByID(id int) (*models.Labor, error) {
    query := `SELECT id, name, role, phone, location, status, hourly_rate, monthly_salary, start_date, created_at, updated_at
              FROM labor WHERE id = ?`
    
    var l models.Labor
    err := r.db.QueryRow(query, id).Scan(
        &l.ID, &l.Name, &l.Role, &l.Phone, &l.Location,
        &l.Status, &l.HourlyRate, &l.MonthlySalary, &l.StartDate, &l.CreatedAt, &l.UpdatedAt)
    
    if err == sql.ErrNoRows {
        return nil, nil
    }
    return &l, err
}

func (r *LaborRepository) Update(labor *models.Labor) error {
    query := `UPDATE labor SET name=?, role=?, phone=?, location=?, status=?, hourly_rate=?, monthly_salary=?, start_date=?, updated_at=CURRENT_TIMESTAMP
              WHERE id=? RETURNING updated_at`
    
    return r.db.QueryRow(query, labor.Name, labor.Role, labor.Phone, labor.Location,
        labor.Status, labor.HourlyRate, labor.MonthlySalary, labor.StartDate,
        labor.ID).Scan(&labor.UpdatedAt)
}

func (r *LaborRepository) Delete(id int) error {
    query := `DELETE FROM labor WHERE id = ?`
    result, err := r.db.Exec(query, id)
    if err != nil {
        return err
    }
    
    rowsAffected, _ := result.RowsAffected()
    if rowsAffected == 0 {
        return fmt.Errorf("labor not found")
    }
    return nil
}

// ==================== EXPENSE REPOSITORY ====================
type ExpenseRepository struct {
    db *sql.DB
}

func NewExpenseRepository(db *sql.DB) *ExpenseRepository {
    return &ExpenseRepository{db: db}
}

func (r *ExpenseRepository) Create(expense *models.Expense) error {
    query := `INSERT INTO expenses (title, amount, category, expense_type, date, notes)
              VALUES (?, ?, ?, ?, ?, ?)
              RETURNING id, created_at`
    
    return r.db.QueryRow(query, expense.Title, expense.Amount,
        expense.Category, expense.ExpenseType, expense.Date, expense.Notes).
        Scan(&expense.ID, &expense.CreatedAt)
}

func (r *ExpenseRepository) GetAll() ([]models.Expense, error) {
    query := `SELECT id, title, amount, category, expense_type, date, notes, created_at
              FROM expenses ORDER BY date DESC`
    
    rows, err := r.db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var expenses []models.Expense
    for rows.Next() {
        var e models.Expense
        err := rows.Scan(&e.ID, &e.Title, &e.Amount, &e.Category,
            &e.ExpenseType, &e.Date, &e.Notes, &e.CreatedAt)
        if err != nil {
            return nil, err
        }
        expenses = append(expenses, e)
    }
    return expenses, nil
}

func (r *ExpenseRepository) GetByID(id int) (*models.Expense, error) {
    query := `SELECT id, title, amount, category, expense_type, date, notes, created_at
              FROM expenses WHERE id = ?`
    
    var e models.Expense
    err := r.db.QueryRow(query, id).Scan(
        &e.ID, &e.Title, &e.Amount, &e.Category,
        &e.ExpenseType, &e.Date, &e.Notes, &e.CreatedAt)
    
    if err == sql.ErrNoRows {
        return nil, nil
    }
    return &e, err
}

func (r *ExpenseRepository) Update(expense *models.Expense) error {
    query := `UPDATE expenses SET title=?, amount=?, category=?, expense_type=?, date=?, notes=?
              WHERE id=?`
    
    _, err := r.db.Exec(query, expense.Title, expense.Amount, expense.Category,
        expense.ExpenseType, expense.Date, expense.Notes, expense.ID)
    return err
}

func (r *ExpenseRepository) Delete(id int) error {
    query := `DELETE FROM expenses WHERE id = ?`
    result, err := r.db.Exec(query, id)
    if err != nil {
        return err
    }
    
    rowsAffected, _ := result.RowsAffected()
    if rowsAffected == 0 {
        return fmt.Errorf("expense not found")
    }
    return nil
}

// ==================== HARVEST REPOSITORY ====================
type HarvestRepository struct {
    db *sql.DB
}

func NewHarvestRepository(db *sql.DB) *HarvestRepository {
    return &HarvestRepository{db: db}
}

func (r *HarvestRepository) Create(harvest *models.Harvest) error {
    query := `INSERT INTO harvests (crop_id, crop_name, yield_amount, yield_unit, revenue, harvest_date, notes)
              VALUES (?, ?, ?, ?, ?, ?, ?)
              RETURNING id, created_at`
    
    return r.db.QueryRow(query, harvest.CropID, harvest.CropName,
        harvest.Yield, harvest.Unit, harvest.Revenue, harvest.HarvestDate, harvest.Notes).
        Scan(&harvest.ID, &harvest.CreatedAt)
}

func (r *HarvestRepository) GetAll() ([]models.Harvest, error) {
    query := `SELECT id, crop_id, crop_name, yield_amount, yield_unit, revenue, harvest_date, notes, created_at
              FROM harvests ORDER BY harvest_date DESC`
    
    rows, err := r.db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var harvests []models.Harvest
    for rows.Next() {
        var h models.Harvest
        err := rows.Scan(&h.ID, &h.CropID, &h.CropName, &h.Yield,
            &h.Unit, &h.Revenue, &h.HarvestDate, &h.Notes, &h.CreatedAt)
        if err != nil {
            return nil, err
        }
        harvests = append(harvests, h)
    }
    return harvests, nil
}

func (r *HarvestRepository) GetByID(id int) (*models.Harvest, error) {
    query := `SELECT id, crop_id, crop_name, yield_amount, yield_unit, revenue, harvest_date, notes, created_at
              FROM harvests WHERE id = ?`
    
    var h models.Harvest
    err := r.db.QueryRow(query, id).Scan(
        &h.ID, &h.CropID, &h.CropName, &h.Yield,
        &h.Unit, &h.Revenue, &h.HarvestDate, &h.Notes, &h.CreatedAt)
    
    if err == sql.ErrNoRows {
        return nil, nil
    }
    return &h, err
}

func (r *HarvestRepository) Update(harvest *models.Harvest) error {
    query := `UPDATE harvests SET crop_id=?, crop_name=?, yield_amount=?, yield_unit=?, revenue=?, harvest_date=?, notes=?
              WHERE id=?`
    
    _, err := r.db.Exec(query, harvest.CropID, harvest.CropName, harvest.Yield,
        harvest.Unit, harvest.Revenue, harvest.HarvestDate, harvest.Notes,
        harvest.ID)
    return err
}

func (r *HarvestRepository) Delete(id int) error {
    query := `DELETE FROM harvests WHERE id = ?`
    result, err := r.db.Exec(query, id)
    if err != nil {
        return err
    }
    
    rowsAffected, _ := result.RowsAffected()
    if rowsAffected == 0 {
        return fmt.Errorf("harvest not found")
    }
    return nil
}

func (r *HarvestRepository) GetStats() (map[string]interface{}, error) {
    harvests, err := r.GetAll()
    if err != nil {
        return nil, err
    }

    totalYield := 0.0
    totalRevenue := 0.0

    for _, h := range harvests {
        totalYield += h.Yield
        totalRevenue += h.Revenue
    }

    return map[string]interface{}{
        "total_harvests": len(harvests),
        "total_yield":    totalYield,
        "total_revenue":  totalRevenue,
        "avg_yield": func() float64 {
            if len(harvests) > 0 {
                return totalYield / float64(len(harvests))
            }
            return 0
        }(),
        "avg_revenue": func() float64 {
            if len(harvests) > 0 {
                return totalRevenue / float64(len(harvests))
            }
            return 0
        }(),
    }, nil
}