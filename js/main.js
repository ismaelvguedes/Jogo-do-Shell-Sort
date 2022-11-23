const CONTINUAR = false, TROCAR = true;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Vetor{
    constructor(){
        this.certo = new Audio('audio/certo.mp3');
        this.errado = new Audio('audio/errado.mp3');
        this.certo.volume = .2;
        this.errado.volume = .2;
        this.vetor = []
        this.lista = document.querySelector("#vetor");
        this.gap_text = document.querySelector("#gap");
        for (let index = 0; index < (Math.floor(Math.random() * 10)) + 3 ; index++) {
            this.vetor.push(Math.floor(Math.random() * 10));
        }
        // Casos especiais
        // this.vetor = [0, 8, 2, 7, 5, 6, 4, 9];
        // this.vetor = [9, 7, 3, 2, 7, 9, 7, 4];
        // this.vetor = [9, 5, 6, 2, 7, 9, 1, 0];
        // this.vetor = [8, 8, 9, 6, 1];
        this.atualizar();
        this.respostaDada = true;
        this.respondido = false;
        this.data = new Date();
        this.selecionado = false;
        this.status = 'Esperando';
        this.abertura = this.data.getMinutes();
        this.score = 0;
        this.calcular();
        this.denovo = false;
    }
    novo(){
        this.vetor = []
        this.lista = document.querySelector("#vetor");
        this.gap_text = document.querySelector("#gap");
        for (let index = 0; index < (Math.floor(Math.random() * 10)) + 3 ; index++) {
            this.vetor.push(Math.floor(Math.random() * 10));
        }
        this.atualizar();
        this.respostaDada = true;
        this.respondido = false;
        this.data = new Date();
        this.selecionado = false;
        this.status = 'Esperando';
        this.abertura = this.data.getMinutes();
        this.calcular();
        this.denovo = false;
    }
    atualizar(){
        this.lista.innerHTML = '';
        for (let index = 0; index < this.vetor.length; index++) {
            this.lista.innerHTML += '<li class="posicao">' + this.vetor[index] + '</li>'
        }
        this.gap_text.innerText = "Gap: " + this.gap;
        document.getElementById('tamanho').innerText = 'Tamanho: ' + this.vetor.length;
        document.getElementById('score').innerText = this.score;
        switch (this.status) {
            case 'Acertou !':
                document.getElementById('resposta').style.color = 'greenyellow';
                break;
            case 'Errou !':
                document.getElementById('resposta').style.color = 'red';
                break;
            case 'FIM DE JOGO!':
                document.getElementById('resposta').style.color = 'yellow';
                break;
            case 'NOVO GAP!':
                document.getElementById('resposta').style.color = 'pink';
                break;
            default:
                document.getElementById('resposta').style.color = 'white';
                break;
        }
        
        document.getElementById('resposta').innerText = this.status;
    }
    reponder(resposta){
        this.respostaDada = resposta;
        this.respondido = true;
    }
    selecionar(i1, i2){
        this.lista.children.item(i1).style.backgroundColor = '#f1ff7f';
        this.lista.children.item(i1).style.transform = ' translateY(-30px)';
        this.lista.children.item(i2).style.backgroundColor = '#f1ff7f';
        this.lista.children.item(i2).style.transform = ' translateY(-30px)';
    }
    deselecionar(){
        this.selecionado = false;
        for (let index = 0; index < this.vetor.length; index++) {
            this.lista.children.item(index).style.backgroundColor = 'white';
        }
    }
    verificar(resposta){
        if (this.respostaDada == resposta){
            this.status = 'Acertou !';
            this.score += 1;
            this.certo.currentTime = 0;
            this.certo.play();
        }
        else {
            this.status = 'Errou !';
            this.errado.currentTime = 0;
            
            this.errado.play();
        }
    }
    async calcular(){
        console.log(this.vetor);
        let gap, x, y, memoria;
        gap = parseInt((this.vetor.length / 2));
        this.gap = gap;
        this.atualizar();
        while(gap > 0){
            for (x = gap; x < this.vetor.length; x++) {
                let trocou = false;
                memoria = this.vetor[x];
                y = x;
                if(!this.selecionado){
                    this.selecionar(y - gap, y);
                    this.selecionado = true;
                }
                if(this.respondido){
                    this.deselecionar();
                    while((y >= gap) && (memoria < this.vetor[y - gap])){
                        this.selecionar(y - gap, y);
                        this.atualizar();
                        if(this.respondido){
                            this.verificar(TROCAR);
                            this.vetor[y] = this.vetor[y - gap];
                            y = y - gap;
                            trocou = true;
                            this.vetor[y] = memoria;
                            this.respondido = false;
                            this.deselecionar();
                            this.atualizar();
                        } else {
                            this.selecionar(y - gap, y);
                            await sleep(100);
                        }
                    }
                    if (!trocou){
                        this.verificar(CONTINUAR);
                        this.respondido = false;
                        this.atualizar();
                    }
                }
                else {
                    x--;
                    await sleep(100);
                }
                
            }
            gap = parseInt(gap / 2);
            this.gap = gap;
            this.status = 'NOVO GAP!';
            this.atualizar();
        }
        this.status = "FIM DE JOGO!"
        this.atualizar();
    }    
    
}

const vetor = new Vetor();

//parseInt(lista.item(index).innerText)