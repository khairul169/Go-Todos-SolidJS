package services

import (
	"log"
	"os"

	"github.com/khairul169/go-todos/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var Db *gorm.DB

func Migrate() {
	Db.AutoMigrate(&models.Todo{})
}

func Seed() {
	var count int64
	Db.Find(&models.Todo{}).Count(&count)

	if count > 0 {
		return
	}

	// seed db
	// Db.Create(&models.Todo{
	// 	Title: "Test Todo",
	// 	Notes: "",
	// })
}

func InitDatabase() {
	var err error

	dbPath := os.Getenv("DB_PATH")
	Db, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})

	if err != nil {
		log.Fatal("Cannot connect to database")
	}

	Migrate()
	Seed()
}
