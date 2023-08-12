const imageValidate = (images) => {
    let imagesTable = []
    if (Array.isArray(images)) {
        imagesTable = images
    } else {
        imagesTable.push(images)
    }

    if (imagesTable.length > 3) {
        return { error: "Send only 3 images at once" }
    }
    for (let image of imagesTable) {
        if (image.size > 1048576) return { error: "Size too large (above 1 MB)" }
        const filetypes = /jpg|jpeg|png/
        const mimetype = filetypes.test(image.mimetype)
        if (!mimetype) return { error: "Incorrect mime type (should be jpg,jpeg or png" }
    }

    return { error: false }
}

module.exports = imageValidate