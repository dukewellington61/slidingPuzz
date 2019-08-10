import React, { useState} from "react";

import './style.css';

import imgObj1 from '../src/img1/*.png';

let imgArray1 = Object.keys(imgObj1).map(function(key) {
  return [imgObj1[key]];
});

let imgArrayFlat1 = imgArray1.flat(1);


import imgObj2 from '../src/img2/*.png';

let imgArray2 = Object.keys(imgObj2).map(function(key) {
  return [imgObj2[key]];
});

let imgArrayFlat2 = imgArray2.flat(1);


import imgObj3 from '../src/img3/*.png';

let imgArray3 = Object.keys(imgObj3).map(function(key) {
  return [imgObj3[key]];
});

let imgArrayFlat3 = imgArray3.flat(1);


export const SlidingPuzzle = props => {

  const level = 3;

  const nought = 'naught';     

  const styleSpan = {
    width: '150px',
    height: '100px',
    border: 'solid',
    borderWidth: '0.2px',
    borderColor: 'grey',
    display: 'table-cell',    
    fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
    textAlign: 'center',
    verticalAlign: 'middle',
    lineHeight: 'normal',    
    color: 'white',
    fontSize: '0',
    zIndex: '1'
  };     

  const stylePuzzle = {
    width: '100%',
    height: '100%'
  }; 
  
  const naughtStyle = {
    width: '150px',
    height: '100px',
    border: 'none',
    display: 'table-cell',
    fontSize: '0',
    backgroundColor: 'white'
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

  const [image, setImage] = useState(false);

  const [whichImage, setWhichImage] = useState(imgArrayFlat1);
  
  const [puzzleElements, setPuzzleElements] = useState(createStartArray());  
  
  const [gameState, setGameState] = useState(false); 

  const [gameWon, setGameWon] = useState(false);   
  

  const imageNumberToggler = () => {
    image == true ? setTimeout( () => setImage(false), 500) : setTimeout( () => setImage(true), 500);
    document.querySelector('.puzzleBody').classList.add('fadeOut');
    setTimeout( () => document.querySelector('.puzzleBody').classList.remove('fadeOut'), 500);
    setTimeout( () => document.querySelector('.puzzleBody').classList.add('fadeIn'), 500);
    setTimeout( () => document.querySelector('.puzzleBody').classList.remove('fadeIn'), 1000);
  };

  const imageToggler = () => {
    if (whichImage == imgArrayFlat1) setTimeout( () => setWhichImage(imgArrayFlat2), 500);   
    if (whichImage == imgArrayFlat2) setTimeout( () => setWhichImage(imgArrayFlat3), 500);  
    if (whichImage == imgArrayFlat3) setTimeout( () => setWhichImage(imgArrayFlat1), 500);   
    document.querySelector('.puzzleBody').classList.add('fadeOut');
    setTimeout( () => document.querySelector('.puzzleBody').classList.remove('fadeOut'), 500);
    setTimeout( () => document.querySelector('.puzzleBody').classList.add('fadeIn'), 500);
    setTimeout( () => document.querySelector('.puzzleBody').classList.remove('fadeIn'), 1000);    
  };

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

    document.querySelector('.button').classList.add('button-blur');
    setTimeout( () => document.querySelector('.button').classList.remove('button-blur'), 600);    
    
    document.querySelector('.puzzleBody').classList.add('rotate-scale-up');       
    setTimeout( () => document.querySelector('.puzzleBody').classList.remove('rotate-scale-up'), 2000);  
    
    document.querySelector('.puzzleBody').classList.add('blur');
    setTimeout( () => document.querySelector('.puzzleBody').classList.remove('blur'), 600);

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
    isSolveAble(puzzleElements) === true ? setTimeout ( () => updateUseStates(puzzleElements), 500) : shuffleArray();    
    
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
    const [numberTileY,numberTileX] = findPositionTile(puzzleElements,event.target.innerText);     
        
    if (puzzleElements[noughtTileY][noughtTileX] == puzzleElements[numberTileY][numberTileX]) return;

    if (noughtTileY == 0) {      
      if (puzzleElements[noughtTileY][noughtTileX + 1] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY][noughtTileX - 1] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY + 1][noughtTileX] == puzzleElements[numberTileY][numberTileX]){
          
          tileSlider(event);   

          puzzleElements[noughtTileY][noughtTileX] = puzzleElements[numberTileY][numberTileX];
          puzzleElements[numberTileY][numberTileX] = nought; 
                    
          setTimeout( () => updateUseStates(puzzleElements), 500);                      
      };
    };

    if (noughtTileY == level - 1) {
      if (puzzleElements[noughtTileY][noughtTileX + 1] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY][noughtTileX - 1] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY - 1][noughtTileX] == puzzleElements[numberTileY][numberTileX]){

          tileSlider(event);

          puzzleElements[noughtTileY][noughtTileX] = puzzleElements[numberTileY][numberTileX];
          puzzleElements[numberTileY][numberTileX] = nought; 
                     
          setTimeout( () => updateUseStates(puzzleElements), 500);                   
      };
    };

    if (noughtTileY != level - 1 && noughtTileY != 0) {
      if (puzzleElements[noughtTileY][noughtTileX + 1] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY][noughtTileX - 1] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY + 1][noughtTileX] == puzzleElements[numberTileY][numberTileX] ||
          puzzleElements[noughtTileY - 1][noughtTileX] == puzzleElements[numberTileY][numberTileX]){

          tileSlider(event);  

          puzzleElements[noughtTileY][noughtTileX] = puzzleElements[numberTileY][numberTileX];
          puzzleElements[numberTileY][numberTileX] = nought; 
                        
          setTimeout( () => updateUseStates(puzzleElements), 500);                                         
      };
    };   
  };  

  const tileSlider = (event) => {

    const [noughtTileY,noughtTileX] = findPositionTile(puzzleElements,nought);  
    const [numberTileY,numberTileX] = findPositionTile(puzzleElements,event.target.innerText); 
    
    if (numberTileY == noughtTileY - 1) {
      event.target.classList.add('down');        
    };

    if (numberTileY == noughtTileY + 1) {
      event.target.classList.add('up');      
    }; 
    
    if (numberTileX == noughtTileX - 1) {
      event.target.classList.add('right');        
    };

    if (numberTileX == noughtTileX + 1) {
      event.target.classList.add('left');        
    };
  };

  const displayImage = (el) => {
    if (image) return <img src = {whichImage[el]} style = {el != "naught" ? {height: '100%', width: '100%', zIndex: '-1', position: 'relative'} : {display: 'none'}}/>;
  };

  const numberOrTileStyle = () => {
    if (image) return styleSpan;
    if (image == false) {
      styleSpan.fontSize = '3em';
      styleSpan.backgroundColor = 'black';
      return styleSpan;
    };
  };

  const startOrEnd = () => {
    if (gameState == true) {
      setTimeout( () => setPuzzleElements(createStartArray()),500);
      setGameState(false);
      document.querySelector('.puzzleBody').classList.add('slit-out-vertical');
      setTimeout( () => document.querySelector('.puzzleBody').classList.remove('slit-out-vertical'), 500);
      setTimeout( () => document.querySelector('.puzzleBody').classList.add('slit-in-vertical'), 500);
      setTimeout( () => document.querySelector('.puzzleBody').classList.remove('slit-in-vertical'), 1000);
    };
    
    if (gameState == false) {
      startGame();
    };
  };

  let i = 1;
  
    return (    

    <div
    className = {'puzzle'}
    style = {stylePuzzle}
    >

      <div>{gameWon == true && "Bravo! Es ist geschafft."}</div>

      <div 
      className = {'row'}>

        <div
        className = {'puzzleBody'}
        style = {{height: '300px'}}> 
        
          { puzzleElements.map((el,indexRow) => 

            <div 
            className = {'puzzleRows'}
            key={indexRow}>
            { el.map((el,index) => 

              <div 
              id = {i++}
              key = {index} 
              y = {indexRow}   
              x = {index}         
              onClick = {gameState == true ? swapPositionTiles : undefined}
              className = {el}
              style = {el == "naught" ? naughtStyle : numberOrTileStyle()}>{el}
              {displayImage(el)}
              </div>) }
              
            </div>) }  

        </div>

        <div
        className = {'control-panel'}>

          <button
          className = {'button btn btn-primary'}
          key = 'button'
          onClick = {startOrEnd}
          >
            {gameState == true ? "stop game" : "start game"}
          </button>  

          { gameState == false ? <button
          className = {'button button-img btn btn-default'}
          key = 'button-img'
          onClick = {() => {imageNumberToggler(); setPuzzleElements(createStartArray())}}
          >
            {image ? 'numbers' : 'image'} 
          </button> : undefined }

          { image && gameState == false ? <button
          className = {'button button-another-img btn btn-default'}
          key = 'button-another-img'
          onClick = {() => {imageToggler(); setPuzzleElements(createStartArray())}}
          >
            another image 
          </button> : undefined }

        </div>
      </div>
    
    </div>   
    
    )
  

  

  
  
};