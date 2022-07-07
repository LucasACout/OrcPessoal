//Script
class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano,
    this.mes = mes,
    this.dia = dia,
    this.tipo = tipo,
    this.descricao = descricao,
    this.valor = valor
  }

  validarDados() {
    for(let i in this){
      if(this[i] == undefined || this[i] == '' || this[i] == null){
        return false;
      }
    }
    return true;
  }
}

class BD {
  constructor() {
    let proximoID  = localStorage.getItem('id');

    if(proximoID === null){
      localStorage.setItem('id', 0);
    }
  }

  getProximoID() {
    let proximoID  = localStorage.getItem('id');
    return parseInt(proximoID) + 1;
  }

  gravar(d) {
    let id = this.getProximoID();

    localStorage.setItem(id, JSON.stringify(d));

    localStorage.setItem('id', id);
  }

  recuperarTodosRegistros() {
    let idNums = localStorage.getItem('id');
    let despesas = Array();

    for(let i = 1; i <= idNums; i++){
      let despesa = JSON.parse(localStorage.getItem(i));
      
      if(despesa === null){
        continue;
      }

      despesa.id = i;

      despesas.push(despesa);
    }

    return despesas;
  }

  pesquisar(despesa) {
    let despesasFiltradas = Array();
    despesasFiltradas = this.recuperarTodosRegistros(); 

    //Ano
    if(despesa.ano != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
    }

    //Mes
    if(despesa.mes != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
    }
    
    //Dia
    if(despesa.dia != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
    }
    
    //Tipo
    if(despesa.tipo != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
    }

    //Descricao
    if(despesa.descricao != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
    }

    //Valor
    if(despesa.valor != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
    }
   
    return despesasFiltradas;
  }

  remover(id){
    localStorage.removeItem(id);
  }
}

var bd = new BD();

function cadastrarDespesa() {

  let ano = document.getElementById('ano').value;
  let mes = document.getElementById('mes').value;
  let dia = document.getElementById('dia').value;
  let tipo = document.getElementById('tipo').value;
  let descricao = document.getElementById('descricao').value;
  let valor = document.getElementById('valor').value;

  let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor);

  
  if(despesa.validarDados()){
    bd.gravar(despesa);

    document.getElementById('exampleModalLabel').innerHTML = 'Registro inserido com sucesso';
    document.getElementById('modalBody').innerHTML = 'Despesa foi cadastrada com sucesso!';
    document.getElementById('btnFooter').innerHTML = 'Voltar';
    document.getElementById('modalHeader').className = 'modal-header text-success';
    document.getElementById('btnFooter').className = 'btn btn-success'; 

    ano.value = '';
    mes.value = '';
    dia.value = '';
    tipo.value = '';
    descricao.value = '';
    valor.value = '';

    //Jquery
    $('#modalRegistraDespesa').modal('show');
  }else{

    document.getElementById('exampleModalLabel').innerHTML = 'Erro na gravação';
    document.getElementById('modalBody').innerHTML = 'Existem campos obrigatórios que não foram preenchidos';
    document.getElementById('btnFooter').innerHTML = 'Voltar e corrigir';
    document.getElementById('modalHeader').className = 'modal-header text-danger';
    document.getElementById('btnFooter').className = 'btn btn-danger';

    //Jquery
    $('#modalRegistraDespesa').modal('show');
  }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

  if(despesas.length == 0 && filtro == false){
    despesas = bd.recuperarTodosRegistros();
  }
  
  var listaDespesas = document.getElementById('listaDespesas');
  listaDespesas.innerHTML = '';

  despesas.forEach(element => {

    let linha = listaDespesas.insertRow();

    linha.insertCell(0).innerHTML = `${element.dia}/${element.mes}/${element.ano}`;

    switch(element.tipo){
      case '1': element.tipo = 'Alimentação';
        break;
      case '2': element.tipo = 'Educação';
        break;
      case '3': element.tipo = 'Lazer';
        break;
      case '4': element.tipo = 'Saúde';
        break;
      case '5': element.tipo = 'Transporte';
        break;
    }

    linha.insertCell(1).innerHTML = element.tipo;
    linha.insertCell(2).innerHTML = element.descricao;
    linha.insertCell(3).innerHTML = element.valor;

    let btn = document.createElement('button');
    btn.className = 'btn btn-danger';
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.id = `idDespesa_${element.id}`;
    btn.onclick = function() {
      let id = this.id.replace('idDespesa_', '');

      bd.remover(id);

      window.location.reload();
    };
    linha.insertCell(4).append(btn);

  });
}

function pesquisarDespesa() {
  let ano = document.getElementById('ano').value;
  let mes = document.getElementById('mes').value;
  let dia = document.getElementById('dia').value;
  let tipo = document.getElementById('tipo').value;
  let descricao = document.getElementById('descricao').value;
  let valor = document.getElementById('valor').value;

  let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor);
  let despesas = bd.pesquisar(despesa);
  this.carregaListaDespesas(despesas,true);
};