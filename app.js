//Budget Controller
var budgetController = (function() {
  var Sale = function(id, client, article, amount, price = 0) {
    this.id = id;
    this.client = client;
    this.article = article;
    this.amount = amount;
    this.price = price;
  };

  var data = {
    sale: [],
    budget: 0
  };

  return {
    addSale: function(client, article, amount, price) {
      var newSale, ID;

      //Create new ID
      if (data.sale.length > 0) {
        ID = data.sale[data.sale.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new Sale
      newSale = new Sale(ID, client, article, amount, price);

      //Push it into data
      data.sale.push(newSale);

      //Return newSale
      return newSale;
    },
    getAllSales: () => {
      return data.sale;
    },
    deleteSale: function(id) {
      var ids, index;

      ids = data.sale.map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);

      if (index != -1) {
        data.sale.splice(index, 1);
      }
    },
    getTotalBudget: () => {
      data.sale.forEach(e => {
        data.budget += Number(e.amount) * Number(e.price);
      });
      return data.budget;
    },

    testing: function() {
      console.log(data);
    }
  };
})();

//UI Controller
var UIController = (function() {
  var DOMstrings = {
    inputBtn: ".add_btn",
    inputAmount: ".add_amount",
    salesList: ".sales_list",
    budgetLabeL: ".budget_value",
    dateLabel: ".date",
    container: ".sales"
  };

  return {
    getInput: function() {
      var clientSelected = document.getElementById("clientsDom");
      var articleSelected = document.getElementById("articlesDom");

      return {
        client: clientSelected.options[clientSelected.selectedIndex].value,
        article:
          articleSelected.options[articleSelected.selectedIndex].innerHTML,
        amount: parseFloat(
          document.querySelector(DOMstrings.inputAmount).value
        ),
        articlePrice:
          articleSelected.options[articleSelected.selectedIndex].value
      };
    },

    addListSale: function(obj) {
      var html, newHtml, element;

      //Create html string
      element = DOMstrings.salesList;
      html =
        '<div class="item" id="sale-0"><div class="row" style="text-align: center;"><div class="col"><div class="item_name">%client%</div></div><div class="col"><div class="item_article">%article%</div></div><div class="col"><div class="item_amount">%amount%</div></div><div class="col"><div class="item_budget">%budget%</div></div><div class="col"><button class="btn btn-danger btn_delete"><i class="far fa-trash-alt"></i></button></div></div> </div>';

      //Replace the placeholder text
      newHtml = html.replace("%client%", obj.client);
      newHtml = newHtml.replace("%article%", obj.article);
      newHtml = newHtml.replace("%amount%", obj.amount);
      newHtml = newHtml.replace("%budget%", obj.amount * obj.price);

      //Insert the html to the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
      this.displayBudget(budgetController.getTotalBudget());
    },

    deleteListSale: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMstrings.inputAmount);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
    },

    displayDate: function() {
      var now, date, months, month, year;

      now = new Date();

      date = now.getDate();

      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      month = now.getMonth();

      year = now.getFullYear();

      document.querySelector(DOMstrings.dateLabel).textContent =
        date + " " + months[month] + " " + year;
    },
    displayBudget: function(bg) {
      document.querySelector(DOMstrings.budgetLabeL).textContent = bg + " Lekë";
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//Global App Controller
var controller = (function(budgetCtrl, UICtrl) {
  var sameDay = function(d1, d2) {
    d1 = Date.parse(d1);
    d2 = Date.parse(d2);
    return d1 - d2 >= 86400000;
    /*return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );*/
  };
  var saveToLocalStorage = function() {
    var sales = budgetController.getAllSales();
    localStorage.setItem("sales", JSON.stringify(sales));
    localStorage.setItem(
      "sales_datecreated",
      JSON.stringify({ date: new Date().toISOString().split("T")[0] })
    );
  };
  var getFromLocalStorage = function(storageName) {
    var storage = localStorage.getItem(storageName);
    storage = JSON.parse(storage);
    return storage != null ? storage : [];
  };
  var populateUi = function() {
    var populateSelect = function(storageName, selectDom) {
      var storage = JSON.parse(localStorage.getItem(storageName));
      var dom = document.getElementById(selectDom);

      storage.forEach(function(el) {
        var opt = document.createElement("option");
        opt.value = el.value != null ? el.value : el.name;
        opt.innerHTML = el.name;
        dom.appendChild(opt);
      });
    };
    var storageElements = [
      { storageName: "clients", domElement: "clientsDom" },
      { storageName: "articles", domElement: "articlesDom" }
    ];

    storageElements.forEach(el => {
      populateSelect(el.storageName, el.domElement);
    });
  };
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddSale);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddSale();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteSale);
  };

  var updateBudget = function() {
    //Calculate the budget
    //Return the budget
    //Display the budget in the UI
  };

  var ctrlAddSale = function() {
    var input, newSale;

    //Get the field input data
    input = UICtrl.getInput();

    if (
      input.client !== "Select a client" &&
      input.article !== "Select an article" &&
      !isNaN(input.amount) &&
      input.amount > 0
    ) {
      //Add the sale to the budget controller
      newSale = budgetCtrl.addSale(
        input.client,
        input.article,
        input.amount,
        input.articlePrice
      );

      //Add the sale to the UI Controller
      UICtrl.addListSale(newSale);

      //Clear fields
      UICtrl.clearFields();

      //Calculate and update budget
      updateBudget();
    }
  };

  var ctrlDeleteSale = function(event) {
    var saleID, splitID, ID;

    saleID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (saleID) {
      splitID = saleID.split("-");
      ID = parseInt(splitID[1]);

      //Delete the item from the data structure
      budgetCtrl.deleteSale(ID);

      //Delete the item from the UI
      UICtrl.deleteListSale(saleID);

      //Update and show the new budget
      updateBudget();
    }
  };

  return {
    init: function() {
      UICtrl.displayDate();
      UICtrl.displayBudget(budgetController.getTotalBudget());
      populateUi();
      window.addEventListener("beforeunload", function(event) {
        saveToLocalStorage();
      });
      var getFormlocalS = getFromLocalStorage("sales_datecreated");

      if (typeof getFormlocalS.date != "undefined") {
        var dateNow = new Date().toISOString().split("T")[0];

        if (sameDay(dateNow, getFormlocalS.date))
          localStorage.removeItem("sales");
      }
      var a = getFromLocalStorage("sales");
      if (a != null)
        a.forEach(c => {
          if (c.price != 0) {
            newSale = budgetController.addSale(
              c.client,
              c.article,
              c.amount,
              c.price
            );
            UICtrl.addListSale(newSale);
          }
        });

      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
