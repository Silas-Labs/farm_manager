package service

import (
    "errors"
    "backend/internal/models"
    "backend/internal/repository"
)

type EquipmentService struct {
    equipmentRepo *repository.EquipmentRepository
}

func NewEquipmentService(equipmentRepo *repository.EquipmentRepository) *EquipmentService {
    return &EquipmentService{equipmentRepo: equipmentRepo}
}

func (s *EquipmentService) Create(req *models.EquipmentRequest) (*models.Equipment, error) {
    equipment := &models.Equipment{
        Name:         req.Name,
        Type:         req.Type,
        Model:        req.Model,
        Description:  req.Description,
        Status:       req.Status,
        Quantity:     req.Quantity,
        PurchaseDate: req.PurchaseDate,
        Price:        req.Price,
    }

    if equipment.Status == "" {
        equipment.Status = "Working"
    }

    if err := s.equipmentRepo.Create(equipment); err != nil {
        return nil, err
    }
    return equipment, nil
}

func (s *EquipmentService) GetAll() ([]models.Equipment, error) {
    return s.equipmentRepo.GetAll()
}

func (s *EquipmentService) GetByID(id int) (*models.Equipment, error) {
    return s.equipmentRepo.GetByID(id)
}

func (s *EquipmentService) Update(id int, req *models.EquipmentRequest) (*models.Equipment, error) {
    equipment, err := s.equipmentRepo.GetByID(id)
    if err != nil {
        return nil, err
    }
    if equipment == nil {
        return nil, errors.New("equipment not found")
    }

    equipment.Name = req.Name
    equipment.Type = req.Type
    equipment.Model = req.Model
    equipment.Description = req.Description
    equipment.Status = req.Status
    equipment.Quantity = req.Quantity
    equipment.PurchaseDate = req.PurchaseDate
    equipment.Price = req.Price

    if err := s.equipmentRepo.Update(equipment); err != nil {
        return nil, err
    }
    return equipment, nil
}

func (s *EquipmentService) Delete(id int) error {
    return s.equipmentRepo.Delete(id)
}

func (s *EquipmentService) GetStats() (map[string]interface{}, error) {
    equipment, err := s.equipmentRepo.GetAll()
    if err != nil {
        return nil, err
    }

    stats := map[string]interface{}{
        "total":        len(equipment),
        "working":      0,
        "maintenance":  0,
        "broken":       0,
        "borrowed":     0,
        "total_value":  0.0,
        "utilization":  0.0,
    }

    totalValue := 0.0
    totalUnits := 0
    workingUnits := 0

    for _, e := range equipment {
        switch e.Status {
        case "Working":
            stats["working"] = stats["working"].(int) + e.Quantity
            workingUnits += e.Quantity
        case "Maintenance":
            stats["maintenance"] = stats["maintenance"].(int) + 1
        case "Broken":
            stats["broken"] = stats["broken"].(int) + 1
        case "Borrowed":
            stats["borrowed"] = stats["borrowed"].(int) + 1
        }
        totalValue += e.Price * float64(e.Quantity)
        totalUnits += e.Quantity
    }
    stats["total_value"] = totalValue

    if totalUnits > 0 {
        stats["utilization"] = float64(workingUnits) / float64(totalUnits) * 100
    }

    return stats, nil
}