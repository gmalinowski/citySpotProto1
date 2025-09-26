import {Controller} from "@hotwired/stimulus"
import L from 'leaflet'
import {get} from "@rails/request.js"

export default class extends Controller {
    static targets = ["tplContainer", "tplImage"]
    static values = {
        pointsUrl: String,
        pointPath: String,
        clickable: Boolean,
    }
    map = null;
    // apikey = 'OF9pwzHdOSiAvjocuV6K3tLdzq7qzDjJ'
    apikey = 'GC_rSoNlzYdN4GZ0MuaHcPFaUZ6iR4S8KDUZSNLZC3k'
    mapStyle = 'outdoor'

    async connect() {
        this.setupMap()
        const points = await this.fetchJson(this.pointsUrlValue);
        this.renderPoints(points)
        if (this.clickableValue) this.enableClick()
    }

    enableClick() {
        this.tmpMarker = null
        this.map.on("click", evt => {
            this.updateFormCoordinates(evt.latlng.lat, evt.latlng.lng)
        })
    }

    updateFormCoordinates(lat, lng) {
        document.getElementById("point_latitude").value = lat
        document.getElementById("point_longitude").value = lng

        if (this.tmpMarker == null) {
            this.tmpMarker = this.addMarker(lat, lng)
        } else {
            this.tmpMarker.setLatLng([lat, lng])
        }
    }

    renderPoints(points) {
        points.forEach(point => {
            this.addMarker(point.latitude, point.longitude, point.name, point.id)
        })
    }

    addMarker(lat, lng, name, id) {
        const marker = L.marker([lat, lng]).addTo(this.map)
        if (name) marker.bindPopup(name)
        marker.on("click", (evt) => this.loadPhotos(marker, id))
        return marker
    }

    async loadPhotos(marker, id) {
        const pointData = await this.fetchJson(this.pointPathValue.replace(':id', id))
        if (pointData.photos.length < 1) return

        const containerClone = this.tplContainerTarget.cloneNode(true)
        containerClone.removeAttribute('style')
        if (pointData.photos.length === 1) {
            containerClone.classList.remove('grid-cols-2')
            containerClone.classList.add('grid-cols-1')
        } else {
            containerClone.classList.remove('grid-cols-1')
            containerClone.classList.add('grid-cols-2')
        }

        pointData.photos.forEach(img => {
           const imgClone = this.tplImageTarget.content.cloneNode(true)
            const imgEl = imgClone.querySelector('img')
            imgEl.src = img.url;
            imgEl.alt = img.name;
            imgEl.addEventListener('click', () => window.open(img.url, "_blank"))
            containerClone.appendChild(imgClone)
        });

        marker.bindPopup(containerClone, { maxWidth: 1000, autoPan: true }).openPopup();
    }

    async fetchJson(url) {
        try {
            const response = await get(url, {responseKind: "json"})
            if (response.ok) {
                return await response.json
            } else {
                alert("Cannot fetch data from server.")
            }
        } catch (error) {
            alert("Unexpected error - cannot fetch data from server.")
            console.error("GET POINTS FROM API", error)
        }
    }

    setupMap(centerPoint = [51.961, 19.232]) {
        this.map = L.map(this.element).setView(centerPoint, 6, {
            animate: true,
        });
        // const tileLayers = {
        //     'Basic': L.tileLayer(`https://api.mapy.com/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
        //         minZoom: 0,
        //         maxZoom: 19,
        //     }),
        L.tileLayer(`https://api.mapy.com/v1/maptiles/${this.mapStyle}/256/{z}/{x}/{y}?apikey=${this.apikey}`, {
            maxZoom: 22,
            // attribution: '<a href="https://tomtom.com" target="_blank">&copy;  1992 - 2025 TomTom.</a> ',
            attribution: '<a href="https://api.mapy.com/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
            subdomains: 'abcd',
            style: 'main',
            ext: 'png',
            apikey: this.apikey
        }).addTo(this.map);
    }
}