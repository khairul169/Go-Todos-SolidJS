package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/khairul169/go-todos/router"
	"github.com/khairul169/go-todos/services"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	// load env variables
	godotenv.Load()

	// create echo app
	app := echo.New()

	// middlewares
	// app.Pre(middleware.AddTrailingSlash())
	app.Use(middleware.Logger())
	app.Use(middleware.CORS())

	// api routing
	router.Router(app)

	// initialize database
	services.InitDatabase()

	// start http server
	listenAt := fmt.Sprintf("%s:%s", os.Getenv("HOST"), os.Getenv("PORT"))
	log.Fatal(app.Start(listenAt))
}
