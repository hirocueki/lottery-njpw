package main

import "net/http"

func init() {
	http.HandleFunc("/", handler)
	http.HandleFunc("/api/v1/lottery", Lottery)
}

func handler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "static/index.html", http.StatusFound)
}
