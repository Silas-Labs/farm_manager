package service

import (
    "errors"
    "backend/internal/models"
    "backend/internal/repository"
)

type HarvestService struct {
    harvestRepo *repository.HarvestRepository
}

func NewHarvestService(harvestRepo *repository.HarvestRepository) *HarvestService {
    return &HarvestService{harvestRepo: harvestRepo}
}

func (s *HarvestService) Create(req *models.HarvestRequest) (*models.Harvest, error) {
    harvest := &models.Harvest{
        CropID:      req.CropID,
        CropName:    req.CropName,
        Yield:       req.Yield,
        Unit:        req.Unit,
        Revenue:     req.Revenue,
        HarvestDate: req.HarvestDate,
        Notes:       req.Notes,
    }

    if err := s.harvestRepo.Create(harvest); err != nil {
        return nil, err
    }
    return harvest, nil
}

func (s *HarvestService) GetAll() ([]models.Harvest, error) {
    return s.harvestRepo.GetAll()
}

func (s *HarvestService) GetByID(id int) (*models.Harvest, error) {
    return s.harvestRepo.GetByID(id)
}

func (s *HarvestService) Update(id int, req *models.HarvestRequest) (*models.Harvest, error) {
    harvest, err := s.harvestRepo.GetByID(id)
    if err != nil {
        return nil, err
    }
    if harvest == nil {
        return nil, errors.New("harvest not found")
    }

    harvest.CropID = req.CropID
    harvest.CropName = req.CropName
    harvest.Yield = req.Yield
    harvest.Unit = req.Unit
    harvest.Revenue = req.Revenue
    harvest.HarvestDate = req.HarvestDate
    harvest.Notes = req.Notes

    if err := s.harvestRepo.Update(harvest); err != nil {
        return nil, err
    }
    return harvest, nil
}

func (s *HarvestService) Delete(id int) error {
    return s.harvestRepo.Delete(id)
}

func (s *HarvestService) GetStats() (map[string]interface{}, error) {
    return s.harvestRepo.GetStats()
}