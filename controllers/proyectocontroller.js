
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


const proyectoHome = async(req, res)=>{
    //el controlador interactua con el modelo (Proyectos), trae los resultados,
    //los asigna a la var proyectos y se los pasa a la vista render(index)
    const proyectos = await Proyectos.findAll();

    
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
};



const formularioProyecto = async(req, res)=>{
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
};



const nuevoProyecto = async(req, res)=>{
    const proyectos = await Proyectos.findAll();
    //Enviar a la consola lo que el usuario escriba: console.log(req.body); acceder a los valores

   //Validar lo que tengamos en el input
   const {nombre} = req.body;

   let errores = [];

   //Si no hay un nombre....
   if(!nombre){
       errores.push({'texto': 'Agrega un nombre al proyecto'})
   } 
   //Si hay errores...
   if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //Si no hay errores, inserta en la db
        //Todas las consultas a db deben ser con async await
       

       await Proyectos.create({ nombre });
       res.redirect('/'); //Es parte de la respuesta, una vez q se inserte que me lleve al home
    }
};

const proyectoPorUrl = async(req, res, next)=>{
    const proyectosPromise =  Proyectos.findAll();

        const proyectoPromise = Proyectos.findOne({
            where: {
                url: req.params.url
            }
        });

        const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

        //Consultar tareas del proyecto actual
        const tareas = await Tareas.findAll({
            where: {
                proyectoId : proyecto.id
            },
            // include: [
            //     {model: Proyectos}
            // ]
        });

    if(!proyecto) return next();

    //Render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })

    };

    const formularioEditar = async(req, res) =>{

        const proyectosPromise =  Proyectos.findAll();

        const proyectoPromise = await Proyectos.findOne({
            where: {
                id: req.params.id
            }
        });

        const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

        //Renderizar la vista
        res.render('nuevoProyecto', {
        nombrePagina: 'Editar proyecto',
        proyectos,
        proyecto
    })
    };

    const actualizarProyecto = async(req, res)=>{
        const proyectos = await Proyectos.findAll();
        //Enviar a la consola lo que el usuario escriba: console.log(req.body); acceder a los valores
    
       //Validar lo que tengamos en el input
       const {nombre} = req.body;
    
       let errores = [];
    
       //Si no hay un nombre....
       if(!nombre){
           errores.push({'texto': 'Agrega un nombre al proyecto'})
       } 
       //Si hay errores...
       if(errores.length > 0){
            res.render('nuevoProyecto', {
                nombrePagina: 'Nuevo Proyecto',
                errores,
                proyectos
            })
        }else{
            //Si no hay errores, inserta en la db
            //Todas las consultas a db deben ser con async await
           
    
           await Proyectos.update(
               { nombre: nombre },
               {where: {id: req.params.id}}
               );
           res.redirect('/'); //Es parte de la respuesta, una vez q se inserte que me lleve al home
        }
    };

    const eliminarProyecto = async(req, res, next) =>{
        //req, query o params
           // console.log(req,params);
           const {urlProyecto} = req.query;

           const resultado = await Proyectos.destroy({where: {url : urlProyecto}});

           if(!resultado){
               return next();
           }

           res.status(200).send('Proyecto eliminado correctamente');
    }
    

module.exports = {
    
    proyectoHome,
    formularioProyecto,
    nuevoProyecto,
    proyectoPorUrl,
    formularioEditar,
    actualizarProyecto,
    eliminarProyecto
}