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
	if r.URL.Path == "/activities" {
		switch(r.Method) {
		case "GET":

		case "POST":

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
	
}