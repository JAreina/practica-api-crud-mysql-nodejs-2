"use strict";
const conn= require('../conexion/conexion'),
         express = require('express'),
         router = express.Router();

// RUTAS
// middelawwre paramatros:  PETICION, RESPUESTA Y NEXT
router
       .use(conn)
       .get('/', (req,res,next)=>{
        req.getConnection((err,conn)=>{
        	conn.query("select * from usuario",(error,data)=>{
               if(!error){
               	res.render('index',{
               		titulo: "DATOS",
               		data:data
               	});
               }
        	});
        });
} )
//ruta

router.use(conn)
         .get('/agregar', (req,res,next)=>{
        res.render('add',{ // VISUALIZA LA VISTA ADD.PUG
        	title: 'AGREGAR USUARIO'
        });
} );


// AGREAGAR A LA BASE DE DATOS POR POST
router.use(conn).post('/', (req,res,next) =>{
         req.getConnection((err,conn)=>{
         	let usuario= {
                        id:0,
         		clave: req.body.password,
         		nombre: req.body.nombre,
         		correo: req.body.correo,
         		ciudad: req.body.ciudad
         	};

         	// ejecutar  el update
         	// 'inser into usuarios SET ?'
         	conn.query('insert into usuarios.usuario SET ?',usuario, (err,data)=>{
                                   if(!err){
                                   	res.redirect('/');
                                   	console.log(data   +"éxito al insertar ")
                                   }else {
                                   	res.redirect('/agregar');
                                   	console.log(err+ "error al insertar ");
                                   }
         	})
         })
});

// consulta para actualizar los datos
router.use(conn).get('/editar/:id', (req,res,next)=>{
	let id = req.params.id;
	 req.getConnection((err,conn)=>{
	conn.query('select * from usuario  where id=?',id,(err,data)=>{
		if(!err){
			res.render('editar' , {
				titulo: 'EDITAR USUARIO',
				data: data
			});
		}else{
			console.log(err);
		}
	});
});
	});

// EDITAR LOS DATO S
router.use(conn).post('/actualizar/:id', (req, res, next) => {
	req.getConnection((err, conn) => {
		let usuario = {
                        id:req.body.id,
         		clave: req.body.password,
         		nombre: req.body.nombre,
         		correo: req.body.correo,
         		ciudad: req.body.ciudad
         	};

		conn.query('UPDATE usuario SET ? WHERE id = ?', [usuario, usuario.id],(err, data) => {
			if(!err) {
				res.redirect('/');
			} else {
				res.redirect('/editar/'+req.body.id);
			}
		});
	});
});

// eliminar registro de base de datos
router.use(conn).post('/eliminar/:id', (req, res, next) => {
	req.getConnection((err, conn) => {
		let id = req.params.id;

		conn.query('DELETE FROM usuario WHERE id = ?', id, (err, data) => {
			if(!err) {
				res.redirect('/');
			} else {
				return next(new Error('Registro no encontrado'));
			}
		});
	});
});


function error404(req,res,next){
	let err = new Error();
	err.status = 404;
	err.statusText = "NOT FOUND";
	res.render('error',{error:err});
}
// manejo de 404
router.use(conn).use(error404);


module.exports=router;