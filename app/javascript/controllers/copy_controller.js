import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static values = {
        text: String
    }

    timer = null
    copy() {
        clearTimeout(this.timer);
        this.element.querySelector("button").classList.add("btn-inactive")
        navigator.clipboard.writeText(this.textValue)
        this.timer = setTimeout(() => {
            this.element.querySelector("button").classList.remove("btn-inactive")
        }, 1000)
    }
}