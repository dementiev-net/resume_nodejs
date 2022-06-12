const {Router} = require('express');
const shortid = require('shortid');
const Data = require('../models/Data');
const auth = require('../middleware/auth.middleware');
const router = Router();
const Logger = require('../modules/log')(module); // логгер в файл

/**
 * [GET] /api/data
 */
router.get(
    '/',
    auth,
    async (req, res) => {
        try {
            const data = await Data.find({owner: req.user.userId})
            res.json(data)
        } catch (e) {
            Logger.error(`Server Error: ${e.message}`);
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

/**
 * [POST] /api/data/add
 */
router.post(
    '/add',
    auth,
    async (req, res) => {
        try {
            const {note} = req.body
            const code = shortid.generate()
            const existing = await Data.findOne({note})
            if (existing) {
               return res.json({data: existing})
            }
            const data = new Data({
               note, code, owner: req.user.userId
            })
            await data.save()
            res.status(201).json({data})
        } catch (e) {
            Logger.error(`Server Error: ${e.message}`);
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

/**
 * [GET] /api/data/[id]
 */
router.get(
    '/:id',
    auth,
    async (req, res) => {
        try {
            const data = await Data.findById(req.params.id)
            res.json(data)
        } catch (e) {
            Logger.error(`Server Error: ${e.message}`);
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

module.exports = router
