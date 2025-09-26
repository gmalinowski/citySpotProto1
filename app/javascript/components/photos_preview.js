
export default function photosPreview() {
    return {
        files: [],
        previews: [],

        chooseFiles(event) {
            const selected = Array.from(event.target.files)
            this.files = selected.map(file => ({
                file,
                alt: file.name,
                name: file.name,
                url: URL.createObjectURL(file)
            }))
            if (selected.length > 6) this.maxLimit()
        },

        maxLimit() {
            alert("Max 6 files allowed. Please remove some files and try again.");
        },
        remove(index) {
            this.files.splice(index, 1)
            const dt = new DataTransfer()
            this.files.forEach(f => dt.items.add(f.file || f))
            this.$refs.fileInput.files = dt.files
        }
    }
}