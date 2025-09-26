import L from 'leaflet'
import {get} from "@rails/request.js"

export default function map() {
    return {
        apikey: 'GC_rSoNlzYdN4GZ0MuaHcPFaUZ6iR4S8KDUZSNLZC3k',
        mapStyle: 'outdoor',

        init() {
            this.setupMap();
        },
        setupMap(centerPoint = [51.961, 19.232]) {
            this.map = L.map(this.$el, {
                center: centerPoint,
                zoom: 6,
                zoomAnimation: true
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
}