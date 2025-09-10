//elementos do formulário 
const form = document.querySelector('form');
const amount = document.getElementById('amount');
const expense = document.getElementById('expense');
const category = document.getElementById('category');

// seleciona a lista de despesas
const expenseList = document.querySelector('ul');
const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

//captura o evento de submit do formulário
form.onsubmit = (event) => {
  event.preventDefault()

  //cria o objeto com os dados do formulário
  const data = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date()
  }

  //zerar o formulário 
  form.reset()

  //adiciona a despesa na lista
  addExpense(data)
}

//captura o evento de input para formatar o valor
amount.oninput = () => {

  //remove tudo que não for número
  let value = amount.value.replace(/\D/g, "")

  //converte o valor para centavos
  value = Number(value) / 100

  //atualiza o valor do campo com a formatação
  amount.value = formatCurrencyBRL(value)

}


//função para formatar o valor em moeda brasileira
function formatCurrencyBRL(value) {

  value = value.toLocaleString('pt-BR',
    {
      style: 'currency',
      currency: 'BRL'
    }
  )

  //retorna o valor formatado
  return value
}

//função para adicionar a despesa na lista
function addExpense(data) {
  try {

    // cria o elemento li(item)    
    const item = document.createElement('li')
    //adiciona a classe de estilização expense-item
    item.classList.add('expense')

    //montar o conteúdo do item
    const itemContent = document.createElement('div')
    itemContent.classList.add('expense-info')

    //criar o nome da despesa
    const itemName = document.createElement('strong')
    itemName.textContent = data.expense

    //criar a categoria da despesa
    const itemCategory = document.createElement('span')
    itemCategory.textContent = data.category_name

    //adicionar name e category na div itemContent
    itemContent.append(itemName, itemCategory)

    //adicionar o item a lista de despesas e
    expenseList.append(item, itemContent)

    //criar valor da despesas
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>
    ${data.amount
        .toUpperCase()
        .replace("R$", " ")}`


    // criar ícone
    const iconItem = document.createElement('img')
    // pegar ele dinamicamente de acordo com a categoria
    iconItem.setAttribute('src', `./img/${data.category_id}.svg`)
    iconItem.setAttribute('alt', data.category_name)

    //criar icon de remover
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "remover")

    //adicionar o ícone ao item
    item.append(iconItem, itemContent, expenseAmount, removeIcon)

    //adicionar os totais de despesas
    updateTotals()


  } catch (error) {
    console.error(error)
    alert('Erro ao adicionar despesa')
  }
}


//atualizar os totais
function updateTotals() {
  try {

    //recupera  todos os itens da lista
    const items = expenseList.children

    //atualiza a quantidade de itens de lista
    expenseQuantity.textContent = `${items.length} 
    ${items.length > 1 ? "despesas" : "despesa"} `

    //incrementar o total de despesas
    let total = 0

    //percorrer cada item da lista
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      // remover caracteres não numéricos e substitui virgula pelo ponto
      let value = itemAmount.textContent
        .replace("R$", "")
        .replace(/\./g, "") // remove separador de milhar
        .replace(",", ".")  // converte vírgula para ponto

      //converter o valo para float
      value = parseFloat(value)

      //verifica se é um numero valido 
      if (isNaN(value)) {
        return alert("não foi possível calcular o total. O valor não parece ser um numero ")
      }

      //incrementar o valor total 
      total += Number(value)
    }

    // limpar o conteúdo antes de atualizar
    expenseTotal.innerHTML = ""

    //exibir o total na span formatado 
    const symbolBrl = document.createElement("small")
    symbolBrl.textContent = "R$"

    // formata o valor e remove o R$ que sera exibido pela small com um estilo customizado 
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    //adiciona o simbolo da moeda e o valor formatado
    expenseTotal.append(symbolBrl, total)

  } catch (error) {
    console.log(error)

  }
}

// evento que captura o clique  nos itens da lista
expenseList.addEventListener("click", function (event) {

  // verifica se o elemento clicado e o ícone de remover
  if (event.target.classList.contains("remove-icon")) {
    //obtém a li pai do elemento clicado
    const item = event.target.closest(".expense")
    //remove o item da lista
    item.remove()

    // atualiza a lista de total 
    updateTotals()

    //limpa o formulário 
    formClear()
  }
})

// limpar o formulário
function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""

//foca no input
  expense.focus()
}