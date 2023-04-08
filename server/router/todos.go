package router

import (
	"net/http"

	"github.com/khairul169/go-todos/models"
	"github.com/khairul169/go-todos/services"
	"github.com/khairul169/go-todos/utils"
	"github.com/labstack/echo"
	"gorm.io/gorm/clause"
)

func getTodos(ctx echo.Context) error {
	var items []models.Todo
	services.Db.Order("updated_at desc").Find(&items)
	return ctx.JSON(http.StatusOK, items)
}

func create(ctx echo.Context) error {
	var item models.Todo
	err := ctx.Bind(&item)
	if err != nil {
		return utils.ResponseMessage(ctx, false, "cannot parse body!")
	}

	services.Db.Create(&item)

	return ctx.JSON(http.StatusOK, item)
}

func update(ctx echo.Context) error {
	id := ctx.Param("id")

	var data models.Todo
	err := ctx.Bind(&data)
	if err != nil {
		return utils.ResponseMessage(ctx, false, "cannot parse body!")
	}

	item := models.Todo{}
	result := services.Db.Model(&item).Where("id = ?", id).Clauses(clause.Returning{}).Updates(data)

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return utils.ResponseMessage(ctx, false, "item not found!")
	}

	return ctx.JSON(http.StatusOK, item)
}

func delete(ctx echo.Context) error {
	id := ctx.Param("id")
	item := models.Todo{}
	result := services.Db.Where("id = ?", id).Clauses(clause.Returning{}).Delete(&item)

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return utils.ResponseMessage(ctx, false, "item not found!")
	}

	return ctx.JSON(http.StatusOK, item)
}

func todos(api *echo.Group) {
	router := api.Group("/todos")

	router.GET("/", getTodos)
	router.POST("/", create)
	router.PATCH("/:id", update)
	router.PUT("/:id", update)
	router.DELETE("/:id", delete)
}
