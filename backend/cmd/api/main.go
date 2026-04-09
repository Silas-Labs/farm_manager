package main

import (
	"fmt"
	"net/http"

	"backend/internal/handlers/activities"

	"github.com/go-chi/chi/v5"
)

func main() {
	r := chi.NewRouter()
	// Status check
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "API is running 🚀")
	})

	// Activities
	r.Route("/activities", func(r chi.Router) {
		r.Get("/activities", activities.GetAllActivities)
		r.Post("/activities", activities.AddActivity) 
		r.Get("/activities/{id}", activities.GetActivity) 
		r.Put("/activities/{id}", activities.EditActivity) 
		r.Delete("/activities/{id}", activities.DeleteActivity) 
	})
	// Labor

	// Expenses

	// Equipment

	// Crop

	// Analytics

	fmt.Println("Server starting on port 8080")
	http.ListenAndServe(":8080", nil)
}
