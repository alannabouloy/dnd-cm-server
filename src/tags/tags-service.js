const NotesService = require('../notes/notes-service')
const TagsService = {
    async getAllTags(knex, userId){
        //function should return all unique tags created by user
        const allTags = await knex
            .select('*')
            .from('tags')
            .where('user', userId)

        const uniqueTags = {}

        //for each tag check if it's unique and then add to uniqueTag object with count
        allTags.forEach(tag => {
            if(!uniqueTags[tag.tag_name]){
                uniqueTags[tag.tag_name] = {notes: [tag.note], count: 1}
            } else {
                //if tag name already exists then add to count and push note to array of notes with tag
                uniqueTags[tag.tag_name].count += 1
                uniqueTags[tag.tag_name].notes.push(tag.note)
            }
        })

        return uniqueTags
    },

    async getAllNotesWithTag(knex, userId, tagName){
        const tags = await this.getAllTags(knex, userId)

        //for each note in array fetch note using NotesService
        const notes = await tags[tagName].notes.map(note => NotesService.getNoteById(knex, note))

        return notes
    },

    


}

module.exports = TagsService;