package service

import (
    "errors"
    "backend/internal/models"
    "backend/internal/repository"
)

type CropService struct {
    cropRepo *repository.CropRepository
}

func NewCropService(cropRepo *repository.CropRepository) *CropService {
    return &CropService{cropRepo: cropRepo}
}

func (s *CropService) Create(req *models.CropRequest) (*models.Crop, error) {
    crop := &models.Crop{
        Name:               req.Name,
        Brand:              req.Brand,
        Variety:            req.Variety,
        Duration:           req.Duration,
        Stage:              "Planted",
        PlantedDate:        req.PlantedDate,
        ExpectedHarvestDate: req.PlantedDate.AddDate(0, req.Duration, 0),
    }

    if err := s.cropRepo.Create(crop); err != nil {
        return nil, err
    }
    return crop, nil
}

func (s *CropService) GetAll() ([]models.Crop, error) {
    return s.cropRepo.GetAll()
}

func (s *CropService) GetByID(id int) (*models.Crop, error) {
    return s.cropRepo.GetByID(id)
}

func (s *CropService) Update(id int, req *models.CropRequest) (*models.Crop, error) {
    crop, err := s.cropRepo.GetByID(id)
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

func (s *CropService) Delete(id int) error {
    return s.cropRepo.Delete(id)
}

func (s *CropService) GetStats() (map[string]interface{}, error) {
    return s.cropRepo.GetStats()
}