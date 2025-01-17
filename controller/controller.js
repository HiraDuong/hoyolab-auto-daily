const Account = require('../model/model')
const mongoose = require('mongoose')

// Get all accounts
const getAllAccounts = async (req, res) => {
        try {
                const accounts = await Account.find()
                res.json(accounts)
        } catch (err) {
                res.status(500).json({ message: err.message })
        }
}

// Get an account by nickname
const getAccountByNickname = async (req, res) => {
        const nickname = req.params.nickname
        try {
                const account = await Account.findOne({ nickname: nickname })
                if (account == null) {
                        return res
                                .status(404)
                                .json({ message: 'Cannot find account' })
                }
                res.json(account)
        } catch (err) {
                return res.status(500).json({ message: err.message })
        }
}

// Create an account
const createAccount = async (req, res) => {
        const account = new Account({
                nickname: req.body?.nickname,
                token: req.body?.token,
                gi: req.body?.gi,
                hsr: req.body?.hsr,
                hi3: req.body?.hi3,
        })
        const exist = await Account.findOne({ nickname: req.body?.nickname })
        if (exist != null) {
                return res
                        .status(400)
                        .json({ message: 'Account already exists' })
        }
        try {
                const newAccount = await account.save()
                res.status(201).json({
                        message: 'Account created successfully',
                        data: newAccount,
                })
        } catch (err) {
                res.status(400).json({ message: err.message })
        }
}

// Update an account
const updateAccount = async (req, res) => {
        const id = req.params.id
        try {
                const account = await Account.findOne({ _id: id })
                if (account == null) {
                        return res
                                .status(404)
                                .json({ message: 'Cannot find account' })
                }
                if (req.body.token != null) {
                        account.token = req.body.token
                }
                if (req.body.gi != null) {
                        account.gi = req.body.gi
                }
                if (req.body.hsr != null) {
                        account.hsr = req.body.hsr
                }
                if (req.body.hi3 != null) {
                        account.hi3 = req.body.hi3
                }
                const updatedAccount = await account.save()
                res.json(updatedAccount)
        } catch (err) {
                return res.status(500).json({ message: err.message })
        }
}

// Delete an account
const deleteAccount = async (req, res) => {
        const { id } = req.params

        try {
                const result = await Account.deleteOne({ _id: id })
                if (result.deletedCount === 0) {
                        return res
                                .status(404)
                                .json({ message: 'Account not found' })
                }

                res.json({ message: 'Account deleted successfully' })
        } catch (err) {
                res.status(500).json({
                        message: 'Error deleting account',
                        error: err.message,
                })
        }
}

module.exports = {
        getAllAccounts,
        getAccountByNickname,
        createAccount,
        updateAccount,
        deleteAccount,
}
