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
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Initialize database
	if err := database.InitDB(); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.CloseDB()

	// Initialize repositories
	userRepo := repository.NewUserRepository(database.DB)
	cropRepo := repository.NewCropRepository(database.DB)
	equipmentRepo := repository.NewEquipmentRepository(database.DB)

	// Initialize services
	authService := service.NewAuthService(userRepo)
	cropService := service.NewCropService(cropRepo)
	equipmentService := service.NewEquipmentService(equipmentRepo)

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authService)
	cropHandler := handler.NewCropHandler(cropService)
	equipmentHandler := handler.NewEquipmentHandler(equipmentService)

	// Setup router
	r := chi.NewRouter()

	// Custom middleware (replacing chi/middleware)
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			next.ServeHTTP(w, r)
			log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
		})
	})

	// Recoverer middleware (replaces chi/middleware.Recoverer)
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

	// CORS middleware
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

	// Protected routes
	r.Group(func(r chi.Router) {
		r.Use(middleware.AuthMiddleware)

		// Crop routes
		r.Get("/api/crops", cropHandler.GetAll)
		r.Get("/api/crops/{id}", cropHandler.GetByID)
		r.Post("/api/crops", cropHandler.Create)
		r.Put("/api/crops/{id}", cropHandler.Update)
		r.Delete("/api/crops/{id}", cropHandler.Delete)
		r.Get("/api/crops/stats/summary", cropHandler.GetStats)

		// Equipment routes
		r.Get("/api/equipment", equipmentHandler.GetAll)
		r.Get("/api/equipment/{id}", equipmentHandler.GetByID)
		r.Post("/api/equipment", equipmentHandler.Create)
		r.Put("/api/equipment/{id}", equipmentHandler.Update)
		r.Delete("/api/equipment/{id}", equipmentHandler.Delete)
		//r.Get("/api/equipment/stats/summary", equipmentHandler.GetStats)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("API available at http://localhost:%s", port)
	log.Printf("Health check: http://localhost:%s/health", port)

	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
