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

	// API Routes
	r.Route("/api/v1", func(r chi.Router) {
		// Public routes
		r.Post("/auth/register", authHandler.Register)
		r.Post("/auth/login", authHandler.Login)

		// Protected routes
		r.Group(func(r chi.Router) {
			r.Use(middleware.AuthMiddleware)

			// Crops
			r.Get("/crops", handler.CropGetAll)
			r.Post("/crops", handler.CropCreate)
			r.Get("/crops/{id}", handler.CropGetByID)
			r.Put("/crops/{id}", handler.CropUpdate)
			r.Delete("/crops/{id}", handler.CropDelete)
			r.Get("/crops/stats/summary", handler.CropGetStats)

			// Equipment
			r.Get("/equipment", handler.EquipmentGetAll)
			r.Post("/equipment", handler.EquipmentCreate)
			r.Get("/equipment/{id}", handler.EquipmentGetByID)
			r.Put("/equipment/{id}", handler.EquipmentUpdate)
			r.Delete("/equipment/{id}", handler.EquipmentDelete)
			r.Get("/equipment/stats/summary", handler.EquipmentGetStats)

			// Labor
			r.Get("/labor", handler.LaborGetAll)
			r.Post("/labor", handler.LaborCreate)
			r.Get("/labor/{id}", handler.LaborGetByID)
			r.Put("/labor/{id}", handler.LaborUpdate)
			r.Delete("/labor/{id}", handler.LaborDelete)
			r.Get("/labor/stats/summary", handler.LaborGetStats)

			// Expenses
			r.Get("/expenses", handler.ExpenseGetAll)
			r.Post("/expenses", handler.ExpenseCreate)
			r.Get("/expenses/{id}", handler.ExpenseGetByID)
			r.Put("/expenses/{id}", handler.ExpenseUpdate)
			r.Delete("/expenses/{id}", handler.ExpenseDelete)
			r.Get("/expenses/stats/summary", handler.ExpenseGetStats)

			// Harvests
			r.Get("/harvests", handler.HarvestGetAll)
			r.Post("/harvests", handler.HarvestCreate)
			r.Get("/harvests/{id}", handler.HarvestGetByID)
			r.Put("/harvests/{id}", handler.HarvestUpdate)
			r.Delete("/harvests/{id}", handler.HarvestDelete)
			r.Get("/harvests/stats/summary", handler.HarvestGetStats)
		})
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
