import { ReleaseNotes } from '../../models/releaseNotes.model.js'
import { errorHandler, responseHandler } from '../../utils/responseHandler.js'
import * as Dal from '../../dal/dal.js'

export const create = async (req, res) => {
  try {
    const value = req.value
    const notes = await ReleaseNotes.create(value)
    responseHandler(notes, res, 'Release notes created successfully', 201)
  } catch (error) {
    console.log('Error: ', error)
  }
}

export const getAll = async (req, res) => {
  try {
    const notes = await Dal.findAll(ReleaseNotes, {}, { version: -1 })
    responseHandler(notes, res, 'All notes', 200)
  } catch (error) {
    console.log('Error: ', error)
    errorHandler('Error fetching notes', res, 500)
  }
}