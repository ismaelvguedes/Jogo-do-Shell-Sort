const CONTINUAR = false, TROCAR = true;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Vetor{
    constructor(){
        this.vetor = []
        this.lista = document.querySelector("#vetor");
        this.gap_text = document.querySelector("#gap");
        for (let index = 0; index < 8; index++) {
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
    }
    atualizar(){
        this.lista.innerHTML = '';
        for (let index = 0; index < this.vetor.length; index++) {
            this.lista.innerHTML += '<li class="posicao">' + this.vetor[index] + '</li>'
        }
        this.gap_text.innerText = "Gap: " + this.gap;
        document.getElementById('tamanho').innerText = 'Tamanho: ' + this.vetor.length;
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
        this.lista.children.item(i1).style.backgroundColor = '#c7c7c7';
        this.lista.children.item(i1).style.transform = ' translateY(-30px)';
        this.lista.children.item(i2).style.backgroundColor = '#c7c7c7';
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
        }
        else {
            this.status = 'Errou !';
        }
    }
    async calcular(){
        let gap, x, y, memoria;
    
        gap = parseInt(this.vetor.length / 2);
        this.gap = gap;
        this.atualizar();
        while(gap > 0){
            for (x = gap; x < this.vetor.length; x++) {
                let trocou = false;
                memoria = this.vetor[x];
                y = x;
                if(!this.selecionado){
                    this.selecionar(y - gap, x);
                    this.selecionado = true;
                }
                if(this.respondido){
                    this.deselecionar();
                    while((y >= gap) && (memoria < this.vetor[y - gap])){
                        if(this.respondido){
                            this.verificar(TROCAR);
                            this.vetor[y] = this.vetor[y - gap];
                            y = y - gap;
                            trocou = true;
                            this.vetor[y] = memoria;
                            this.respondido = false;
                            this.atualizar();
                            this.abertura = this.data.getMinutes();
                        } else {
                            if(!this.selecionado){
                                this.selecionar(y - gap, x);
                                this.selecionado = true;
                            }
                            await sleep(100);
                        }
                    }
                    if (!trocou){
                        this.verificar(CONTINUAR);
                        this.respondido = false;
                        this.atualizar();
                        this.abertura = this.data.getMinutes();
                    }
                }
                else {
                    x--;
                    await sleep(100);
                }
            }
            gap = parseInt(gap / 2);
            this.gap = gap;
        }
        this.status = "FIM DE JOGO!"
        this.atualizar();
    }    
    
}

const vetor = new Vetor();

//parseInt(lista.item(index).innerText)