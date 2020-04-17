        const TAM_DIV = 20; //tamanho do bloco das divs 
       
        var offsetW , offsetH ; //tamanho das bordas x e y respectivamente 

        var divs = []; //declara o array que vai conter as divs 

        var divsComida = [];

        var cores =["#ef2da8", "#2dcbef", "#ea1409", "#000000", "#8c273b", "#f4df42", "#f26800", "#001dff", "#00ff19", "#873471"]; //define cores 
        
        var qtCores = cores.length; // recebe tamanho do vetor cores
    
        var posicoesX = [], posicoesY = []; //array das posiçoes dos blocos que constituem a cobra

        var sentidoX = 1, sentidoY = 0;  // controlam os sentidos => -1 para esquerda e cima; 1 para direita e baixo; 0 nao altera

        var converteX, converteY; //usados para converter valores de pixel para inteiro

        var cor;

        var gambiarra = true; //flag

        function defineOffsets(){

            offsetH = document.getElementById('borda').offsetHeight;
            offsetW = document.getElementById('borda').offsetWidth;

        }
        
        function convertePos(){
                
               converteX= parseInt(divs[0].style.left);
               converteY= parseInt(divs[0].style.top);
        }
       
        function randCor(){

            cor =  cores[(Math.floor(Math.random()*qtCores))];
        }

        function numComida(){
            defineOffsets();

           return parseInt(((offsetW/TAM_DIV)*(offsetH/TAM_DIV))/100);
        }
        
        function aumentaCobrinha(corAnt){
            // cria uma nova div
            var novaDiv = document.createElement("div"); 
            
            novaDiv.className = "cobrinha"; // o css, recebe classe cobrinha d
            novaDiv.style.left = divs[0].style.left; // recebe posicao X
            novaDiv.style.top = divs[0].style.top; // recebe posicao y 
            novaDiv.style.backgroundColor = corAnt; //recebe a mesma cor da comida
            
            document.body.appendChild(novaDiv);
            divs.push(novaDiv); //adiciona novo elemento no final do array
        }
        
        function diminuiCobrinha(){

            var aux = divs[0]; //auxiliar para guardar a div 
            divs.shift(); //remove a div no inicio do vetor da cobrinha 
            aux.parentNode.removeChild(aux); //remove div no html
        }
        

        class comida{
            constructor(div){
                
                this.div = div; //recebe nova div 
                this.div.className = ('cobrinha');
                document.body.appendChild(this.div);

                this.pX = 0;
                this.py = 0;
            
            }
            atualizaCor(){

                this.div.style.backgroundColor =  cores[(Math.floor(Math.random()*qtCores))];
            }

            atualizaPos(){
            
                defineOffsets();

                this.pX = Math.floor(Math.random()*parseInt(offsetW/TAM_DIV))*TAM_DIV ;
                this.py = Math.floor(Math.random()*parseInt(offsetH/TAM_DIV))*TAM_DIV ;

                this.div.style.left = this.pX + 'px';
                this.div.style.top = this.py +  'px';
            }

        }

        function achouComida(com){//coloca a comida em outro lugar e atribui uma nova cor (diferente ou nao)


            var corAnt = com.div.style.backgroundColor; //guarda a cor da comida 

            //
            if ((divs[0].style.backgroundColor == com.div.style.backgroundColor) && (divs.length > 2)){
                     
                     diminuiCobrinha();
                     com.atualizaCor(); //comida recebe a nova cor randomizada    
                     com.atualizaPos();         
            }
            // se não, diminua a cobrinha 
            else{ 
                
                aumentaCobrinha(corAnt); 
                com.atualizaCor();//comida recebe a nova cor randomizada 
                com.atualizaPos();

            }     

             if ( fps <= 30){  
                fps +=2;
             }  
        } // fim da função achou comida 

        function iniciar(){
  
            divs[0] = document.getElementById("cabeca");
            posicoesX[0] = 0; posicoesY[0] = 0;


            randCor(); //randomiza a cor
            aumentaCobrinha(cor); //adiciona nova parte na cobrinha com com aleatoria 

            randCor();
            divs[0].style.backgroundColor = cor; //define cor para a cabeça

            for (var i =0; i<numComida(); i++){
                divsComida[i] = new comida(document.createElement("div"));
                divsComida[i].atualizaPos();
                divsComida[i].atualizaCor();
            }
            
        }

        function mover(){
            
            if (divs.length == 0){
                iniciar(); //inicia o jogo
            }
            
            for (var i=divs.length-1; i>=0; i--){ //começa no final do vetor 

                if (i!=0){//se nao é a cabeça recebe a posição da div à frente
                    
                    posicoesX[i] = posicoesX[i-1];
                    posicoesY[i] = posicoesY[i-1];
                }
                else { // ao final da contagem a cabeça movimenta um bloco para a frente
                    posicoesX[i] += TAM_DIV * sentidoX;
                    posicoesY[i] += TAM_DIV * sentidoY;
           
                }


                if ( posicoesX[0] == posicoesX[i+1] &&
                     posicoesY[0] == posicoesY[i+1]){ //define como game over a colisao entre as partes da cobra 
                    
                        // alert("game over");
                        window.location.reload(); 
                }
                
                
                convertePos(); //converte posições em pixel para inteiro
                defineOffsets(); // pega os tamanhos em  X e Y da janela do navegador

                // Trata o caso das bordas, fazendo a cobrinha teleportar  para o lado inverso as mesmas
                //se a posição é maior que a borda em X, na direita vá para a a borda esquerda
                if (converteX > offsetW)
                        posicoesX[i-1]= -(TAM_DIV);             
                //se posição menor que a borda esquerda, recebe a direita 
                else if (converteX < 0)  
                            posicoesX[i-1] = offsetW - (offsetW%TAM_DIV); 
                            //converte para uma posição da tabela 
                //se posição menor que a borda de baixo, recebe a de cima 
                if (converteY > offsetH)
                        posicoesY[i-1]= -(TAM_DIV);
                //se a posição é maior que a borda em Y, em cima vá para baixo    
                else if (converteY<0) 
                        posicoesY[i-1] = offsetH - (offsetH%TAM_DIV);
                        //converte para uma posição da tabela 
                  
                //atualizar as posicoes dos elementos no html
                divs[i].style.left = posicoesX[i] + 'px';
                divs[i].style.top = posicoesY[i] + 'px';

                gambiarra = true;

            }// fim do laço for 

            //checar se encontrou a comida
            
            for(var j = 0; j < divsComida.length; j++){
                
                if (posicoesX[0] == divsComida[j].pX &&
                    posicoesY[0] == divsComida[j].py){//achou comida
        
                    achouComida(divsComida[j]);
                }

                // reposiciona comida se a janela mudou de tamanhp 
                if (divsComida[j].pX > offsetW || 
                    divsComida[j].py > offsetH)
                    
                    divsComida[j].atualizaPos();
            }
            
        }
            // window.requestAnimationFrame(mover);
        
         //fim da funcao mover 
        
        //altera o sentido 
        function comandos(event){
            switch (event.keyCode) {
                
                case 37: //esquerda
                    
                    if ( sentidoX != 1 && gambiarra) {  //muda de direcao, se o sentido atual não 
                        sentidoX = -1;                  //for o oposto ao da mudança e a flag for true 
                        sentidoY = 0;
                        gambiarra = false;                       
                    }
                    break;
                case 38://cima
                    
                    if(sentidoY != 1 && gambiarra){
                        sentidoX = 0;
                        sentidoY = -1;
                        gambiarra = false; 
                    }
                    break;
                case 39://direita
                    if (sentidoX != -1 && gambiarra){
                        sentidoX = 1;
                        sentidoY = 0;
                        gambiarra = false; 
                    }
                    break;
                
                case 40://baixo
                    if (sentidoY != -1 && gambiarra){
                        sentidoX = 0;   
                        sentidoY = 1;
                        gambiarra = false; 
                    }
                    break;
    
                case 80://pausa (P)
                    
                        alert(' Jogo pausado, OK para desbloquear ');
                        // função "pause" para quem tem TOC e programa o jogo enquanto o mesmo roda em outra tela 
                    break;
            }
        }

// loop principal do jogo
var fps = 5;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;
  
function draw() {
     
    requestAnimationFrame(draw);
    interval = 1000/fps
    now = Date.now();
    delta = now - then;
     
    if (delta > interval) {
        then = now - (delta % interval); 
        mover();
    }
}
 
draw();
    
