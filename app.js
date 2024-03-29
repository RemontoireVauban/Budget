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
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else{
        this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    };


    var data = {
       allItems: {
           exp: [],
           inc: []
       },
       totals: {
           exp: 0,
           inc: 0
       },
       budget: 0,
       percentage: -1
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

        deleteItem: function(type, id) {

        var ids, index;

           ids = data.allItems[type].map(function(current){ //map returns new array
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // calc total inc and exp
            calculateTotal ('exp');
            calculateTotal ('inc');
            // calc budget
            data.budget = data.totals.inc - data.totals.exp;
            // calc percent spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }

            
        },

        calculatePercentages: function(){

             
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
             });

        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget, 
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };
    

    return {
        getInput: function() {
            return {
            type: document.querySelector(DOMstrings.inputType).value, // Will be inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value, 
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
         },

         addListItem: function(obj, type) {

            var html;
            // create html string with placeholder text
            if (type === 'inc'){
            element = DOMstrings.incomeContainer;
            html =  '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                ;}
            else if (type === 'exp'){
            element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            ;}

            // replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            // insert the html into dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

         },

         deleteListIten: function(selectorID) {
           var el = document.getElementById(selectorID);
           el.parentNode.removeChild(el);

         },

         clearFields:  function(){
           var fields, fieldsArr;

           fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

           fieldsArr = Array.prototype.slice.call(fields);

           fieldsArr.forEach(function(current, index, array){
               current.value = "";
           });

           fieldsArr[0].focus();

         },

         displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
         },

         displayPercentages: function(percentages){

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index){

                if(percentages[index] > 0){
                current.textContent = percentages[index] + '%';
                }
                else {
                    current.textContent = '---';
                }
            });

         },

         displayMonth: function() {
             var now, months, month, year;
             now = new Date();

             months = ['January', 'February', 'March', 'April', 'May', 
             'June', 'July', 'August', 'September', 'October', 'November', 'December'];

             month = now.getMonth();

             year = now.getFullYear();
             document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

};

    var updateBudget = function() {
        
        //calculate budget
        budgetCtrl.calculateBudget();

        //return budget
        var budget = budgetCtrl.getBudget();

        //display budget
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        //calc percent
        budgetCtrl.calculatePercentages();
        //read perecent
        var percentages = budgetCtrl.getPercentages();
        //update UI
        UICtrl.displayPercentages(percentages);
    }


    var ctrlAddItem = function() {
        
        //get input data
        var input = UICtrl.getInput();
        console.log(input);

        if(input.description !== "" && !isNaN(input.value) && input.value > 0 ) {//description should be filled and number should be a number

        //add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        console.log(' new item added')


        //add the new item to UI
        UICtrl.addListItem(newItem, input.type);

        //clear the fields
        UICtrl.clearFields();

        //calculate and update budget
        updateBudget();

        //calc and update percent
        updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            // inc -1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            //delete from data structure
            budgetCtrl.deleteItem(type, ID);
            //delete from UI
            UICtrl.deleteListIten(itemID);
            //update UI
            updateBudget();
        }
    };

    return {
        init: function(){
            console.log('App is live!');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }


}) (budgetController, UIController);

controller.init();