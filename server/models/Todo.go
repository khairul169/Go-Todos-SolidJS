package models

type Todo struct {
	Base
	Title string `json:"title"`
	Notes string `json:"notes"`
}
