package service

import (
	"backend/internal/models"
	"backend/internal/repository"
	"errors"
)

// ErrCropIDRequired is returned when a record that must belong to a crop is
// submitted without a crop_id. Handlers map this to HTTP 400.
var ErrCropIDRequired = errors.New("crop_id is required")

type ExpenseService struct {
	expenseRepo *repository.ExpenseRepository
}

func NewExpenseService(expenseRepo *repository.ExpenseRepository) *ExpenseService {
	return &ExpenseService{expenseRepo: expenseRepo}
}

func (s *ExpenseService) Create(req *models.ExpenseRequest) (*models.Expense, error) {
	if req.CropID == nil || *req.CropID <= 0 {
		return nil, ErrCropIDRequired
	}
	if req.Amount < 0 {
		return nil, errors.New("amount cannot be negative")
	}

	expense := &models.Expense{
		Title:       req.Title,
		Amount:      req.Amount,
		Category:    req.Category,
		ExpenseType: req.ExpenseType,
		Date:        req.Date,
		Notes:       req.Notes,
		CropID:      req.CropID,
		IsSharedCost: req.IsSharedCost,
	}

	if err := s.expenseRepo.Create(expense); err != nil {
		return nil, err
	}
	return expense, nil
}

func (s *ExpenseService) GetAll() ([]models.Expense, error) {
	return s.expenseRepo.GetAll()
}

func (s *ExpenseService) GetByID(id int) (*models.Expense, error) {
	return s.expenseRepo.GetByID(id)
}

func (s *ExpenseService) Update(id int, req *models.ExpenseRequest) (*models.Expense, error) {
	expense, err := s.expenseRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if expense == nil {
		return nil, errors.New("expense not found")
	}
	if req.CropID == nil || *req.CropID <= 0 {
		return nil, ErrCropIDRequired
	}

	expense.Title = req.Title
	expense.Amount = req.Amount
	expense.Category = req.Category
	expense.ExpenseType = req.ExpenseType
	expense.Date = req.Date
	expense.Notes = req.Notes
	expense.CropID = req.CropID
	expense.IsSharedCost = req.IsSharedCost

	if err := s.expenseRepo.Update(expense); err != nil {
		return nil, err
	}
	return expense, nil
}

func (s *ExpenseService) Delete(id int) error {
	return s.expenseRepo.Delete(id)
}

func (s *ExpenseService) GetStats() (map[string]interface{}, error) {
	expenses, err := s.expenseRepo.GetAll()
	if err != nil {
		return nil, err
	}

	total := 0.0
	byCategory := make(map[string]float64)

	type expenseItem struct {
		Title  string  `json:"title"`
		Amount float64 `json:"amount"`
	}
	var allExpenses []expenseItem

	for _, e := range expenses {
		total += e.Amount
		byCategory[e.Category] = byCategory[e.Category] + e.Amount
		allExpenses = append(allExpenses, expenseItem{Title: e.Title, Amount: e.Amount})
	}

	// Sort by amount
	for i := 0; i < len(allExpenses)-1; i++ {
		for j := i + 1; j < len(allExpenses); j++ {
			if allExpenses[i].Amount < allExpenses[j].Amount {
				allExpenses[i], allExpenses[j] = allExpenses[j], allExpenses[i]
			}
		}
	}

	topExpenses := allExpenses
	if len(topExpenses) > 5 {
		topExpenses = topExpenses[:5]
	}

	return map[string]interface{}{
		"total":        total,
		"by_category":  byCategory,
		"count":        len(expenses),
		"top_expenses": topExpenses,
	}, nil
}
