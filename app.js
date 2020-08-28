class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	//método que validará se os dados foram digitados corretamente.
	//o i pode retornar tanto os indices de um determinado array os atributos de um determinado objeto
	//não retorna o valor, mas através do indice ou atributo nós temos acesso ao valor
	//para recuperar o valor usa-se o this[i] que é a mesma coisa que this.ano, this. mes, etc..
	// e essa forma pode ser usada para arrays como objetos
	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null){
				return false
			}
		}
		return true
	}

	mostrarValor() {
		for(let i in this) {
			console.log(i, this[i])
		}
	}
}

//O método construct é um método especial para criar e inicializar um objeto a partir de uma classe.
//A class só será criada na memória se os atributos/métodos for passado ou compilados
class Bd {

	//essa logica colocada no constructor não poderia estar num Set porque a verificação do localstorage deve ser automatica
	//no momento que Bd é instaciado, automaticamente deve ocorrer a verificação da localStorage sem a necessidade do programador ficar sempre chamando o método set para realizar essa simples análise.
	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	//o this. é utilizado quando vamos chamar algo que não esteja dentro do escopo que estamos trabalhando, por exemplo:
	// o método get proximoid não está dentro do escopo gravar e sim da class aí nesse caso foi necessário o this
	//agora na criação de variavéis se for usada somente dentro do escopo específico não precisa usar o this
	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	//esse método é responsável por recuperar os registros do Bd (local storage)
	recuperarTodosRegistros() {

		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localStorage, no meu caso tem 22 então o id = 22 e o i vai percorrer até chegar no numero 22
		for(let i = 1; i <= id; i++) {

			//recuperar a despesa, convertida para Objeto literal, porque antes estava em Json.
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			//o continue é responsável por pular a despesa que for null
			if(despesa === null) {
				continue
			}

			//aparecer a variavel id no console junto com a despesa atual
			//sera usada para atribuir id aos botões de exclusao
			despesa.id = i
			//e o push é responsável por colocar a despesa atual no array despesas
			despesas.push(despesa)
		}

		//será retornado o array com todas as despesas despesas
		return despesas
	}

	//o método pesquisar receberá despesas que ja existe no banco(local storage)
	//o array despesasFiltradas receberá todos os registros que ja exitem
	//e para filtrá-los deve-se verificar se os campos são diferentes de vazios para fazerem a comparação
	//se não for aí, através do filter e da função de callback é realizada a condição do filtro
	//o Array precisa ser atualizado para que o dado filtrado seja mostrado, e não todas as despesas que já existem, por isso que despesasFiltradas recebe o filtro

	pesquisar(despesa) {
		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()
		console.log(despesa)

		//ano
		if(despesa.ano != '') {
			console.log('filtrando ano')
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		//mes
		if(despesa.mes != '') {
			console.log('filtrando mes')
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if(despesa.dia != '') {
			console.log('filtrando dia')
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//tipo
		if(despesa.tipo != '') {
			console.log('filtrando tipo')
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if(despesa.descricao != '') {
			console.log('filtrando descricao')
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if(despesa.valor != '') {
			console.log('filtrando valor')
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		//é retornado o array filtrado para o método pesquisarDespesas, para que apareça na view
		return despesasFiltradas
	}

	
	

	remover(id) {
		console.log('chegando aqui ' + id)
		localStorage.removeItem(id)
		window.location.reload()
	}
}

let bd = new Bd()


function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
	)

	
	
		if(despesa.validarDados() == true) {
			bd.gravar(despesa)
			modificaEstilo()
			$('#modalRegistraDespesa').modal('show')
			despesa.mostrarValor()
			limparDados()
		} else {
			modificaEstilo2()
			$('#modalRegistraDespesa').modal('show')
		}
	
	
}

function modificaEstilo(){
	document.getElementById('exampleModalLabel').innerHTML = "Sucesso na gravação"
	document.getElementById('descricaoModal').innerHTML = "Despesa cadastrada com sucesso!"
	document.getElementById('exampleModalLabel').className = "text-success"
	document.getElementById('botao').className = 'btn btn-success'
	document.getElementById('botao').innerHTML = "Voltar"
}

function modificaEstilo2(){
	document.getElementById('exampleModalLabel').innerHTML = "Erro na gravação"
	document.getElementById('exampleModalLabel').className = "text-danger"
	document.getElementById('descricaoModal').innerHTML = "Alguns dados não foram preenchidos."
	document.getElementById('botao').className = 'btn btn-danger'
	document.getElementById('botao').innerHTML = "Voltar e corrigir"
}

function limparDados(){
	document.getElementById('ano').value = ''
	document.getElementById('mes').value = ''
	document.getElementById('dia').value = ''
	document.getElementById('tipo').value = ''
	document.getElementById('descricao').value = ''
	document.getElementById('valor').value = ''
}

//essa função faz ligação com a view, ou seja ela será responsável em transferir os dados para a tabela
//aqui no caso ela está recebendo o array vindo do local storage.
function carregaListaDespesas() {

	let despesas = Array()

	despesas = bd.recuperarTodosRegistros() 

	//selecionando o tbody na tabela
	let listaDespesas = document.getElementById("listaDespesas")

	//ForEach percorre cada linha no array aqui no caso cada despesa, utilizando função callback
	//ou seja a função callback através do "d" está recebendo também lá em cima outra função recuperarTodosRegistros
	//que por sua vez tem o acesso a todos os atributos

	despesas.forEach(function(d){

		//Criando a linha (tr)
		var linha = listaDespesas.insertRow();

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//Ajustar o tipo
		switch(d.tipo){
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break
			
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//criar botao de exclusao

		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class = "fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function() {

			//atribuindo o toggle e target
			$('modalDespesaExcluida').modal()

			//mostrar modal
			$('#modalDespesaExcluida').modal('show')

			let id = this.id.replace('id_despesa_', '')
			console.log('selecionei o botao ' + id)

		
			document.getElementById("excluirDespesa").addEventListener("click", function() {
				bd.remover(id);
			});
	
		}
		
	
		//botao voltar
		let botao2 = document.getElementById('voltarDespesa')

		botao2.onclick = function CancelarExclusao(){
			$('modalDespesaExcluida').modal()
			$('#modalDespesaExcluida').modal('hide')
		}
		
		linha.insertCell(4).append(btn)

		console.log(d)
	})
}


	


//recuperando os valores de uma variavel
function pesquisarDespesa(){
	 
	let ano  = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	 //ATRIBUINDO O RETORNO DAS DESPESAS FILTRADAS A UMA VARIAVEL 
	 let despesas = bd.pesquisar(despesa)
	 carregarDadosVazios(despesas)
	 
	 
	
 }

 function carregarDadosVazios (despesaFiltrada){
	
	//selecionando o elemento tbody
	let listaDespesas = document.getElementById("listaDespesas")

	listaDespesas.innerHTML = ''

	despesaFiltrada.forEach(function(d){

		//Criando a linha (tr)
		var linha = listaDespesas.insertRow();

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//Ajustar o tipo
		switch(d.tipo){
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break
			
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

	})
 }



 