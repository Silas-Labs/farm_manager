// Project: Farm Manager | Module: service.go
package service

import (
	"backend/internal/models"
	"backend/internal/repository"
	"errors"
)

type CropService struct {
	cropRepo *repository.CropRepository
}

func NewCropService(cropRepo *repository.CropRepository) *CropService {
	return &CropService{cropRepo: cropRepo}
}

func (s *CropService) Create(userID int, req *models.CropRequest) (*models.Crop, error) {
	crop := &models.Crop{
		UserID:              userID,
		Name:                req.Name,
		Brand:               req.Brand,
		Variety:             req.Variety,
		Duration:            req.Duration,
		Stage:               "Planted",
		PlantedDate:         req.PlantedDate,
		ExpectedHarvestDate: req.PlantedDate.AddDate(0, req.Duration, 0),
	}

	if err := s.cropRepo.Create(crop); err != nil {
		return nil, err
	}
	return crop, nil
}

func (s *CropService) GetAll(userID int) ([]models.Crop, error) {
	return s.cropRepo.GetAll(userID)
}

func (s *CropService) GetByID(id, userID int) (*models.Crop, error) {
	return s.cropRepo.GetByID(id, userID)
}

func (s *CropService) Update(id, userID int, req *models.CropRequest) (*models.Crop, error) {
	crop, err := s.cropRepo.GetByID(id, userID)
	if err != nil {
		return nil, err
	}
	if crop == nil {
		return nil, errors.New("crop not found")
	}

	crop.Name = req.Name
	crop.Brand = req.Brand
	crop.Variety = req.Variety
	crop.Duration = req.Duration
	crop.PlantedDate = req.PlantedDate
	crop.ExpectedHarvestDate = req.PlantedDate.AddDate(0, req.Duration, 0)

	if err := s.cropRepo.Update(crop); err != nil {
		return nil, err
	}
	return crop, nil
}

func (s *CropService) Delete(id, userID int) error {
	return s.cropRepo.Delete(id, userID)
}

func (s *CropService) GetStats(userID int) (map[string]interface{}, error) {
	return s.cropRepo.GetStats(userID)
}

// Equipment Service

type EquipmentService struct {
	equipmentRepo *repository.EquipmentRepository
}

// Add this constructor function
func NewEquipmentService(equipmentRepo *repository.EquipmentRepository) *EquipmentService {
	return &EquipmentService{
		equipmentRepo: equipmentRepo,
	}
}

func (s *EquipmentService) Create(userID int, req *models.EquipmentRequest) (*models.Equipment, error) {
	equipment := &models.Equipment{
		UserID:       userID,
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

func (s *EquipmentService) GetAll(userID int) ([]models.Equipment, error) {
	return s.equipmentRepo.GetAll(userID)
}

func (s *EquipmentService) GetByID(id, userID int) (*models.Equipment, error) {
	return s.equipmentRepo.GetByID(id, userID)
}

func (s *EquipmentService) Update(id, userID int, req *models.EquipmentRequest) (*models.Equipment, error) {
	equipment, err := s.equipmentRepo.GetByID(id, userID)
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

func (s *EquipmentService) Delete(id, userID int) error {
	return s.equipmentRepo.Delete(id, userID)
}

// Add stats method if needed
func (s *EquipmentService) GetStats(userID int) (map[string]interface{}, error) {
	equipment, err := s.equipmentRepo.GetAll(userID)
	if err != nil {
		return nil, err
	}

	stats := map[string]interface{}{
		"total":       len(equipment),
		"working":     0,
		"maintenance": 0,
		"broken":      0,
		"borrowed":    0,
		"total_value": 0.0,
	}

	for _, e := range equipment {
		switch e.Status {
		case "Working":
			stats["working"] = stats["working"].(int) + 1
		case "Maintenance":
			stats["maintenance"] = stats["maintenance"].(int) + 1
		case "Broken":
			stats["broken"] = stats["broken"].(int) + 1
		case "Borrowed":
			stats["borrowed"] = stats["borrowed"].(int) + 1
		}
		stats["total_value"] = stats["total_value"].(float64) + (e.Price * float64(e.Quantity))
	}

	return stats, nil
}
