//selectors
const main = document.getElementById("main");
const grid = document.getElementById("grid");
const formula = document.getElementById("formula");

//----------------
let GridModel ={

    getGridState: ()=>{
        return JSON.parse(localStorage.getItem('gridState'));
    },

    setGridState: (newGridState)=>{
        localStorage.setItem('gridState', JSON.stringify(newGridState));
    }
}

//event listeners
formula.addEventListener("change", ()=>{
    
    let newGridState = GridModel.getGridState();
    newGridState[selectedCell.column][selectedCell.row] = formula.value;
    GridModel.setGridState(newGridState);
    
    updateGrid();
});




//main
const ROWS = 10;
const COLUMNS = 10;
let selectedCell = {column: 0, row: 0};


if(GridModel.getGridState() == null){
    let gridState = [];
    for(var i=0; i<COLUMNS; i++) {
        gridState[i] = new Array(ROWS);
    }

    //localStorage.setItem('gridState', JSON.stringify(gridState));
    GridModel.setGridState(gridState);
}

generateCells(GridModel.getGridState());




//functions
function generateCells(gridState){

    //Generate empty cell that corresponds to the upper left, where there is nothing
    let cell = document.createElement("div");
    cell.classList.add("cell", "cell--label");
    grid.append(cell);

    //Generate letter lables on top to represent the columns
    for(var i=0; i<COLUMNS; i++){
        let cell = document.createElement("div");
        cell.classList.add("cell", "cell--label");
        cell.innerText = String.fromCharCode(97 + i);
        grid.append(cell);
    }

    for(var i=0; i<ROWS; i++) {

        //Generate number lable to represent each row
        let cell = document.createElement("div");
        cell.classList.add("cell", "cell--label");
        cell.innerText = i;
        grid.append(cell);


        for(var j=0; j<COLUMNS; j++) {
            let cell = document.createElement("div");
            let input = document.createElement("input");

            cell.classList.add("cell");
            if(selectedCell.column == j && selectedCell.row == i){
                cell.classList.add("cell--selected");
            }

            input.value = gridState[j][i] == undefined? "" : valueShownToUser(gridState[j][i]);
            input.dataset.column = j;
            input.dataset.row = i;

            input.addEventListener('click', ()=>{
                
                selectedCell = {column: input.dataset.column, row: input.dataset.row};

                input.value = GridModel.getGridState()[selectedCell.column][selectedCell.row];
                formula.value = GridModel.getGridState()[selectedCell.column][selectedCell.row];

                removeSelectedClassFromAllCells();
                input.parentElement.classList.add("cell--selected");
            })
            
            // "change" is when we commit the change
            input.addEventListener("change", ()=>{

                let newGridState = GridModel.getGridState();
                newGridState[input.dataset.column][input.dataset.row] = input.value;
                GridModel.setGridState(newGridState);

                input.value = valueShownToUser(input.value);
            
                console.log(GridModel.getGridState());
            });

            input.addEventListener("focusout", ()=>{
                input.value = valueShownToUser(input.value);
            });

            cell.append(input);
            grid.append(cell);
        }
    }

}


function updateGrid(){
    let gridChildNodes = Array.from(grid.childNodes);

    gridChildNodes.forEach(node=>{
        node.remove()
    })

    generateCells(GridModel.getGridState())
}

function removeSelectedClassFromAllCells(){
    let gridChildNodes = Array.from(grid.childNodes);

    gridChildNodes.forEach(node=>{
        node.classList.remove("cell--selected");
    })
}

function valueShownToUser(formula){

    if(formula[0] == '='){
        let gridState = GridModel.getGridState();
    
        let column1 = formula[1].charCodeAt(0) - 97;
        let row1 = parseInt(formula[2]);
        let cell1 = parseInt(gridState[column1][row1]);

        let operator = formula[3];

        let column2 = formula[4].charCodeAt(0) - 97;
        let row2 = parseInt(formula[5]);
        let cell2 = parseInt(gridState[column2][row2]);

        return eval(cell1+operator+cell2);
    }
    else{
        return formula;
    }
    
    
}
