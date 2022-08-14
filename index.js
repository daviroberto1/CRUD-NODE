const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require("express-session");
const PORT = process.env.PORT || 3000;

app.engine('hbs',hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
}))
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended:false}));

// Importar model Usuarios
    const Usuario = require('./models/Usuario');


// Config da sessions
app.use(session({
    secret: 'chave',
    resave: false,
    saveUninitialized: true
}))

app.get('/',(req,res)=>{
    if(req.session.errors){
        var arrayErros = req.session.errors;
        req.session.errors = '';
        return res.render('index',{NavActiveCad:true, error:arrayErros})
    }else if(req.session.success){
        req.session.success = false;
        return res.render('index',{NavActiveCad:true, msgSuccess:true})
    }
    res.render('index',{NavActiveCad:true});
})

app.get('/users',(req,res)=>{
    Usuario.findAll().then((valores)=>{
        // console.log(valores.map(valores => valores.toJSON()));
        if(valores.length > 0){
            return res.render('users',{NavActiveUsers:true, table:true, usuarios: valores.map(valores => valores.toJSON())})
        }else {
            return res.render('users',{NavActiveUsers:true, table:false})
        }
    }).catch((err) =>{
        console.log(`Houve um problema: ${err}`)
    })
     
})

app.post('/editar',(req,res)=>{
    var id = req.body.id;
    Usuario.findByPk(id).then((dados)=>{
        return res.render('editar',{error: false, id: dados.id, nome: dados.nome, email: dados.email})
    }).catch((err)=>{
        console.log(err);
        return res.render('editar',{error: true, problema: 'Não é possível editar este registro'});
    })
    // res.render('editar')
})

app.post('/cad',(req,res)=>{
    var nome = req.body.nome;
    var email = req.body.email;

    const erros = [];
    
    // Remover os espaços em branco antes e depois
    nome = nome.trim();
    email = email.trim();

    // Limpar o nome de caracteres especiais(Apenas letras)
    nome = nome.replace(/[^A-zÀ-ú\s]/gi,'');
    
    // Verificar se o campo nome está vazio
    if(nome == '' || typeof nome == undefined || typeof nome == null){
        erros.push({mensagem: 'Campo nome não pode ser vazio!'});
    }

    // Verificar se o campo nome é válido
    if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)){
        erros.push({mensagem:'Nome inválido!'})
    }

    // Verificar se o campo email está vazio
    if(email == '' || typeof email == undefined || typeof email == null){
        erros.push({mensagem: 'Campo email não pode ser vazio!'});
    }
    
    // Verificar se o email é válido
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        erros.push({mensagem:'Campo email inválido!'})
    }

    if(erros.length > 0){
        console.log(erros);
        req.session.errors = erros;
        req.session.success = false;
        return res.redirect('/')
    }

    // Sucesso Nenhum Erro
    // Salvar no banco de dados
    Usuario.create({
        nome: nome,
        email: email.toLowerCase()
    }).then(()=>{
        console.log('Cadastrado com sucesso!');
        req.session.success = true;
        return res.redirect('/')
    }).catch((err)=>{console.log(`ERRO: ${err}`)})
})  

app.use(express.static('public'));

app.post('/update',(req,res)=>{
    var nome = req.body.nome;
    var email = req.body.email;

    const erros = [];
    
    // Remover os espaços em branco antes e depois
    nome = nome.trim();
    email = email.trim();

    // Limpar o nome de caracteres especiais(Apenas letras)
    nome = nome.replace(/[^A-zÀ-ú\s]/gi,'');
    
    // Verificar se o campo nome está vazio
    if(nome == '' || typeof nome == undefined || typeof nome == null){
        erros.push({mensagem: 'Campo nome não pode ser vazio!'});
    }

    // Verificar se o campo nome é válido
    if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)){
        erros.push({mensagem:'Nome inválido!'})
    }

    // Verificar se o campo email está vazio
    if(email == '' || typeof email == undefined || typeof email == null){
        erros.push({mensagem: 'Campo email não pode ser vazio!'});
    }
    
    // Verificar se o email é válido
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        erros.push({mensagem:'Campo email inválido!'})
    }

    if(erros.length > 0){
        console.log(erros);
        return res.status(400).send({status:400,erro: erros});
    }

    // Sucesso Nenhum Erro
    // Atualizar registro no banco de dados
    Usuario.update(
        {
        nome: nome,
        email: email.toLowerCase()
        },
        {
            where: {
                id: req.body.id
            }
        }).then((resultado)=>{
        return res.redirect('/users');
    }).catch((err)=>{console.log(err)})
})

app.post('/del',(req,res)=>{
    Usuario.destroy({
        where: {
            id: req.body.id
        } 
    }).then((retorno)=>{
        console.log(retorno)
        return res.redirect('/users');
    }).catch((err)=>{
        console.log(err)
    })
})

app.listen(PORT,()=>{
console.log(`Servidor rodando em http://localhost:${PORT}`)
})