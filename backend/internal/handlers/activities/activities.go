package activities

import (
	"encoding/json"
	"net/http"
)

type Error struct{
	Code int
	Message string
}

func ActivitiesHandler(w http.ResponseWriter, r *http.Request) {
	println("Chekpoint Activity")
	if r.URL.Path == "/activities" {
		switch(r.Method) {
		case "GET":
			w.WriteHeader(http.StatusOK)
			error := Error{
				Code: http.StatusOK,
				Message: "OK",
			}
			json.NewEncoder(w).Encode(error)

		case "POST":
			w.WriteHeader(http.StatusCreated)
			error := Error{
				Code: http.StatusCreated,
				Message: "Created successfully",
			}
			json.NewEncoder(w).Encode(error)

		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
			error := Error{
				Code: http.StatusMethodNotAllowed,
				Message: "method not allowed",
			}
			json.NewEncoder(w).Encode(error)
		}
	}
}

func ActivityHandler(w http.ResponseWriter, r *http.Request){
	println("URL working")
	println(r.URL.Query().Get("id"))
}