import React, { useState} from "react";

import './style.css';

import imgObj1 from '../src/img1/*.png';

import imgObj2 from '../src/img2/*.png';

import imgObj3 from '../src/img3/*.png';

const createImageArray = obj => {   

  let imgArray = Object.keys(obj).map(function(key) {
    return [obj[key]];
  });
  
  imgArray.sort((a,b) => {    
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  });  

  return imgArray; 
};


export const SlidingPuzzle = props => {

  const level = 3;

  const nought = 'naught';     

  const styleSpan = {
    width: '17vw',
    height: '11vw',
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
    position: 'relative',
    width: '100%',
    height: '100%',
    left: '0'
  }; 
  
  const naughtStyle = {
    width: '17vw',
    height: '11vw',
    border: 'none',
    display: 'table-cell',
    fontSize: '0',
  };

  const messageFieldStyle = {
    position: 'absolute',
    top: '50%',    
    transform: 'translateY(-50%)',
    height: '30%',
    width: '51vw',
    backgroundImage: 'radial-gradient(ellipse at center,  rgba(255,116,0,1) 0%,rgba(255,116,0,1) 35%,rgba(255,116,0,0.2) 100%)',
    opacity: '0.85',
    color: 'white',
    zIndex: '1',
    fontFamily: 'Comic Sans MS, cursive, sans-serif',
    fontSize: '2.25vw',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadow: '3px 3px #ff0000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'       
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

  const [gameHasBeenStartedBefore, setGameHasBeenStartedBefore] = useState(false);

  const [gameWon, setGameWon] = useState(false);  

  const [image, setImage] = useState(false);

  const [whichImage, setWhichImage] = useState(createImageArray(imgObj1));
    
  
  const updateUseStates = arr => {
    setPuzzleElements([...arr]);
    if (checkIfGameWon(arr) == true) {        
        setGameState(false);
        setGameWon(true);
        displayWinMessage();
    };
  };

  const startGame = () => {
    setGameHasBeenStartedBefore(true);
    setGameState(true);
    setGameWon(false);
    shuffleArray();  
    startGameAnimation();
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

  const startGameAnimation = () => {
    document.querySelector('.button').classList.add('button-blur');
    setTimeout( () => document.querySelector('.button').classList.remove('button-blur'), 600);
    
    document.querySelector('.puzzleBody').classList.add('rotate-scale-up');       
    setTimeout( () => document.querySelector('.puzzleBody').classList.remove('rotate-scale-up'), 2000);  
    
    document.querySelector('.puzzleBody').classList.add('blur');
    setTimeout( () => document.querySelector('.puzzleBody').classList.remove('blur'), 600);
  };

  const toggleImageNumber = () => {
    image == true ? setTimeout( () => setImage(false), 500) : setTimeout( () => setImage(true), 500);   
    fadeImage();
    if (gameHasBeenStartedBefore) removeMessageField();
  };

  const displayImage = (el) => {
    if (image) return <img src = {whichImage[el-1]} style = {el != "naught" ? {height: '100%', width: '100%', zIndex: '-1', position: 'relative'} : {display: 'none'}}/>;
  };

  const toggleImage = () => {
    if (JSON.stringify(whichImage).includes('superhero')) setTimeout( () => setWhichImage(createImageArray(imgObj2)), 500);   
    if (JSON.stringify(whichImage).includes('react')) setTimeout( () => setWhichImage(createImageArray(imgObj3)), 500);  
    if (JSON.stringify(whichImage).includes('stone-face')) setTimeout( () => setWhichImage(createImageArray(imgObj1)), 500);   
    fadeImage(); 
  };

  const fadeImage = () => {
    document.querySelector('.puzzleBody').classList.add('fadeOut');
    setTimeout( () => document.querySelector('.puzzleBody').classList.remove('fadeOut'), 500);
    setTimeout( () => document.querySelector('.puzzleBody').classList.add('fadeIn'), 500);
    setTimeout( () => document.querySelector('.puzzleBody').classList.remove('fadeIn'), 1000);
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
    removeMessageField();
    if (gameState == true) {
      setTimeout( () => setPuzzleElements(createStartArray()),500);
      setGameState(false);
      stopGameAnimation();
    };
    
    if (gameState == false) {
      startGame();       
    };
  };

  const removeMessageField = () => {
    document.querySelector('.messageField').classList.add('fadeOut');
    setTimeout( () => document.querySelector('.messageField').classList.add('message-field-display-none'), 500);
  };

  const stopGameAnimation = () => {
    document.querySelector('.puzzleBody').classList.add('slit-out-vertical');
    setTimeout( () => document.querySelector('.puzzleBody').classList.remove('slit-out-vertical'), 500);
    setTimeout( () => document.querySelector('.puzzleBody').classList.add('slit-in-vertical'), 500);
    setTimeout( () => document.querySelector('.puzzleBody').classList.remove('slit-in-vertical'), 1000);
  };

  const fadeMessageField = () => {
    if (gameHasBeenStartedBefore == false) {
      document.querySelector('.messageField').classList.add('fadeOut');
      setTimeout( () => document.querySelector('.messageField').classList.remove('fadeOut'), 500);
      setTimeout( () => document.querySelector('.messageField').classList.add('fadeIn'), 500);
      setTimeout( () => document.querySelector('.messageField').classList.remove('fadeIn'), 1000); 
    };   
  };

  const displayWinMessage = () => {
    document.querySelector('.messageField').classList.remove('message-field-display-none');
    document.querySelector('.messageField').classList.remove('fadeOut');
  }

  let tileID = 1;
  
    return (    

      <div
      className = {'puzzle'}
      style = {stylePuzzle}
      >        
          

          <div 
          className = {'row'}>

            <div
            className = {'wrapper'}>

              <div
              className = {'puzzleBody'}> 

                <div
                  className = {'messageField'}
                  style = {messageFieldStyle}>        
                  {gameWon == false && gameHasBeenStartedBefore == false && <div className = {'message-text'}><p>Hit the -start game- button</p> <p>and put those tiles back in the correct order</p></div>}
                  {gameWon == true && <p>Incredible! You did it!</p>}
                </div>     
              
                { puzzleElements.map((el,indexRow) => 

                  <div 
                  className = {'puzzleRows'}
                  key={indexRow}>
                  { el.map((el,index) => 

                    <div 
                    id = {tileID++}
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
                className = {'button btn-lg btn-primary'}
                key = 'button'
                onClick = {startOrEnd}
                >
                  {gameState == true ? "stop game" : "start game"}
                </button>  

                { gameState == false ? <button
                className = {'button button-img btn btn-default'}
                key = 'button-img'
                onClick = {() => {toggleImageNumber(); setPuzzleElements(createStartArray()); fadeMessageField()}}
                >
                  {image ? 'numbers' : 'image'} 
                </button> : undefined }

                { image && gameState == false ? <button
                className = {'button button-another-img btn btn-default'}
                key = 'button-another-img'
                onClick = {() => {toggleImage(); setPuzzleElements(createStartArray()); fadeMessageField()}}
                >
                  another image 
                </button> : undefined }

              </div>

            </div>

        </div>
      
      </div>     
    )  
};