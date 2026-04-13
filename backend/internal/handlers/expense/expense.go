package expense

import (
	"backend/internal/models"
	"encoding/json"
	"net/http"
)


func GetAllExpenses(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
}

func GetExpense(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
}

func AddExpense(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
}

func EditExpense(w http.ResponseWriter, r *http.Request) {
	if r.Method != "PUT" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
}

func DeleteExpense(w http.ResponseWriter, r *http.Request) {
	if r.Method != "DELETE" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
}
