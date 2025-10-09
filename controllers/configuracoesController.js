const repository = require('../repository/usuarioRepository');
const bcrypt  = require('bcrypt');
const crypto  = require('crypto');
const nodemailer = require('nodemailer');
const session = require('express-session');

exports.salvar = (req,res) =>{
 const dados = req.body;
};