const {request, response} = require('express');
const bcrypt = require('bcrypt');
const usersModel = require('../models/users');
const pool = require('../db');

const Characterslist = async (req=request, res = response) =>{
    let conn;
    try {
         conn = await pool.getConnection();

         const users = await conn.query(usersModel.getAll, (err) => {
            if (err) {
                throw new Error(err);
            }
         }) 

         res.json(users);
    } catch (error){
        res.status(500).json(error);

    }finally {
        if (conn) conn.end();
    }}

const listCharacterByID = async (req=request, res = response) =>{
    const {id} = req.params;
 
    if (isNaN(id)) {
        res.status(400).json({msg: 'Invalid ID'});
        return;
    }

    let conn;
    try {
         conn = await pool.getConnection();

         const [user] = await conn.query(usersModel.getByID, [id], (err) => {
            if (err) {
                throw new Error(err);
            }
         }) 

         if (!user) {
            res.status(404).json({msg: 'User not found'});
            return;
         }

         res.json(user);
    } catch (error){
        res.status(500).json(error);

    }finally {
        if (conn) conn.end();
    }}

const addCharacter = async (req = request, res = response) => {
    const{
        name,
        normalized_name, 
        gender
    } = req.body;

    if (!name || !normalized_name || !gender) {
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const character = [name, normalized_name, gender];

    let conn;

    try {
        conn = await pool.getConnection();

        const [usernameUser] = await conn.query(usersModel.getByUsername, [name], (error) => {
            if (err) throw err;
        });

        if (usernameUser) {
            res.status(409).json({msg: `Character with name ${name} already exists`});
            return;
        }

        const userAdded = await conn.query(usersModel.addRow, [...character], (err) => {
            if (err) throw err;
        })
        
        
        if (userAdded.affectedRows === 0) throw new Error({msg: 'Failed to add character'});

        res.json({msg: 'Character added succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }}

const updateCharacter = async (req = request, res = response) => {

    const{
        name,
        normalized_name, 
        gender
    } = req.body;
    const {id} = req.params;

    let newUserData = [
        name,
        normalized_name, 
        gender
    ];
  
    let conn;

    try {
        conn = await pool.getConnection();
   
        const [userExists] = await conn.query (
            usersModel.getByID, [id], (err) => {if (err) throw err;}
        );

        if (!userExists) {
            res.status(404).json({msg: 'Character not found'});
            return
        }
        const [usernameUser] = await conn.query(usersModel.getByUsername, [name], (error) => {
            if (err) throw err;
        });

        if (usernameUser) {
            res.status(409).json({msg: `Character with name ${name} already exists`});
            return;
        }

        const oldUserData = [
            userExists.name,
            userExists.normalized_name,
            userExists.gender
        ];

        newUserData.forEach((userData, index) => {
            if (!userData) {
                newUserData[index] = oldUserData[index];
            }
        });
    
        const userUpdated = await conn.query(usersModel.updateRow, [...newUserData, id], (err) => {
            if (err) throw err;
        });
        
        if (userUpdated.affectedRows === 0) throw new Error({msg: 'Character not updated'});

        res.json({msg: 'Character updated succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }}

const  deleteCharacter = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const {id} = req.params;

        const [userExists] = await conn.query (
            usersModel.getByID, [id], (err) => {if (err) throw err;}
        );

        if (!userExists) {
            res.status(404).json({msg: 'Character not found'});
            return;
        }

        const userDeleted = await conn.query (
            usersModel.deleteRow, [id], (err) => {if (err) throw err;}
        );

        if (userDeleted.affectedRows === 0) {
            throw new Error({msg: 'Failed to delete character'})
        };

        res.json({msg: 'Character delete succesfully'});
        }catch (error) {
            console.log(error);
            res.status(500).json(error);
        } finally {
            if (conn) conn.end();
        }}

module.exports = {Characterslist, listCharacterByID, addCharacter, updateCharacter, deleteCharacter};