package router

import "github.com/labstack/echo"

func Router(app *echo.Echo) {
	api := app.Group("/api")

	todos(api)
}
