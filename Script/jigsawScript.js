﻿/*
 Pig Image
 Cow image
 Barn image
 Duck image (air)
 Android resolution
 Start place for pieces
*** Velge vanskligheltsgrad
*** Parent button (4sec)
 Create sounds for all animals
*** Play sound when finnished
*** Show image when finnisher
 Make icons
 Make Splash and logo
 Make Appstore images
 Make Appstore text
 Get Apple license
 About button
 BUG: Hard mode: Zoom images wrong on edge
 Set animgif on ChangeMode
 
 Tott farm games
 ---------------
 Tott jigsaw - Puzzle
 Wack the rat game
 Where am I (se siluetter)
 What animale is this (se snute osv)
 Memory
 Paint the animales
 
 
*/


function jigsaw(canvasID, image1, rows, columns, modeDifficulty) {
    var MODE = modeDifficulty;  //HARD // EASY

    // Org size of image
    var ORG_PUZZLE_WIDTH = image1.naturalWidth -1;
    var ORG_PUZZLE_HEIGHT = image1.naturalHeight -1;


    // Zoom image to
    var SHOW_PUZZLE_WIDTH = 600;
    var SHOW_PUZZLE_HEIGHT = 450;
    
    // Grid to
    var TOTAL_ROWS = rows;
    var TOTAL_COLUMNS = columns; 
    var TOTAL_PIECES = TOTAL_ROWS * TOTAL_COLUMNS;

    // Size of the pieces
    var PIECES_WIDTH = Math.round(ORG_PUZZLE_WIDTH / TOTAL_COLUMNS);
    var PIECES_HEIGHT = Math.round(ORG_PUZZLE_HEIGHT / TOTAL_ROWS);

    var BLOCK_WIDTH = 0; // Math.round(SHOW_PUZZLE_WIDTH / TOTAL_COLUMNS);
    var BLOCK_HEIGHT = 0; // Math.round(SHOW_PUZZLE_HEIGHT / TOTAL_ROWS);
    
    // Selected piece offset from mouse point
    var offsetX = 0;
    var offsetY = 0;

    // Set jugsaw to middle
    var PUZZLE_PADDING_TOP = 150;
    var PUZZLE_PADDING_LEFT = 200;

  //  var image1;
    var canvas;
    var ctx;

    this.canvasID = canvasID;
   // this.imageID = imageID;

    this.top = PUZZLE_PADDING_TOP;
    this.left = PUZZLE_PADDING_LEFT;

    this.imageBlockList = new Array();
    this.blockList = new Array();

    this.selectedBlock = null;

    this.mySelf = this;

    this.initDrawing = function () {
        mySelf = this;
        selectedBlock = null;
        canvas = document.getElementById(canvasID);

        ctx = canvas.getContext('2d');

        // register events
        canvas.onmousedown = handleOnMouseDown;
        canvas.onmouseup = handleOnMouseUp;
        canvas.onmousemove = handleOnMouseMove;
        
        canvas.addEventListener("touchstart", handleOnMouseDown, false);
        canvas.addEventListener("touchend", handleOnMouseUp, false);
        canvas.addEventListener("touchmove", handleOnMouseMove, false);

        initializeNewGame();
    };
    
    function initializeNewGame() {
        // Set block 
        BLOCK_WIDTH = Math.round(SHOW_PUZZLE_WIDTH / TOTAL_COLUMNS);
        BLOCK_HEIGHT = Math.round(SHOW_PUZZLE_HEIGHT / TOTAL_ROWS);

        // Draw image
        SetImageBlock();
        DrawGame();
    }

    // Lage brikker og brettslots
    function SetImageBlock() {
        var total = TOTAL_PIECES;
        imageBlockList = new Array();
        blockList = new Array();

        for (var i = 0; i < total; i++) {       
            var imgBlock = eee(i);
            imageBlockList.push(imgBlock);

            // Define the grid slots (blocks)
            var x = PUZZLE_PADDING_LEFT + (i % TOTAL_COLUMNS) * BLOCK_WIDTH;
            var y = PUZZLE_PADDING_TOP + Math.floor(i / TOTAL_COLUMNS) * BLOCK_HEIGHT;
            var block = new puzzleBlock(i, x, y);
            blockList.push(block);

        }

    }
    // Redraw game
    function DrawGame() {
        clear(ctx);
        drawLines();
        drawAllImages();

        if (selectedBlock) {
            drawImageBlock(selectedBlock);
        }
    }

    function drawLines() {
        drawBackground();

        drawShadow();
       
       ctx.strokeStyle = "#000000"; 
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // draw verticle lines
        for (var i = 0; i <= TOTAL_COLUMNS; i++) {
            var x = PUZZLE_PADDING_LEFT + (BLOCK_WIDTH * i);
            ctx.moveTo(x, PUZZLE_PADDING_TOP);
            ctx.lineTo(x, 450+PUZZLE_PADDING_TOP);
        }

        // draw horizontal lines
        for (var i = 0; i <= TOTAL_ROWS; i++) {
            var y = PUZZLE_PADDING_TOP + (BLOCK_HEIGHT * i);
            ctx.moveTo(PUZZLE_PADDING_LEFT, y);
            ctx.lineTo(600+PUZZLE_PADDING_LEFT, y);
        }

        ctx.closePath();
        ctx.stroke();
    }

    function drawBackground() {   
           // Draw background image (landscape)
        var background_image = document.getElementById("img3");
        ctx.drawImage(background_image, 0, 0);
    }

    function drawShadow(){
       // Draw preview image (shadow)
        var shadow_image = document.getElementById("img2");
        // context.drawImage(img,sx,sy,swidth,sheight,dx,dy,dwidth,dheight);
        ctx.drawImage(shadow_image, 0, 0, ORG_PUZZLE_WIDTH, ORG_PUZZLE_HEIGHT, PUZZLE_PADDING_LEFT, PUZZLE_PADDING_TOP, SHOW_PUZZLE_WIDTH, SHOW_PUZZLE_HEIGHT); 
    }

    // Draw all pieces not selected
    function drawAllImages() {
        for (var i = 0; i < imageBlockList.length; i++) {
            var imgBlock = imageBlockList[i];
            if (imgBlock.isSelected == false) {
                var hoverBlock = GetPuzzlePiece(blockList, imgBlock.x, imgBlock.y);
                if (hoverBlock) {
                    // Image is inside
                    drawImageBlock(imgBlock);    
                }else{
                    // Image is outside
                    drawImageBlockSmal(imgBlock);
                }
            }
        }
    }

    function drawImageBlockSmal(imgBlock) {
        drawFinalImage(imgBlock.no, imgBlock.x, imgBlock.y, BLOCK_WIDTH/2, BLOCK_HEIGHT/2);
    }

    function drawImageBlock(imgBlock) {
        drawFinalImage(imgBlock.no, imgBlock.x, imgBlock.y, BLOCK_WIDTH, BLOCK_HEIGHT);
    }

    function drawFinalImage(index, destX, destY, destWidth, destHeight) {
        ctx.save();
        var srcX = (index % TOTAL_COLUMNS) * PIECES_WIDTH;
        var srcY = Math.floor(index / TOTAL_COLUMNS) * PIECES_HEIGHT;
        ctx.drawImage(image1, srcX, srcY, PIECES_WIDTH, PIECES_HEIGHT, destX, destY, destWidth, destHeight);
        ctx.restore();
    }

    function drawImage(image) {
        ctx.save();
        ctx.drawImage(image, 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, 10, 10, BLOCK_WIDTH, BLOCK_WIDTH);
        ctx.restore();
    }

    var interval = null;
    var remove_width;
    var remove_height;
    var delta_remove = -20;
    function OnFinished() {

        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'Audio/finish.mp3');
        audioElement.play();

        remove_width = BLOCK_WIDTH;
        remove_height = BLOCK_HEIGHT;
        // Clear Board
        interval = setInterval(function () { mySelf.ClearGame(); }, 100);
    }

    this.ClearGame = function () {
        
        if(remove_width<=10) {
            delta_remove = 20;
        }
        
        remove_width += delta_remove;
        remove_height += delta_remove;

        if (remove_width < BLOCK_WIDTH+delta_remove) {
            clear(ctx);
            drawBackground();

            for (var i = 0; i < imageBlockList.length; i++) {
                var imgBlock = imageBlockList[i];

                imgBlock.x -= (delta_remove/2);
                imgBlock.y -= (delta_remove/2);
                drawFinalImage(imgBlock.no, imgBlock.x, imgBlock.y, remove_width, remove_height);
            }

        } else {
            if(delta_remove == 20){
                // Animation is finnished and you have made it
                clearInterval(interval);
               
                // Restart game
                initializeNewGame(); 
              //  alert("Congrats....");
            }
        }
    };


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////// EVENTS
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

var orgX;
var orgY;

    function handleOnMouseDown(e) {
        e.preventDefault();//Stops the default behavior
        // remove old selected
        if (selectedBlock != null) {
            imageBlockList[selectedBlock.no].isSelected = false;
        }
        selectedBlock = GetPuzzlePiece(imageBlockList, e.pageX, e.pageY);
        if (selectedBlock) {
            imageBlockList[selectedBlock.no].isSelected = true;
            orgX = selectedBlock.x;
            orgY = selectedBlock.y;
            
            
                  offsetX = e.pageX - selectedBlock.x;
                  offsetY = e.pageY - selectedBlock.y;
        }
    }


    function handleOnMouseUp(e) {
        //In hard mode blocks will snapp to any slot, in easy they will not
        if (selectedBlock) {
            var index = selectedBlock.no;
      
            if(MODE=="HARD"){
                //Trenger jeg dette i HARD MODE?
                var hoverBlock = GetPuzzlePiece(blockList, selectedBlock.x, selectedBlock.y);
                if (hoverBlock) {
                    // We are hovering a slot
                    var blockOldImage = GetImageBlockOnEqual(imageBlockList, hoverBlock.x, hoverBlock.y);
                    if (blockOldImage == null) {
                        // Snap to any block (the one we currently is hovering)
                        imageBlockList[index].x = hoverBlock.x;
                        imageBlockList[index].y = hoverBlock.y;
                    }
                }
                else {
                    // Stay at droped position
                    imageBlockList[index].x = selectedBlock.x;
                    imageBlockList[index].y = selectedBlock.y;
                }
            }else{
                
                 var hoverBlock = GetPuzzlePiece(blockList, selectedBlock.x, selectedBlock.y);
                if (hoverBlock) {
                    // We are hovering a slot
                       // Return piece to origin when inside (if it was correct, it has been droped in Easy mode)
                    imageBlockList[index].x = orgX;
                    imageBlockList[index].y = orgY; 
                }else{
                    
                      // Leave piece where user left it (when outside puzzle)
                    imageBlockList[index].x = selectedBlock.x;
                    imageBlockList[index].y = selectedBlock.y;
                }

            }
           
            imageBlockList[index].isSelected = false;
            selectedBlock = null;
            DrawGame();
            
            if (isFinished()) {
                OnFinished();
            }
        }
    }

    function handleOnMouseMove(e) {
        e.preventDefault();//Stops the default behavior
        if (selectedBlock) {
           var index = selectedBlock.no;
            var block = GetPuzzlePiece(blockList, e.pageX, e.pageY);
            if(block){
                if(index==block.no && MODE!="HARD"){
                    imageBlockList[index].x = block.x;
                    imageBlockList[index].y = block.y;

                      imageBlockList[index].isSelected = false;
                        selectedBlock = null;
                        DrawGame();
                         if (isFinished()) {
                             OnFinished();
                       }
                }else{
                    //Move
                    selectedBlock.x = e.pageX  - offsetX;
                    selectedBlock.y = e.pageY  - offsetY;
                    DrawGame();         
                }
            }else{
                //Move
                selectedBlock.x = e.pageX  - offsetX;
                selectedBlock.y = e.pageY  - offsetY;

                DrawGame();                
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////// HELPER METHODS
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function clear(c) {
        c.clearRect(0, 0, canvas.width, canvas.height);
    }


// 2(a+2) + 2b = 2a + 2b +4 = c

/*       axb=c
        rad x col ramme ytterramme brikker
         2x2 4  12 4
         2x3 6  14 6
         2x4 8  16 8
         3x2 6  14 6
         3x3 8  16 9
         3x4 10 18 12
         3x5 12 20 15
         4x2 8  16 8
         4x3 10 18 12
         4x4 12 20 16
         4x5 14 22 20
         5x3 12 20 15
         5x4 14 22 20
         5x5 16 24 25
        
*/
    
    function eee(index) {
            var randValX = (Math.random() * 1024);
            randValX = Math.round(randValX);
    
            var randValY = (Math.random() * PUZZLE_PADDING_TOP);
            randValY = Math.round(randValY);

             if (yesNo()){
               //  randValY += SHOW_PUZZLE_HEIGHT + (PUZZLE_PADDING_TOP/2);
                randValY=10;
            }else{
                randValY=610;
            }
        var imgBlock = new puzzleBlock(index, randValX, randValY);
        return imgBlock;
    }





    function GetPuzzlePiece(list, x, y) {        
        for (var i = list.length - 1; i >= 0; i--) {
            var imgBlock = list[i];

            var x1 = imgBlock.x;
            var x2 = x1 + BLOCK_WIDTH;

            var y1 = imgBlock.y;
            var y2 = y1 + BLOCK_HEIGHT;

            if ((x >= x1 && x <= x2) && (y >= y1 && y <= y2)) {
                var img = new puzzleBlock(imgBlock.no, imgBlock.x, imgBlock.y);
                return img;
            }
        }
        return null;
    }

    function GetImageBlockOnEqual(list, x, y) {
        for (var i = 0; i < list.length; i++) {
            var imgBlock = list[i];

            var x1 = imgBlock.x;
            var y1 = imgBlock.y;
            if ((x == x1) && (y == y1)) {
                var img = new puzzleBlock(imgBlock.no, imgBlock.x, imgBlock.y);
                return img;
            }
        }
        return null;
    }

    function isFinished() {
        var total = TOTAL_PIECES;
        for (var i = 0; i < total; i++) {
            var img = imageBlockList[i];
            var block = blockList[i];

            if ((img.x != block.x) || (img.y != block.y)) {
                // If one img is not equal to its block you are not finished
                return false;
            }
        }
        return true;
    }

}