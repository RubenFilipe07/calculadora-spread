dados = {
  iof: 6.38,
  spread: {
    bancoDoBrasil: 4,
    bancoDoNordeste: 5,
    banrisul: 3,
    bradesco: 5.3,
    brb: 4,
    bv: 4.5,
    c6: 4,
    caixa: 4.6,
    credicard: 5.5,
    inter: 1,
    itau: 5.5,
    nubank: 4,
    pan: 6,
    portoSeguro: 5,
    safra: 7,
    santander: 6,
    sicoob: 0,
    sicredi: 1,
    unicred: 0,
    uniprime: 5
  }
}

$(document).ready(function () {

  let data = new Date();
  let dia = data.getDate()
  let mes = data.getMonth() + 1
  let ano = data.getFullYear()

  let cotacaoDolar;

  function pegarDados() {
    $.ajax({
      type: "GET",
      dataType: "JSON",
      url: `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${mes}/${dia}/${ano}'&$top=1&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`,
      success: function (data) {
        $('.alert').hide();

        if (data.value == '') {
          dia -= 1
          pegarDados()
        } else {
          cotacaoDolar = data.value['0']['cotacaoCompra']
        }
      },
      error: function () {
        $('.alert').show();
        $('#mensagem-erro').text('Erro! o site não conseguiu carregar os valores atuais da cotação. Tente novamente mais tarde. :(')
      }
    })
  }

  pegarDados()
  
  function calcular(banco) {
    let entrada = $("#entrada").val()
    let entradaEmDolar = entrada * cotacaoDolar
    let porcentagemSpread = entradaEmDolar * (dados.spread[banco] / 100)
    let porcentagemIof = (entradaEmDolar + porcentagemSpread) * (dados.iof / 100)
    let resultado = entradaEmDolar + porcentagemSpread + porcentagemIof


    if (isNaN(resultado)) {
      $('#saida').hide();
    }
    else if (resultado == 0) {
      $('.alert').show();
      $('#mensagem-erro').text('Digite um valor')
      $('#saida').show();
      $('#saida').text(`Resultado: R$ ${resultado}`)
    }
    else {
      resultado = resultado.toFixed(2).replace(".", ",");
      $('.alert').hide();
      $('#saida').show();
      $('#saida').text(`Resultado: R$ ${resultado}`)
    }
  }

  $("#calcular").click(function () {
    let selecionado = $("#select-bancos option:selected").val();
    if (selecionado == "null") {
      $('#saida').hide();
      $('.alert').show();
      $('#mensagem-erro').text('Selecione um banco')
    } else {
      calcular(selecionado)
    }
  })

  $(".btn-close").click(function () {
    $('.alert').hide();
  });
});