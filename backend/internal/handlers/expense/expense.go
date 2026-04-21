package expense

import (
	"encoding/json"
	"net/http"

	"backend/internal/models"
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
	response := models.Response{
		Code:    http.StatusOK,
		Message: "Success",
	}
	json.NewEncoder(w).Encode(response)
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
	response := models.Response{
		Code:    http.StatusOK,
		Message: "Success",
	}
	json.NewEncoder(w).Encode(response)
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

	expense := models.Expense{}
	data := r.Body
	json.NewDecoder(data).Decode(&expense)

	response := models.Response{
		Code:    http.StatusOK,
		Message: "Success",
	}
	json.NewEncoder(w).Encode(response)
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
	response := models.Response{
		Code:    http.StatusOK,
		Message: "Success",
	}
	json.NewEncoder(w).Encode(response)
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
	response := models.Response{
		Code:    http.StatusOK,
		Message: "Success",
	}
	json.NewEncoder(w).Encode(response)
}
