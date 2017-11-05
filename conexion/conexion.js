"use strict"


const mysql= require('mysql'),

	myConnection = require('express-myconnection'),
	dbOptions ={
		host: 'localhost',
		user:'juan',
		password: 'juan',
		port: 3306,
		database:'usuarios'
	},
	conn= myConnection(mysql, dbOptions,'request');
 // estrategia de express-myconnection .. 'request' crea nueva conexion a cada peticion
module.exports= conn;