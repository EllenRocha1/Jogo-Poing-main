document.addEventListener('DOMContentLoaded', async () => {
    // Elementos do jogo
    const ball = document.getElementById('ball');
    const paddle = document.getElementById('paddle');
    const scoreElement = document.getElementById('score');
     const gameContainer = document.getElementById('game-container');
     const connectionPopup = document.getElementById('connection-popup');
    const connectButton = document.getElementById('connect-button');
    const errorMessage = document.getElementById('error-message');
    
    // Configurações
    const BALL_SPEED = 4;
    const PADDLE_SPEED = 25;
    
    // Estado do jogo
    let ballX = 190, ballY = 100;
    let ballDX = BALL_SPEED, ballDY = BALL_SPEED;
    let paddleX = 160;
    let score = 0;
    
    // Posiciona elementos iniciais
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
    paddle.style.left = paddleX + 'px';
    
    connectButton.addEventListener('click', async () => {
        errorMessage.textContent = ''; // Limpa mensagens de erro antigas
        try {
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });
            
            // --- SUCESSO NA CONEXÃO ---
            // 1. Esconde o pop-up
            connectionPopup.style.display = 'none';
            // 2. Mostra o container do jogo
            gameContainer.style.visibility = 'visible';
            // 3. INICIA O JOGO
            update(); 

            const reader = port.readable.getReader();
            
            // Loop para ler os dados do Arduino
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                const text = new TextDecoder().decode(value);
                if (text.includes("LEFT")) {
                    paddleX = Math.max(0, paddleX - PADDLE_SPEED);
                }
                if (text.includes("RIGHT")) {
                    paddleX = Math.min(320, paddleX + PADDLE_SPEED);
                }
                paddle.style.left = paddleX + 'px';
            }
        } catch (err) {
            console.error("Erro na conexão serial:", err);
            errorMessage.textContent = "Falha ao conectar. Verifique o Arduino e tente novamente.";
        }
    });


    // Fallback para teclado (sempre disponível)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') paddleX = Math.max(0, paddleX - PADDLE_SPEED);
        if (e.key === 'ArrowRight') paddleX = Math.min(320, paddleX + PADDLE_SPEED);
        paddle.style.left = paddleX + 'px';
    });
    
    function update() {
        // Move a bola
        ballX += ballDX;
        ballY += ballDY;
        
        // Colisões com as paredes
        if (ballX <= 0 || ballX >= 380) ballDX = -ballDX;
        if (ballY <= 0) ballDY = -ballDY;
        
        // Colisão com a barra
        if (ballY >= 465 && ballX + 20 >= paddleX && ballX <= paddleX + 80) {
            ballDY = -BALL_SPEED;
            scoreElement.textContent = ++score;
        }
        
        // Game over
        if (ballY > 500) {
            alert(`Fim de jogo! Pontos: ${score}`);
            ballX = 190; ballY = 100;
            ballDX = BALL_SPEED; ballDY = BALL_SPEED;
            score = 0;
            scoreElement.textContent = score;
        }
        
        // Atualiza posição da bola
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
        
        requestAnimationFrame(update);
    }
});