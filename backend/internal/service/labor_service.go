package service

import (
    "errors"
    "backend/internal/models"
    "backend/internal/repository"
)

type LaborService struct {
    laborRepo *repository.LaborRepository
}

func NewLaborService(laborRepo *repository.LaborRepository) *LaborService {
    return &LaborService{laborRepo: laborRepo}
}

func (s *LaborService) Create(req *models.LaborRequest) (*models.Labor, error) {
    labor := &models.Labor{
        Name:          req.Name,
        Role:          req.Role,
        Phone:         req.Phone,
        Location:      req.Location,
        Status:        req.Status,
        HourlyRate:    req.HourlyRate,
        MonthlySalary: req.MonthlySalary,
        StartDate:     req.StartDate,
    }

    if labor.Status == "" {
        labor.Status = "Active"
    }

    if err := s.laborRepo.Create(labor); err != nil {
        return nil, err
    }
    return labor, nil
}

func (s *LaborService) GetAll() ([]models.Labor, error) {
    return s.laborRepo.GetAll()
}

func (s *LaborService) GetByID(id int) (*models.Labor, error) {
    return s.laborRepo.GetByID(id)
}

func (s *LaborService) Update(id int, req *models.LaborRequest) (*models.Labor, error) {
    labor, err := s.laborRepo.GetByID(id)
    if err != nil {
        return nil, err
    }
    if labor == nil {
        return nil, errors.New("labor not found")
    }

    labor.Name = req.Name
    labor.Role = req.Role
    labor.Phone = req.Phone
    labor.Location = req.Location
    labor.Status = req.Status
    labor.HourlyRate = req.HourlyRate
    labor.MonthlySalary = req.MonthlySalary
    labor.StartDate = req.StartDate

    if err := s.laborRepo.Update(labor); err != nil {
        return nil, err
    }
    return labor, nil
}

func (s *LaborService) Delete(id int) error {
    return s.laborRepo.Delete(id)
}

func (s *LaborService) GetStats() (map[string]interface{}, error) {
    labor, err := s.laborRepo.GetAll()
    if err != nil {
        return nil, err
    }

    stats := map[string]interface{}{
        "total":      len(labor),
        "active":     0,
        "on_leave":   0,
        "inactive":   0,
        "total_cost": 0.0,
        "avg_hourly": 0.0,
    }

    totalHourly := 0.0
    for _, l := range labor {
        switch l.Status {
        case "Active":
            stats["active"] = stats["active"].(int) + 1
        case "On Leave":
            stats["on_leave"] = stats["on_leave"].(int) + 1
        case "Inactive":
            stats["inactive"] = stats["inactive"].(int) + 1
        }
        totalHourly += l.HourlyRate
        stats["total_cost"] = stats["total_cost"].(float64) + (l.HourlyRate * 160)
    }

    if len(labor) > 0 {
        stats["avg_hourly"] = totalHourly / float64(len(labor))
    }

    return stats, nil
}