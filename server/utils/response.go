package utils

import (
	"net/http"

	"github.com/labstack/echo"
)

func ResponseMessage(ctx echo.Context, isSuccess bool, message string) error {
	statusCode := http.StatusOK

	if !isSuccess {
		statusCode = http.StatusBadRequest
		return echo.NewHTTPError(statusCode, message)
	}

	return ctx.JSON(statusCode, map[string]string{
		"message": message,
	})
}
