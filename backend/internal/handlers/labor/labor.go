package labor

import (
	"encoding/json"
	"fmt"
	"net/http"

	"backend/internal/models"
)

func GetAllLabor(w http.ResponseWriter, r *http.Request) {
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

func GetLabor(w http.ResponseWriter, r *http.Request) {
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

func AddLabor(w http.ResponseWriter, r *http.Request) {
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
	defer r.Body.Close()
	json.NewEncoder(w).Encode(response)
}

func EditLabor(w http.ResponseWriter, r *http.Request) {
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

func DeleteLabor(w http.ResponseWriter, r *http.Request) {
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
