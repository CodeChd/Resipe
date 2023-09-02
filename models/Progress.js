const mongoose= require('mongoose')
const Schema = mongoose.Schema;

const progressSchema = new Schema({
    progress: String
})

const Progress = mongoose.model('Progress', progressSchema)

module.exports = Progress
