import {Controller} from "@hotwired/stimulus"
import L from 'leaflet'
import {get} from "@rails/request.js"
import consumer from "channels/consumer"

export default class extends Controller {
    static targets = ["tplContainer", "tplImage"]
    static values = {
        pointsUrl: String,
        pointPath: String,
        clickable: Boolean,
        activeMarkerClass: String,
        editMarkerClass: String,
        editPointId: Number
    }
    map = null;
    markers = {};
    // apikey = 'OF9pwzHdOSiAvjocuV6K3tLdzq7qzDjJ'
    apikey = 'GC_rSoNlzYdN4GZ0MuaHcPFaUZ6iR4S8KDUZSNLZC3k'
    mapStyle = 'outdoor'

    async connect() {
        this.subscribePoints()
        this.setupMap()
        const points = await this.fetchData(this.pointsUrlValue);
        this.renderPoints(points)
        if (this.clickableValue) this.enableClick()
    }

    subscribePoints() {
        console.log("subscribePoints")
        consumer.subscriptions.create("PointsChannel", {
            received: (data) => {
                switch (data.action) {
                    case "create":
                    this.addMarker(point.latitude, point.longitude, point.id)
                        break
                    case "update":
                        alert("update point")
                        break
                    case "destroy":
                        this.removeMarker(data.point.id)
                        break
                }
            }
        })
    }

    enableClick() {
        this.markers[null] = null
        this.map.on("click", evt => {
            this.updateFormCoordinates(evt.latlng.lat, evt.latlng.lng)
        })
    }

    updateFormCoordinates(lat, lng) {
        document.getElementById("point_latitude").value = lat
        document.getElementById("point_longitude").value = lng

        if (this.markers[null] == null) {
            this.markers[null] = this.addMarker(lat, lng, null, { classList: this.activeMarkerClassValue })

        } else {
            this.markers[null].setLatLng([lat, lng])
        }
    }

    renderPoints(points) {
        points.forEach(point => {
            if (this.editPointIdValue == point.id)
                this.addMarker(point.latitude, point.longitude, point.id, { classList: this.editMarkerClassValue })
            else
                this.addMarker(point.latitude, point.longitude, point.id)
        })
    }

    addMarker(lat, lng, id, options = {}) {
        const marker = L.marker([lat, lng]).addTo(this.map)
        if (options.classList) this.setMarkerClass(marker, options.classList);
        this.markers[id] = marker;
        marker.on("click", (evt) => this.loadPhotosHtml(marker, id))
        return marker
    }

    setMarkerClass(marker, classList) {
        marker.getElement().classList.add(classList)
    }

    removeMarker(id) {
        this.markers[id].remove();
        delete this.markers[id];
    }

    async loadPhotosHtml(marker, id) {
        const response = await get(this.pointPathValue.replace(':id', id))
        if (!response.ok) return alert("Cannot fetch data")

        marker.bindPopup(await response.html, { maxWidth: 1000, autoPan: true }).openPopup();
    }

    async fetchData(url) {
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