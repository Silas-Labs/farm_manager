package handler

import (
	"backend/internal/middleware"
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/service"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

// Helper to get crop service from request context
func getCropService(r *http.Request) *service.CropService {
	db := middleware.GetUserDB(r)
	repo := repository.NewCropRepository(db)
	return service.NewCropService(repo)
}

func CropGetAll(w http.ResponseWriter, r *http.Request) {
	svc := getCropService(r)
	crops, err := svc.GetAll()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(crops)
}

func CropGetByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: "Invalid crop ID"})
		return
	}

	svc := getCropService(r)
	crop, err := svc.GetByID(id)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(crop)
}

func CropCreate(w http.ResponseWriter, r *http.Request) {
	var req models.CropRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: err.Error()})
		return
	}

	svc := getCropService(r)
	crop, err := svc.Create(&req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(models.SuccessResponse{
		Message: "Crop created successfully",
		Data:    crop,
	})
}

func CropUpdate(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: "Invalid crop ID"})
		return
	}

	var req models.CropRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: err.Error()})
		return
	}

	svc := getCropService(r)
	crop, err := svc.Update(id, &req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.SuccessResponse{
		Message: "Crop updated successfully",
		Data:    crop,
	})
}

func CropDelete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: "Invalid crop ID"})
		return
	}

	svc := getCropService(r)
	if err := svc.Delete(id); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.SuccessResponse{Message: "Crop deleted successfully"})
}

func CropGetStats(w http.ResponseWriter, r *http.Request) {
	svc := getCropService(r)
	stats, err := svc.GetStats()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

type cropProfitability struct {
	CropID   int64   `json:"crop_id"`
	CropName string  `json:"crop_name"`
	Revenue  float64 `json:"revenue"`
	Expenses float64 `json:"expenses"`
	Net      float64 `json:"net"`
	Margin   float64 `json:"margin"`
}

// CropGetProfitability returns a per-crop breakdown of total harvest revenue,
// linked expenses (excluding shared/farm-wide costs), net profit and margin.
func CropGetProfitability(w http.ResponseWriter, r *http.Request) {
	db := middleware.GetUserDB(r)
	if db == nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: "user database unavailable"})
		return
	}

	cropRepo := repository.NewCropRepository(db)
	expenseRepo := repository.NewExpenseRepository(db)
	harvestRepo := repository.NewHarvestRepository(db)

	crops, err := cropRepo.GetAll()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: err.Error()})
		return
	}
	expenses, err := expenseRepo.GetAll()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: err.Error()})
		return
	}
	harvests, err := harvestRepo.GetAll()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ErrorResponse{Error: err.Error()})
		return
	}

	result := make([]cropProfitability, 0, len(crops))
	for _, crop := range crops {
		expenseTotal := 0.0
		for _, e := range expenses {
			if e.CropID != nil && *e.CropID == int64(crop.ID) && !e.IsSharedCost {
				expenseTotal += e.Amount
			}
		}
		revenue := 0.0
		for _, h := range harvests {
			if h.CropID != nil && *h.CropID == int64(crop.ID) {
				revenue += h.Revenue
			}
		}
		net := revenue - expenseTotal
		margin := 0.0
		switch {
		case revenue > 0:
			margin = (net / revenue) * 100
		case expenseTotal > 0:
			margin = -100
		}
		result = append(result, cropProfitability{
			CropID:   int64(crop.ID),
			CropName: crop.Name,
			Revenue:  revenue,
			Expenses: expenseTotal,
			Net:      net,
			Margin:   margin,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
