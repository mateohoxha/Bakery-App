//Article Controller
var articlesController = (function() {

    var Article = function(id, name, value) {
        this.id = id;
        this.name = name;
        this.value = value;
    };

    var data = {
        articles: []
    };

    return {
        addArticle: function(name, value) {
            var newArticle, ID;

            //Create new ID
            if(data.articles.length > 0) {
                ID = data.articles[data.articles.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new Article 
            newArticle = new Article(ID, name, value);

            //Push it into our data structure
            data.articles.push(newArticle);

            //Return new Article
            return newArticle;
        },
        deleteArticle: function(id) {
            var ids, index;
      
            ids = data.articles.map(function(current) {
              return current.id;
            });
            index = ids.indexOf(id);
      
            if(index !== -1) {
              data.articles.splice(index, 1);
            }
        },

        testing: function() {
            console.log(data);
        },
        getArticles: function() {
            return data.articles;   
        },
        pushArticles: function(obj) {
            data.articles.push(obj);
        }
    }

})();

//UI Controller
var UIController = (function() {
    
    var DOMstrings = {
        inputName: '.add_name',
        inputValue: '.add_value',
        inputBtn: '.add_btn',
        articlesList: '.articles_list',
        container: '.articles'
    };

    return {
        getInput: function() {
            return {
                name: document.querySelector(DOMstrings.inputName).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListArticle: function(obj) {
            var html, newHtml, element;

            //Create HTML string
            element = DOMstrings.articlesList;
            html = '<div class="item" id="article-%id%"><div class="row" style="text-align: center;"><div class="col"><div class="item_name">%name%</div></div><div class="col"><div class="item_value">%value% lekë</div></div><div class="col"><button class="btn btn-danger btn_delete"><i class="far fa-trash-alt"></i></button></div></div></div>';

            //Replace the placeholder text with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%name%', obj.name);
            newHtml = newHtml.replace('%value%', obj.value);

            //Insert the html to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListArticle: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputName + ', ' + DOMstrings.inputValue);
      
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
var controller = (function(articleCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddArticle);

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddArticle();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteArticle);
    };

    var ctrlAddArticle = function() {
        var input, newArticle;

        //Get the field input data
        input = UICtrl.getInput();

        if(input.name !== "" && input.value !== "") {
            //Add the Article to the Article controller
            newArticle = articleCtrl.addArticle(input.name, input.value);

            //Add the Article to the UI
            UICtrl.addListArticle(newArticle);

            //Clear the fields
            UICtrl.clearFields();
        };              
    };

    var ctrlDeleteArticle = function(event) {
        var articleID, splitID, ID;

        articleID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(articleID) {
            splitID = articleID.split('-');
            ID = parseInt(splitID[1]);
      
            //Delete the item from the data structure
            articleCtrl.deleteArticle(ID);
      
            //Delete the item from the UI
            UICtrl.deleteListArticle(articleID);
        }
    };

    var saveToLocalStorage = function(){
        var articles = articlesController.getArticles();
        localStorage.setItem("articles", JSON.stringify(articles));
    };

    return {
        init: function() {
            console.log("Application has started.");
            window.addEventListener('beforeunload', function(event) {
                saveToLocalStorage();
            });
            //Get Articles from localstorage
            var articles = localStorage.getItem("articles");
            articles = JSON.parse(articles);
            if(articles!= null) 
            articles.forEach((articles)=> {
                newArticle = articlesController.addArticle(articles.name, articles.value);
                UICtrl.addListArticle(newArticle);
            });           
            setupEventListeners();
        }
    };

})(articlesController, UIController);

controller.init();