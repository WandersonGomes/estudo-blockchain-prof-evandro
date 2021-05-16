console.log("Main loading...")

const purchaseService = require('./purchase-service.js');
const paymentsService = require('./payments-service.js');
const commentsService = require('./comments-service.js');

App = {
  store: [], //database de produtos
  commentsInMemory: [], //database dos comentarios

  walletMapping: {
    'Drake': '0x1Ba2717ed9FBcA97527baA9Bb5C1C496e25ef190'.toLowerCase(),
    'Bianca': '0x439e3e5bCF49096CF8EC3EA64fcD699118FB289E'.toLowerCase(),
    'Harish': '0x3Ff0365f8BFd1ab353b9bB52F6207f009b602aCd'.toLowerCase(),
    'STORE': '0xf408bB0Ec1Bd265738607c0804DF009486bb72c7'.toLowerCase()
  },
  amountInWallet: 0,

  //usuario logado
  currentUser: function () {
    console.log("Capturando o usuario atual...");
    return $('#login-input').find('.input').val();
  },

  //carteira do usuario logado
  userWallet: function (user) {
    console.log("Pegando a carteira do usuario logad...");
    return this.walletMapping[user];
  },

  //inicializar aplicacao
  init: async function() {
    console.log("Inicializando a aplicacao...");

    //inicializar os servicos
    await purchaseService.init();
    await paymentsService.init();
    await commentsService.init();

    console.log('loading products...');
    const products = await purchaseService.getProducts();
    this.store = products.data;
    console.log('store data is', this.store);
    this.printProducts();
    this.printComments();
    console.log('products loaded...');
  },

  showProduct: function (product) {
    $("#template-object").clone().prependTo("#product-area").attr("id", product.id).removeClass("is-hidden");
    $('#' + product.id).find('.product-name').text(product.product);
    $('#' + product.id).find('.company-name').text(product.company);
    $('#' + product.id).find('.product-description').text(product.description);
    $('#' + product.id).find('.product-amount').text(parseInt(product.quantity, 16));
    $('#' + product.id).find('.product-price').text(product.price).data('price', product.price).data('productID', product.product);
    $('#' + product.id).find('.comment-area').attr('id', product.id + '-comment-area');
    $('#' + product.id).find('.card-content').attr('id', product.id + '-card-content');
    $('#' + product.id).find(".post-comment").attr('id', product.id + '-comment');
    $('#' + product.id).find(".buy-now").attr('id', product.id + '-buy');
    $('#' + product.id).find(".image").css('background-image', 'url(' + product.url + ')');

    $('#' + product.id).find(".post-comment").click(function () {
      App.postComment($('#' + this.id).closest(".column").attr('id'));
    });
    $('#' + product.id).find(".buy-now").click(function () {
      App.purchase($('#' + this.id).closest('.column').find('.product-price').data('price'), $('#' + this.id).closest('.column').find('.product-price').data('productID'));
    });
  },

  customerOwnedProduct: async function () {
    const customer = this.userWallet(this.currentUser());

    this.amountInWallet = await paymentsService.balanceOf(customer);

    console.log("O usuario possui tantos tokens na carteira: " + this.amountInWallet);

    //verifica se a loja tem algum produto
    if (this.store) {
      //percorre a lista de produtos
      for (let i = 0; i <= this.store.length; i++) {
        if(this.store[i] != undefined){
          const product = this.store[i].product;
          const purchasersArray = await this.getWhoBoughtProduct(product);
          //verifica se o usuario atual e um comprador do produto
          if (purchasersArray.indexOf(customer) > -1) {
            //autoriza o comentario
            $('#' + product.replace(/\s/g, '') + '-buy').text('Purchased').attr('disabled', true);
            $('#' + product.replace(/\s/g, '') + '-comment-area').attr('disabled', false);
          } else {
            $('#' + product.replace(/\s/g, '') + '-buy').text('Buy Now').attr('disabled', false);
            $('#' + product.replace(/\s/g, '') + '-comment-area').attr('disabled', true);
          }
        }
      }
    }
  },

  printProducts: function () {
    console.log("printProducts...");
    if (this.store) {
      for (let i = 0; i < this.store.length; i++) {
        this.showProduct(this.store[i])
      }
    }
  },

  createNewProduct: async function () {
    console.log("Criando um novo produto...");

    let newProductName = $("#new-product-name").val();
    let newProductImage = $("#new-product-image").val();
    let newProductCompany = $("#new-product-company").val();
    let newProductDescription = $("#new-product-description").val();
    let newProductAmount = $("#new-product-amount").val();
    let newProductPrice = $("#new-product-price").val();
    let newProductID = newProductName.replace(/\s/g, '');
    let newProduct = { product: newProductName, id: newProductID, url: newProductImage, description: newProductDescription, company: newProductCompany, quantity: newProductAmount, price: newProductPrice }

    if (this.store === undefined) {
      this.store = [newProduct];
    } else {
      this.store.push(newProduct);
    }

    this.clearProductModal();
    this.showProduct(newProduct);

    await purchaseService.addProduct(newProductName, newProductAmount, newProductImage, newProductDescription, newProductPrice, newProductCompany, newProductID);
  },

  clearProductModal: function () {
    $('.modal').removeClass('is-active');
    $("#new-product-name").val('');
    $("#new-product-image").val('');
    $("#new-product-company").val('');
    $("#new-product-description").val('');
    $("#new-product-amount").val('');
    $("#new-product-price").val('');
  },

  storeNewComment: async function (commentText, ID) {
    const reqBody = {
      "asset": ID,
      "comment": commentText
    };
    this.addCommentsInMemory(reqBody);
    commentsService.postComment(reqBody);
  },

  postComment: async function (commentID) {
    let commentTextElement = $('#' + commentID + '-comment-area');
    let commentText = commentTextElement.val().trim();
    if (commentText == '') return;
    this.showComment(commentText, commentID);
    commentTextElement.val('');
    this.storeNewComment(commentText, commentID);
    this.readCommentsInMemory();
  },

  showComment: function (comment, commentID) {
    let commentTemplate = $('#' + commentID).find('.comment:first').clone().removeClass('is-hidden');
    commentTemplate.html('<article class="is-warning message"><div class="message-body">' + comment + ' — Verified Customer </div></article>');
    let lastComment = $('#' + commentID).find('.comment:last');
    commentTemplate.insertBefore(lastComment);
  },

  printComments: async function () {
    comments = await commentsService.getComments()
    comments.data.forEach((data) => {
      this.addCommentsInMemory(data)
    });
    let commentArray = this.readCommentsInMemory();
    for (i = 0; i <= commentArray.length; i++) {
      if (commentArray[i] != undefined) {
        this.showComment(commentArray[i].comment, commentArray[i].asset);
      }
    }
  },

  payForProduct: async function (buyer, seller, amount, productID) {
     await purchaseService.purchaseProduct(productID, buyer);
     await paymentsService.transferFrom(buyer, seller, amount);

     alert('Thanks for shopping');
     console.log('purchase complete');
  },

  purchase: async function (productPrice, productID) {
    user = this.userWallet(this.currentUser());
    if (user == NaN || user == undefined) {
      alert('Not logged in');
      return;
    }
    store = this.userWallet('STORE');
    if (this.amountInWallet < productPrice) {
      alert("You Don't Have Enough Money");
      return;
    }
    this.payForProduct(user, store, productPrice, productID)
    $('#' + productID.replace(/\s/g, '') + '-buy').text('Purchased');
    this.customerOwnedProduct();
  },

  addCommentsInMemory: function (commentData) {
    this.commentsInMemory.push(commentData);
  },

  readCommentsInMemory: function () {
    return this.commentsInMemory;
  },

  getWhoBoughtProduct: async function (productID) {
    const purchasersArray = await purchaseService.getPurchasers(productID);
    return purchasersArray.map(name => name.toLowerCase());
  }
}


//quando a janela e carregada a aplicacao e inicializada
$(window).on('load', function () {
  App.init();
});
