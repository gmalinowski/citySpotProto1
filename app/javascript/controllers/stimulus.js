import { Application } from "@hotwired/stimulus"

const stimulus = Application.start()

// Configure Stimulus development experience
stimulus.debug = false
window.Stimulus   = stimulus
console.log("Stimulus is running!")

export { stimulus }
