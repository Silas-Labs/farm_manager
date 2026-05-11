package main

import (
	"backend/internal/handler"
	"backend/internal/middleware"
	"backend/internal/repository"
	"backend/internal/service"
	"backend/pkg/database"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Initialize central database only
	if err := database.InitCentralDB(); err != nil {
		log.Fatal("Failed to connect to central database:", err)
	}
	defer database.CloseCentralDB()
	defer database.CloseAllUserDBs()

	// User repository uses central DB
	userRepo := repository.NewUserRepository(database.CentralDB)

	// Services
	authService := service.NewAuthService(userRepo)

	// Handlers
	authHandler := handler.NewAuthHandler(authService)

	r := chi.NewRouter()

	// Middleware
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			next.ServeHTTP(w, r)
			log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
		})
	})

	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if err := recover(); err != nil {
					log.Printf("panic: %v", err)
					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(`{"error":"Internal server error"}`))
				}
			}()
			next.ServeHTTP(w, r)
		})
	})

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","message":"Farm Manager API is running"}`))
	})

	// Public routes
	r.Post("/api/auth/register", authHandler.Register)
	r.Post("/api/auth/login", authHandler.Login)

	// Protected routes (require authentication)
	r.Group(func(r chi.Router) {
		r.Use(middleware.AuthMiddleware)

		// Crop routes
		r.Get("/api/crops", handler.CropGetAll)
		r.Get("/api/crops/{id}", handler.CropGetByID)
		r.Post("/api/crops", handler.CropCreate)
		r.Put("/api/crops/{id}", handler.CropUpdate)
		r.Delete("/api/crops/{id}", handler.CropDelete)
		r.Get("/api/crops/stats/summary", handler.CropGetStats)

		// Equipment routes
		r.Get("/api/equipment", handler.EquipmentGetAll)
		r.Get("/api/equipment/{id}", handler.EquipmentGetByID)
		r.Post("/api/equipment", handler.EquipmentCreate)
		r.Put("/api/equipment/{id}", handler.EquipmentUpdate)
		r.Delete("/api/equipment/{id}", handler.EquipmentDelete)
		r.Get("/api/equipment/stats/summary", handler.EquipmentGetStats)

		// Labor routes
		r.Get("/api/labor", handler.LaborGetAll)
		r.Get("/api/labor/{id}", handler.LaborGetByID)
		r.Post("/api/labor", handler.LaborCreate)
		r.Put("/api/labor/{id}", handler.LaborUpdate)
		r.Delete("/api/labor/{id}", handler.LaborDelete)
		r.Get("/api/labor/stats/summary", handler.LaborGetStats)

		// Expense routes
		r.Get("/api/expenses", handler.ExpenseGetAll)
		r.Get("/api/expenses/{id}", handler.ExpenseGetByID)
		r.Post("/api/expenses", handler.ExpenseCreate)
		r.Put("/api/expenses/{id}", handler.ExpenseUpdate)
		r.Delete("/api/expenses/{id}", handler.ExpenseDelete)
		r.Get("/api/expenses/stats/summary", handler.ExpenseGetStats)

		// Harvest routes
		r.Get("/api/harvests", handler.HarvestGetAll)
		r.Get("/api/harvests/{id}", handler.HarvestGetByID)
		r.Post("/api/harvests", handler.HarvestCreate)
		r.Put("/api/harvests/{id}", handler.HarvestUpdate)
		r.Delete("/api/harvests/{id}", handler.HarvestDelete)
		r.Get("/api/harvests/stats/summary", handler.HarvestGetStats)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("API available at http://localhost:%s", port)
	log.Printf("Data directory: ./data/")

	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
