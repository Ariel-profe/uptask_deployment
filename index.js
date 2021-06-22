const express = require('express'); //Para crear server
const routes = require('./routes');
const path = require('path');

const expressValidator = require('express-validator');
const passport = require('./config/passport'); //Para navegar entre pestañas
const flash = require('connect-flash');
const session = require('express-session'); //Para cuentas de usuarios

const cookieParser = require('cookie-parser');
require('dotenv').config({path: '/variables.env'}) //importar variables de entorno
const host = process.env.HOST || '0.0.0.0'; //Servidor y puerto para heroku
const port = process.env.PORT || 3000;

// helpers con algunas funciones
const helpers = require('./helpers');

// Crear conexión a la db
const db = require('./config/db');

// Importar los modelos del proyecto
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Server connected'))
    .catch(error => console.log(error));

// crear app de express
const app = express();



// cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar Pug, templates
app.set('view engine', 'pug');


// habilitar bodyParser para leer datos del formulario

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express validator a toda la aplicación
app.use(expressValidator());





// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));



app.use(cookieParser());

//Session nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({ 
    secret: "keyboard cat", 
    resave: false, 
    saveUninitialized: false 
}));


app.use(passport.initialize());
app.use(passport.session());

// agregar flash messages
app.use(flash());

// Pasar var dump
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});


app.use('/', routes() );

app.listen(port, host, () =>{console.log('Server is running')});