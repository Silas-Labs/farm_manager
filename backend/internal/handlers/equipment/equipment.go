package equipment

import (
	"encoding/json"
	"net/http"

	"backend/internal/models"
)

func GetAllEquipment(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
	response := models.Response{
		Code:    http.StatusOK,
		Message: "Success",
	}
	json.NewEncoder(w).Encode(response)
}

func GetEquipment(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
	response := models.Response{
		Code:    http.StatusOK,
		Message: "Success",
	}
	json.NewEncoder(w).Encode(response)
}

func AddEquipment(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
	response := models.Response{
		Code:    http.StatusOK,
		Message: "Success",
	}
	json.NewEncoder(w).Encode(response)
}

func EditEquipment(w http.ResponseWriter, r *http.Request) {
	if r.Method != "PUT" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
	response := models.Response{
		Code:    http.StatusOK,
		Message: "Success",
	}
	json.NewEncoder(w).Encode(response)
}

func DeleteEquipment(w http.ResponseWriter, r *http.Request) {
	if r.Method != "DELETE" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
	response := models.Response{
		Code:    http.StatusOK,
		Message: "Success",
	}
	json.NewEncoder(w).Encode(response)
}
