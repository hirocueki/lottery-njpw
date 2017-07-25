package main

import (
	"encoding/json"
	"html/template"
	"net/http"
)

func Index(w http.ResponseWriter, r *http.Request) {
	var tmpl = template.Must(template.ParseFiles("static/index.html"))
	if err := tmpl.Execute(w, nil); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func Lottery(w http.ResponseWriter, r *http.Request) {
	res := &struct {
		Player  string `json:"player"`
		Message string `json:"message"`
		URL     string `json:"url"`
	}{
		Player:  "外道",
		Message: "末吉",
		URL:     "http://www.njpw.co.jp/profile/701",
	}

	j, err := json.Marshal(res)
	if err != nil {
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write(j); err != nil {
		return
	}
}
