//Client Controller
var clientController = (function() {

    var Client = function(id, name, location) {
        this.id = id;
        this.name = name;
        this.location = location;
    };

    var data = {
        client: []
    };

    return {
        addClient: function(name, location) {
            var newClient, ID;

            //Create new ID
            if(data.client.length > 0) {
                ID = data.client[data.client.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new client 
            newClient = new Client(ID, name, location);

            //Push it into our data structure
            data.client.push(newClient);

            //Return new client
            return newClient;
        },
        deleteClient: function(id) {
            var ids, index;
      
            ids = data.client.map(function(current) {
              return current.id;
            });
            index = ids.indexOf(id);
      
            if(index !== -1) {
              data.client.splice(index, 1);
            }
        },
        testing: function() {
            console.log(data);
        },
        getClients:function(){
            return data.client;
        },
        pushClients:function(obj){
            data.client.push(obj);
        }
    }

})();

//UI Controller
var UIController = (function() {
    
    var DOMstrings = {
        inputName: '.add_name',
        inputLocation: '.add_location',
        inputBtn: '.add_btn',
        clientsList: '.clients_list',
        container: '.client',
    };

    return {
        getInput: function() {
            return {
                name: document.querySelector(DOMstrings.inputName).value,
                location: document.querySelector(DOMstrings.inputLocation).value
            };
        },

        addListClient: function(obj) {
            var html, newHtml, element;

            //Create HTML string
            element = DOMstrings.clientsList;
            html = '<div class="item" id="client-%id%"><div class="row" style="text-align: center;"><div class="col"><div class="item_name">%name%</div></div><div class="col"><div class="item_location">%location%</div></div><div class="col"><button class="btn btn-danger btn_delete"><i class="far fa-trash-alt"></i></button></div></div></div>';

            //Replace the placeholder text with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%name%', obj.name);
            newHtml = newHtml.replace('%location%', obj.location);

            //Insert the html to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListClient: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputName + ', ' + DOMstrings.inputLocation);
      
            fieldsArr = Array.prototype.slice.call(fields);
      
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();

//Global App Controller
var controller = (function(clientCtrl, UICtrl) {

    var setupEventListeners = function() {
        
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddClient);

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddClient();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteClient);
    };
    
    var ctrlAddClient = function() {
        var input, newClient;
        input = UICtrl.getInput();
        //Get the field input data
        if(input.name !== "" && input.location !== "") {
            //Add the client to the client controller
            newClient = clientCtrl.addClient(input.name, input.location);

            //Add the client to the UI
            UICtrl.addListClient(newClient);

            //Clear the fields
            UICtrl.clearFields();
        };              
    };

    var ctrlDeleteClient = function(event) {
        var clientID, splitID, ID;

        clientID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(clientID) {
            splitID = clientID.split('-');
            ID = parseInt(splitID[1]);
      
            //Delete the item from the data structure
            clientCtrl.deleteClient(ID);
      
            //Delete the item from the UI
            UICtrl.deleteListClient(clientID);
        }
    };

    var saveToLocalStorage  = function(){
        var clients  = clientController.getClients();
       localStorage.setItem("clients",JSON.stringify(clients));
    }

    return {
        init: function() {
            console.log("Application has started.");
            window.addEventListener('beforeunload', function(event) {
                saveToLocalStorage();
            });
            //Get Clients from localstorage  
              var clients = localStorage.getItem('clients');
              clients = JSON.parse(clients);
              if(clients!=null)
                clients.forEach((client)=>{
                    newClient = clientController.addClient(client.name, client.location);
                    UICtrl.addListClient(newClient);

                });
            setupEventListeners();
        }        
    };
    

})(clientController, UIController);

controller.init();