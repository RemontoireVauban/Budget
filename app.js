//add event handler - controller module
//get data from input -ui module
//add item to data - data module
//print data to ui -ui module
//calculate budget - data module
//update ui -ui module


// BUDGET CONTROLLER

var budgetController = (function(){  //iffe function - private scope

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
       allItems: {
           exp: [],
           inc: []
       },
       totals: {
           exp: 0,
           inc: 0
       }
    };

    return {
        addItem: function(type, des, val) {
          var newItem, ID;

          //ID = last ID + 1
          // create new ID
          if(data.allItems[type].length > 0){
          ID = data.allItems[type][data.allItems[type].length - 1].id + 1;}
          else{
          ID = 0;
          }
          // creatre new item based on 'inc' or 'exp' type
          if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            	} else if (type == 'inc') {
                    newItem = new Income(ID, des, val);
                }
        
        data.allItems[type].push(newItem); // push exp or inc into array
        return newItem; // return new element
        },

        testing: function() {
            console.log(data);
        }
    };

})();


// UI CONTROLLER

var UIController = (function()  {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getInput: function() {
            return {
            type: document.querySelector(DOMstrings.inputType).value, // Will be inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value, 
            value: document.querySelector(DOMstrings.inputValue).value
            }
         },

         getDomstrings: function(){ //make DomStrings public
             return DOMstrings;
         }
     };
})();



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

var setupEventListeners = function() {

    var DOM = UICtrl.getDomstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13) {
             console.log('ENTER was pressed')
            ctrlAddItem();
        }
    });

};




    var ctrlAddItem = function() {
        
        //get input data
        var input = UICtrl.getInput();
        console.log(input);

        //add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        console.log(' new item added')


        //add the new item to UI

        //calculate budget

        //display budget
    };

    return {
        init: function(){
            console.log('App is live!');
            setupEventListeners();
        }
    }


}) (budgetController, UIController);

controller.init();