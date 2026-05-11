package service

import (
	"backend/internal/models"
	"backend/internal/repository"
	"backend/pkg/auth"
	"backend/pkg/database"
	"errors"
)

type AuthService struct {
	userRepo *repository.UserRepository
}

func NewAuthService(userRepo *repository.UserRepository) *AuthService {
	return &AuthService{userRepo: userRepo}
}

func (s *AuthService) Register(req *models.RegisterRequest) (*models.User, error) {
	// Check if user exists in central DB
	existing, _ := s.userRepo.FindByEmail(req.Email)
	if existing != nil {
		return nil, errors.New("user already exists")
	}

	// Hash password
	hashedPassword, err := auth.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	// Create user record first to get ID
	user := &models.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: hashedPassword,
		FarmName:     req.FarmName,
		Location:     req.Location,
		Role:         "user",
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	// Create user's personal database using the user ID
	dbPath, err := database.CreateUserDatabase(user.ID, req.FarmName)
	if err != nil {
		// Rollback user creation if DB creation fails
		s.userRepo.Delete(user.ID)
		return nil, errors.New("failed to create user database: " + err.Error())
	}

	// Update user with db_path
	user.DBPath = dbPath
	if err := s.userRepo.UpdateDBPath(user.ID, dbPath); err != nil {
		return nil, err
	}

	user.PasswordHash = ""
	return user, nil
}

func (s *AuthService) Login(email, password string) (string, *models.User, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return "", nil, errors.New("invalid credentials")
	}
	if user == nil {
		return "", nil, errors.New("invalid credentials")
	}

	if !auth.CheckPasswordHash(password, user.PasswordHash) {
		return "", nil, errors.New("invalid credentials")
	}

	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		return "", nil, err
	}

	user.PasswordHash = ""
	return token, user, nil
}
