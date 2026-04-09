package main

import (
	"fmt"
	"net/http"

	"backend/internal/handlers/activities"
)

func main() {
	// Status check
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "API is running 🚀")
	})

	//Activities
	http.HandleFunc("/activities", activities.ActivitiesHandler) //POST & GET(all)
	http.HandleFunc("/activities/:id", activities.ActivityHandler) // PUT, DELETE & GET(single)

	//Inputs

	//Expenses

	//Revenue

	//Harvest

	//Analytics

	
	fmt.Println("Server starting on port 8080")
	http.ListenAndServe(":8080", nil)
}