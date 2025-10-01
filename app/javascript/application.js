// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "./controllers"
import 'flowbite';
import "leaflet"
import "leaflet-providers"
import "@rails/request.js"
import "./channels"

import Alpine from "alpinejs"

import photosPreview from "./components/photos_preview"

window.photosPreview = photosPreview

window.Alpine = Alpine
Alpine.start()
