const express = require('express')

const app = express()
const port = 3000
const config = {
	host: 'db',
	user: 'root',
	password: 'root',
	database: 'nodedb'
};
const mysql= require('mysql')
const connection = mysql.createConnection(config)

app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

app.set('view engine', 'hbs')

app.get('', (req, res) => {
	listaDeNomes('index.hbs', connection, res, {})
})

app.post('', (req,res) => {
	const corpo = req.body
	var nome = corpo.pessoa

	if(!nome){
		return listaDeNomes('index.hbs', connection, res, {erro: 'O nome não pode ser vazio'})
	}

	const sql = `INSERT INTO people (nome) values (\"` + nome + `\");`
	connection.query(sql, function(err, result) {
		listaDeNomes('index.hbs', connection, res, {sucesso: 'Nome corretamente inserido'})
	})
})

app.listen(port, ()=> {
	console.log('Rodando na porta ' + port)
})

// Acessa todos os nomes e envia para a pagina especificada
function listaDeNomes(pagina, connection, res, mensagem) {
	const sql_nomes = `SELECT * FROM people;`
	connection.query(sql_nomes, function(err, result) {
		if(err){
			console.log(err)
			throw err;
		}

		var lista_nomes = []
		for(let i=0;i<result.length;i++){
			lista_nomes.push(result[i]['nome'])
		}

		res.render(pagina, Object.assign({}, {lista_nomes: lista_nomes}, mensagem))
	})
}
