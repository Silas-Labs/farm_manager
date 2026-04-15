package crop

import (
	"encoding/json"
	"net/http"

	"backend/internal/models"
)

func ActivityHandler(w http.ResponseWriter, r *http.Request) {
	println("URL working")
	println(r.URL.Query().Get("id"))
}

func GetAllCrops(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
	json.NewEncoder(w).Encode({"code":http.StatusOK,"message":"Success"})
}

func GetCrop(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
	json.NewEncoder(w).Encode({"code":http.StatusOK,"message":"Success"})
}

func AddCrop(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
	json.NewEncoder(w).Encode({"code":http.StatusOK,"message":"Success"})
}

func EditCrop(w http.ResponseWriter, r *http.Request) {
	if r.Method != "PUT" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
	json.NewEncoder(w).Encode({"code":http.StatusOK,"message":"Success"})
}

func DeleteCrop(w http.ResponseWriter, r *http.Request) {
	if r.Method != "DELETE" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		error := models.Error{
			Code:    http.StatusMethodNotAllowed,
			Message: "method not allowed",
		}
		json.NewEncoder(w).Encode(error)
	}
	json.NewEncoder(w).Encode({"code":http.StatusOK,"message":"Success"})
}
