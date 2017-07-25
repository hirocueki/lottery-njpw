package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func init() {
	r := mux.NewRouter().StrictSlash(true)

	r.HandleFunc("/", handler)
	r.HandleFunc("/api/v1/lottery", Lottery)

	http.Handle("/", r)

}

func handler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "static/index.html", http.StatusFound)
}
