package main

import (
	"fmt"
	"net/http"

	"backend/internal/handlers/activities"
	"backend/internal/handlers/crop"
	"backend/internal/handlers/equipment"
	"backend/internal/handlers/expense"

	"github.com/go-chi/chi/v5"
)

func main() {
	r := chi.NewRouter()

	// Status check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "API is running 🚀")
	})

	// Test route
	r.Get("/test", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Test route OK")
	})

	// Activities routes
	r.Route("/activity", func(r chi.Router) {
		r.Get("/", activities.GetAllActivities)
		r.Post("/add", activities.AddActivity)
		r.Get("/{id}", activities.GetActivity)
		r.Put("/{id}", activities.EditActivity)
		r.Delete("/{id}", activities.DeleteActivity)
	})

	// Crop routes
	r.Route("/crop", func(r chi.Router) {
		r.Get("/", crop.GetAllCrops)
		r.Post("/", crop.AddCrop)
		r.Get("/{id}", crop.GetCrop)
		r.Put("/{id}", crop.EditCrop)
		r.Delete("/{id}", crop.DeleteCrop)
	})

	// Equipment routes
	r.Route("/equipment", func(r chi.Router) {
		r.Get("/", equipment.GetAllEquipment)
		r.Post("/", equipment.AddEquipment)
		r.Get("/{id}", equipment.GetEquipment)
		r.Put("/{id}", equipment.EditEquipment)
		r.Delete("/{id}", equipment.DeleteEquipment)
	})

	// Expense routes
	r.Route("/expense", func(r chi.Router) {
		r.Get("/", expense.GetAllExpenses)
		r.Post("/", expense.AddExpense)
		r.Get("/{id}", expense.GetExpense)
		r.Put("/{id}", expense.EditExpense)
		r.Delete("/{id}", expense.DeleteExpense)
	})

	fmt.Println("Server starting on port 8080")
	http.ListenAndServe(":8080", r)
}
