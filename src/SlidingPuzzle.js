import React, { useState} from "react";

export const SlidingPuzzle = props => {

  const level = 4;

  const nought = "*";

  const styleSpan = {
    width: '50px',
    height: '50px',
    border: 'solid',
    display: 'inline-block'
  };      

  const createStartArray = () => {
    const puzzleArray = new Array(level);  
      let counter = 0;      
      for (let i = 0; i < level; i++) {
        puzzleArray[i] = new Array(level);
        for (let j = 0; j < level; j++) {
          counter +=1;
          i == level - 1 && j == level - 1 ? puzzleArray[i][j] = nought : puzzleArray[i][j] = counter; 
        };            
      };
      return puzzleArray;
  };  
  
  const [puzzleElements, setPuzzleElements] = useState(createStartArray());  
  
  const [gameState, setGameState] = useState(false); 

  const [gameWon, setGameWon] = useState(false); 

  const updateUseStates = arr => {
    setPuzzleElements([...arr]);
    if (checkIfGameWon(arr) == true) {
        setGameState(false);
        setGameWon(true);
    };
  };

  const startGame = () => {
    setGameState(true);
    setGameWon(false);
    shuffleArray();
  };

  const checkIfGameWon = array => {
    const endArray = array.flat([level - 1]);
    const startArray = createStartArray().flat([level - 1]);    

    const winCondition = [];

    for (let i = 0; i <= level*level; i++) {
      startArray[i] === endArray[i] ? winCondition.push(true) : winCondition.push(false);
    }; 

    if (!winCondition.includes(false)) return true;    
  };

  const shuffleArray = () => {
    for (let i = 0; i < puzzleElements.length; i++) {
      for (let j = 0; j < puzzleElements[i].length; j++) {
          let i1 = Math.floor(Math.random() * (puzzleElements.length));
          let j1 = Math.floor(Math.random() * (puzzleElements.length));

          let temp = puzzleElements[i][j];
          puzzleElements[i][j] = puzzleElements[i1][j1];
          puzzleElements[i1][j1] = temp;   
        };
    };     
    isSolveAble(puzzleElements) === true ? updateUseStates(puzzleElements) : shuffleArray();
  };  

  const findPositionTile = (arr,tile) => {
    let y,x;
    for (let i = 0; i < arr.length; i++) {
      y = i;
      for (let j = 0; j < arr.length; j++) {
        if (arr[i][j] == tile) {
          x = j;
          i = arr.length;
          return[y,x];          
        };
      };      
    };    
  };   

  const isSolveAble = array => {
    const arrayFlat = array.flat([level - 1]).filter(x => x != nought);    
    let inv_count = 0;     
    for (let i = 0; i < level * level; i++) {
      for (let j = i + 1; j < level * level; j++) {
          if (arrayFlat[i] > arrayFlat[j]) inv_count++; 
      };
    };      

    const [noughtTileY,noughtTileX] = findPositionTile(array,nought); 
    
    if (level == 2) {      
      if (noughtTileY % 2 != 0 && inv_count % 2 == 0 && checkIfGameWon(puzzleElements) != true) return true;    
      else return false;
    };

    if (level % 2 != 0) {
      if (inv_count % 2 == 0 && checkIfGameWon(puzzleElements) != true) return true;
      else return false;
    };

    if (level % 2 == 0 && level != 2) {
      if (noughtTileY == 0 || noughtTileY % 2 == 0 && inv_count % 2 != 0) {
      return true;      
      }
      else {
        if (noughtTileY % 2 != 0 && inv_count % 2 == 0) {
        return true; 
        }
      }
    }
      else return false;            
  };
    
  const swapPositionTiles = event => {    
    const [noughtTileY,noughtTileX] = findPositionTile(puzzleElements,nought);  
    const [numberTileY,numberTileX] = findPositionTile(puzzleElements,event.target.innerHTML); 
        
    if (puzzleElements[noughtTileY][noughtTileX] == puzzleElements[numberTileY][numberTileX]) return;

    if (noughtTileY == 0) {      
      if (puzzleElements[noughtTileY][noughtTileX + 1] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY][noughtTileX - 1] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY + 1][noughtTileX] == puzzleElements[numberTileY][numberTileX]){

          puzzleElements[noughtTileY][noughtTileX] = puzzleElements[numberTileY][numberTileX];
          puzzleElements[numberTileY][numberTileX] = nought; 
          updateUseStates(puzzleElements);       
      };
    };

    if (noughtTileY == level - 1) {
      if (puzzleElements[noughtTileY][noughtTileX + 1] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY][noughtTileX - 1] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY - 1][noughtTileX] == puzzleElements[numberTileY][numberTileX]){

          puzzleElements[noughtTileY][noughtTileX] = puzzleElements[numberTileY][numberTileX];
          puzzleElements[numberTileY][numberTileX] = nought; 
          updateUseStates(puzzleElements); 
      };
    };

    if (noughtTileY != level - 1 && noughtTileY != 0) {
      if (puzzleElements[noughtTileY][noughtTileX + 1] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY][noughtTileX - 1] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY + 1][noughtTileX] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY - 1][noughtTileX] == puzzleElements[numberTileY][numberTileX]){

          puzzleElements[noughtTileY][noughtTileX] = puzzleElements[numberTileY][numberTileX];
          puzzleElements[numberTileY][numberTileX] = nought; 
          updateUseStates(puzzleElements); 
      };
    };
  };
  
    return (    
    <div>

    <div>{gameWon == true && "Bravo! Es ist geschafft."}</div>

    { puzzleElements.map((el,indexRow) => 
    <div 
    key={indexRow}>
    { el.map((el,index) => 
    <div 
    key = {index} 
    y = {indexRow}   
    x = {index} 
    style = {styleSpan}
    onClick = {gameState == true ? swapPositionTiles : undefined}> 
    {el}</div>) }</div>) }  

    <button
    key = 'button'
    onClick = {startGame}
    >
      {gameState == true ? "shuffle" : "start"}
    </button>  
    
    </div>   
    
    )
};