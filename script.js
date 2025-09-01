// Terminal Portfolio Script inspired by fakeverything.com
document.addEventListener('DOMContentLoaded', () => {
    // Audio disabled per user request
    let history = [];
    let historyIndex = -1;

    function playSound(type) {
        // Sounds disabled
    }

    // ASCII Art variants
    let currentAsciiIndex = 0;
    const asciiVariants = [
        `
██████╗ ███████╗██╗     ███████╗███████╗██╗   ██╗
██╔══██╗██╔════╝██║     ██╔════╝██╔════╝██║   ██║
██████╔╝█████╗  ██║     ███████╗█████╗  ██║   ██║
██╔══██╗██╔══╝  ██║     ╚════██║██╔══╝  ╚██╗ ██╔╝
██║  ██║███████╗███████╗███████║███████╗ ╚████╔╝ 
╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝  ╚═══╝  
        `,
                `
░       ░░░        ░░  ░░░░░░░░░      ░░░        ░░  ░░░░  ░
▒  ▒▒▒▒  ▒▒  ▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒  ▒▒▒▒  ▒
▓       ▓▓▓      ▓▓▓▓  ▓▓▓▓▓▓▓▓▓      ▓▓▓      ▓▓▓▓▓  ▓▓  ▓▓
█  ███  ███  ████████  ██████████████  ██  ██████████    ███
█  ████  ██        ██        ███      ███        █████  ████
                                                            
        `,
        `
▄▄▄▄  ▄▄▄▄▄ ▄      ▄▄▄▄▄ ▄▄▄▄▄ ▄   ▄
█   █ █     █      █     █     █   █
█▄▄▄▄ █▄▄▄  █      █▄▄▄▄ █▄▄▄  █   █
█   █ █     █      ▄   █ █     █   █
█   █ █▄▄▄▄ █▄▄▄▄▄ █▄▄▄█ █▄▄▄▄  ▀█▀
        `,
        `
 ______    _______  ___      _______  _______  __   __ 
|    _ |  |       ||   |    |       ||       ||  | |  |
|   | ||  |    ___||   |    |  _____||    ___||  |_|  |
|   |_||_ |   |___ |   |    | |_____ |   |___ |       |
|    __  ||    ___||   |___ |_____  ||    ___||       |
|   |  | ||   |___ |       | _____| ||   |___  |     | 
|___|  |_||_______||_______||_______||_______|  |___|  
        `,
        `
____/\\\\\\\\\_____________________/\\\\\\______________________________________________        
 __/\\\///////\\\__________________\////\\\______________________________________________       
  _\/\\\_____\/\\\_____________________\/\\\______________________________________________      
   _\/\\\\\\\\\\\/________/\\\\\\\\_____\/\\\_____/\\\\\\\\\\_____/\\\\\\\\___/\\\____/\\\_     
    _\/\\\//////\\\______/\\\/////\\\____\/\\\____\/\\\//////____/\\\/////\\\_\//\\\__/\\\__    
     _\/\\\____\//\\\____/\\\\\\\\\\\_____\/\\\____\/\\\\\\\\\\__/\\\\\\\\\\\___\//\\\/\\\___   
      _\/\\\_____\//\\\__\//\\///////______\/\\\____\////////\\\_\//\\///////_____\//\\\\\____  
       _\/\\\______\//\\\__\//\\\\\\\\\\__/\\\\\\\\\__/\\\\\\\\\\__\//\\\\\\\\\\____\//\\\_____ 
        _\///________\///____\//////////__\/////////__\//////////____\//////////______\///______
        `
    ];
    
    function updateAsciiArt() {
        document.querySelector('.ascii-text').textContent = asciiVariants[currentAsciiIndex];
        document.getElementById('ascii-counter').textContent = `${currentAsciiIndex + 1}/${asciiVariants.length}`;
    }
    
    function nextAsciiArt() {
        currentAsciiIndex = (currentAsciiIndex + 1) % asciiVariants.length;
        updateAsciiArt();
    }
    
    function prevAsciiArt() {
        currentAsciiIndex = (currentAsciiIndex - 1 + asciiVariants.length) % asciiVariants.length;
        updateAsciiArt();
    }
    
    // Initialize first ASCII art
    setTimeout(() => {
        updateAsciiArt();
    }, 100);
    
    // ASCII art controls
    setTimeout(() => {
        const asciiNext = document.getElementById('ascii-next');
        const asciiPrev = document.getElementById('ascii-prev');
        const asciiText = document.querySelector('.ascii-text');
        
        if (asciiNext) asciiNext.addEventListener('click', nextAsciiArt);
        if (asciiPrev) asciiPrev.addEventListener('click', prevAsciiArt);
        if (asciiText) asciiText.addEventListener('click', nextAsciiArt);
    }, 100);
    
    // Auto-cycle ASCII art every 15 seconds (increased from 10)
    setInterval(nextAsciiArt, 15000);
    
    // Global game input handler
    document.addEventListener('keydown', handleGameInput);

    // Typing animation removed since demo line is removed

    // Available commands for autocomplete
    const availableCommands = ['steam', 'youtube', 'tiktok', 'telegram', 'discord', 'email', 'help', 'clear', 'whoami', 'ls', 'exit', 'quit', 'date', 'pwd', 'uptime', 'history', 'echo', 'games', 'snake', 'tetris', 'pong', 'dino', 'maximize', 'max', 'minimize', 'min', 'restore', 'records', 'clearrecords', 'addrecord'];
    const telegramSubCommands = ['personal', 'commercial', 'channel'];

    // Terminal input
    const input = document.getElementById('terminal-input');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            if (cmd) {
                executeCommand(cmd);
                if (history[0] !== cmd) { // Avoid duplicates
                    history.unshift(cmd);
                    if (history.length > 50) history.pop(); // Limit history
                }
                historyIndex = -1;
            }
            input.value = '';
            playSound('enter');
        } else if (e.key === 'ArrowUp' && history.length > 0) {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                input.value = history[historyIndex];
                // Move cursor to end
                setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = history[historyIndex];
                setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
            } else {
                historyIndex = -1;
                input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            autoComplete();
        } else if (e.key === 'Escape') {
            input.value = '';
            historyIndex = -1;
        }
    });

    // Auto-complete function
    function autoComplete() {
        const currentInput = input.value.toLowerCase();
        const words = currentInput.split(' ');
        const lastWord = words[words.length - 1];
        
        let matches = [];
        
        if (words.length === 1) {
            // Complete main commands
            matches = availableCommands.filter(cmd => cmd.startsWith(lastWord));
        } else if (words[0] === 'telegram' && words.length === 2) {
            // Complete telegram subcommands
            matches = telegramSubCommands.filter(sub => sub.startsWith(lastWord));
        }
        
        if (matches.length === 1) {
            if (words.length === 1) {
                input.value = matches[0];
            } else {
                words[words.length - 1] = matches[0];
                input.value = words.join(' ');
            }
            setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
        } else if (matches.length > 1) {
            addOutput(`Available: ${matches.join(', ')}`, 'info');
        }
    }

    input.addEventListener('input', () => {
        if (input.value.length > 0) playSound('type');
    });

    // Command execution
    function executeCommand(cmd) {
        addToHistory(cmd);
        const command = cmd.toLowerCase();
        
        const links = {
            steam: '//steamcommunity.com/id/Relsev/',
            youtube: '//www.youtube.com/@Re1s3v',
            tiktok: '//www.tiktok.com/@everelsu',
            discord: '//discord.com/users/490411567620423680'
        };
        
        if (links[command]) {
            addOutput(`→ Opening ${command}...`, 'success');
            window.open(links[command], '_blank');
        } else if (command === 'telegram') {
            addOutput('→ Telegram options:', 'success');
            addOutput('  personal   - t.me/re1sev', 'info');
            addOutput('  commercial - t.me/steamSaler', 'info');
            addOutput('  channel    - t.me/relsev', 'info');
        } else if (command.startsWith('telegram ')) {
            const sub = command.split(' ')[1];
            const telegramLinks = {
                personal: '//t.me/re1sev',
                commercial: '//t.me/steamSaler',
                channel: '//t.me/relsev'
            };
            if (telegramLinks[sub]) {
                addOutput(`→ Opening telegram ${sub}...`, 'success');
                window.open(telegramLinks[sub], '_blank');
            } else {
                addOutput(`Unknown telegram option: ${sub}`, 'error');
            }
        } else if (command === 'email') {
            copyToClipboard('egor.dagbaev@bk.ru');
            addOutput('→ Email copied: egor.dagbaev@bk.ru', 'success');
        } else if (command === 'help') {
            showHelp();
        } else if (command === 'clear') {
            clearOutput();
        } else if (command === 'whoami') {
            addOutput('Relsev - Digital Creator & Developer', 'info');
        } else if (command === 'ls') {
            addOutput('steam  youtube  tiktok  telegram  discord  email', 'info');
        } else if (command === 'exit' || command === 'quit') {
            addOutput('Thanks for visiting! 👋', 'success');
            addOutput('Redirecting to Google...', 'info');
            setTimeout(() => window.location.href = 'https://google.com', 2000);
        } else if (command === 'date') {
            addOutput(new Date().toLocaleString('ru-RU'), 'info');
        } else if (command === 'pwd') {
            addOutput('/home/relsev', 'info');
        } else if (command === 'uptime') {
            const uptime = Math.floor((Date.now() - performance.timeOrigin) / 1000);
            addOutput(`up ${Math.floor(uptime / 60)} minutes, ${uptime % 60} seconds`, 'info');
        } else if (command === 'history') {
            addOutput('Command history:', 'info');
            history.slice(0, 10).forEach((cmd, i) => {
                addOutput(`  ${history.length - i}  ${cmd}`, 'info');
            });
        } else if (command.startsWith('echo ')) {
            const text = cmd.slice(5);
            addOutput(text, 'info');
        } else if (command === 'games') {
            showGamesMenu();
        } else if (command === 'maximize' || command === 'max') {
            const terminal = document.querySelector('.terminal-container');
            terminal.classList.add('maximized');
            addOutput('→ Terminal maximized', 'success');
        } else if (command === 'minimize' || command === 'min') {
            const terminal = document.querySelector('.terminal-container');
            terminal.classList.add('minimized');
            addOutput('→ Terminal minimized', 'success');
        } else if (command === 'restore') {
            const terminal = document.querySelector('.terminal-container');
            terminal.classList.remove('maximized', 'minimized');
            addOutput('→ Terminal restored to normal size', 'success');
        } else if (command === 'snake') {
            addOutput('→ Starting Terminal Snake...', 'success');
            startGame('snake');
        } else if (command === 'tetris') {
            addOutput('→ Starting Terminal Tetris...', 'success');
            startGame('tetris');
        } else if (command === 'pong') {
            addOutput('→ Starting Terminal Pong...', 'success');
            startGame('pong');
        } else if (command === 'dino') {
            addOutput('→ Starting Terminal Dino...', 'success');
            startGame('dino');
        } else if (command === 'records') {
            const recordsWindow = document.getElementById('records-window');
            recordsWindow.style.display = 'flex';
            displayRecordsTable();
            addOutput('→ Records window opened', 'success');
        } else if (command === 'clearrecords') {
            clearRecords();
        } else if (command.startsWith('addrecord ')) {
            const parts = cmd.slice(10).split(' ');
            if (parts.length >= 2) {
                const game = parts[0];
                const score = parts[1];
                addRecord(game, score);
            } else {
                addOutput('Usage: addrecord <game> <score>', 'error');
            }
        } else {
            addOutput(`bash: ${cmd}: command not found`, 'error');
            addOutput('Type "help" for available commands', 'info');
        }
    }

    function addToHistory(cmd) {
        const output = document.getElementById('output');
        const div = document.createElement('div');
        div.innerHTML = `<span style="color: #00ff00;">guest@relsev:~$</span> <span style="color: #ffff00;">${cmd}</span>`;
        output.appendChild(div);
        scrollToBottom();
    }

    function addOutput(text, type) {
        const output = document.getElementById('output');
        const div = document.createElement('div');
        div.className = `output-line ${type}`;
        div.textContent = text;
        output.appendChild(div);
        scrollToBottom();
    }

    function showHelp() {
        addOutput('╭─────────────────────────────────────────╮', 'success');
        addOutput('│              TERMINAL HELP              │', 'success');
        addOutput('╰─────────────────────────────────────────╯', 'success');
        addOutput('', 'info');
        
        addOutput('📱 SOCIAL LINKS:', 'command');
        addOutput('  steam      → Open Steam gaming profile', 'info');
        addOutput('  youtube    → Open YouTube channel', 'info');
        addOutput('  tiktok     → Open TikTok short videos', 'info');
        addOutput('  telegram   → Show messenger options', 'info');
        addOutput('    ├─ personal    - Personal chat', 'info');
        addOutput('    ├─ commercial  - Business channel', 'info');
        addOutput('    └─ channel     - Personal channel', 'info');
        addOutput('  discord    → Open Discord voice chat', 'info');
        addOutput('  email      → Copy contact email', 'info');
        addOutput('', 'info');
        
        addOutput('💻 SYSTEM COMMANDS:', 'command');
        addOutput('  whoami     → Show user information', 'info');
        addOutput('  ls         → List available links', 'info');
        addOutput('  pwd        → Current directory path', 'info');
        addOutput('  date       → Show current date/time', 'info');
        addOutput('  uptime     → System uptime info', 'info');
        addOutput('  history    → Show command history', 'info');
        addOutput('  echo <txt> → Print text to terminal', 'info');
        addOutput('  clear      → Clear terminal screen', 'info');
        addOutput('  help       → Show this help menu', 'info');
        addOutput('  maximize   → Maximize terminal window', 'info');
        addOutput('  minimize   → Minimize terminal window', 'info');
        addOutput('  restore    → Restore normal window size', 'info');
        addOutput('  exit/quit  → Leave terminal', 'info');
        addOutput('', 'info');
        
        addOutput('🎮 GAMES & FUN:', 'command');
        addOutput('  games      → Show games menu', 'info');
        addOutput('  snake      → Classic Snake game', 'info');
        addOutput('  pong       → Paddle ball game (vs AI)', 'info');
        addOutput('  dino       → Dinosaur runner game', 'info');
        addOutput('  tetris     → Block puzzle (coming soon)', 'info');
        addOutput('  records    → Show gaming records table', 'info');
        addOutput('  addrecord  → Add custom record (game score)', 'info');
        addOutput('  clearrecords → Clear all records', 'info');
        addOutput('', 'info');
        
        addOutput('⌨️  KEYBOARD SHORTCUTS:', 'command');
        addOutput('  ↑/↓        → Browse command history', 'info');
        addOutput('  Tab        → Auto-complete commands', 'info');
        addOutput('  Esc        → Clear current input', 'info');
        addOutput('', 'info');
        
        addOutput('💡 TIPS:', 'command');
        addOutput('  • Click on commands above to try them', 'info');
        addOutput('  • Use Tab for auto-completion', 'info');
        addOutput('  • Arrow keys to navigate history', 'info');
        addOutput('  • Type "games" for entertainment', 'info');
        addOutput('', 'info');
    }

    function clearOutput() {
        const output = document.getElementById('output');
        Array.from(output.children).forEach(child => {
            if (!child.classList.contains('ascii-art') && !child.classList.contains('info-block') && !child.classList.contains('commands-help')) {
                child.remove();
            }
        });
    }

    function scrollToBottom() {
        const outputSection = document.getElementById('output');
        if (outputSection) {
            outputSection.scrollTop = outputSection.scrollHeight;
        }
    }

    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        showMessage('Copied to clipboard!');
    }

    function showMessage(text) {
        const msg = document.querySelector('.copied-message');
        msg.textContent = text;
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), 2000);
    }

    // Click handlers
    setTimeout(() => {
        document.querySelectorAll('.command-item').forEach(item => {
            item.addEventListener('click', () => {
                const cmd = item.dataset.cmd;
                if (cmd === 'telegram') {
                    const subCmds = item.querySelector('.sub-commands');
                    subCmds.style.display = subCmds.style.display === 'none' ? 'block' : 'none';
                } else {
                    input.value = cmd;
                    input.focus();
                }
            });
        });

        document.querySelectorAll('.sub-command').forEach(sub => {
            sub.addEventListener('click', (e) => {
                e.stopPropagation();
                const url = sub.dataset.url;
                if (url) window.open(url, '_blank');
            });
        });
    }, 100);

    // Konami code - only when game window is not open
    let konami = [];
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        const gameWindow = document.getElementById('game-window');
        const isGameOpen = gameWindow && gameWindow.style.display !== 'none';
        
        // Only track konami code when game is not open and target is not input
        if (!isGameOpen && e.target !== input) {
            konami.push(e.code);
            if (konami.length > sequence.length) konami.shift();
            if (konami.join(',') === sequence.join(',')) {
                document.documentElement.style.setProperty('--text-primary', '#ff0080');
                showMessage('🎉 Matrix mode activated!');
                addToHistory('matrix');
                addOutput('Welcome to the Matrix, Neo!', 'success');
                setTimeout(() => {
                    document.documentElement.style.setProperty('--text-primary', '#00ff00');
                    addOutput('Reality restored.', 'info');
                }, 10000);
                konami = [];
            }
        }
    });

    // Terminal button functionality
    setTimeout(() => {
        const closeBtn = document.querySelector('.close-btn');
        const minimizeBtn = document.querySelector('.minimize-btn');
        const maximizeBtn = document.querySelector('.maximize-btn');
        const menuBtn = document.querySelector('.menu-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // Open Google.com
                window.location.href = 'https://google.com';
            });
        }
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                const terminal = document.querySelector('.terminal-container');
                terminal.classList.toggle('minimized');
            });
        }
        
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => {
                const terminal = document.querySelector('.terminal-container');
                const isMaximized = terminal.classList.contains('maximized');
                
                if (isMaximized) {
                    terminal.classList.remove('maximized');
                    addOutput('Terminal restored to normal size', 'info');
                } else {
                    terminal.classList.add('maximized');
                    addOutput('Terminal maximized - Press maximize button again to restore', 'info');
                }
            });
        }
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                addOutput('Terminal Shortcuts:', 'info');
                addOutput('  ↑/↓       - browse command history', 'info');
                addOutput('  Tab       - auto-complete commands', 'info');
                addOutput('  Esc       - clear current input', 'info');
                addOutput('  Enter     - execute command', 'info');
                addOutput('  type "help" for full command list', 'info');
            });
        }
    }, 100);

    // No more Ctrl+C and Ctrl+L shortcuts - removed per user request

    // Games Logic
    let gameWindow, canvas, ctx, gameRunning = false, gamePaused = false;
    let snake, food, score, highScore, direction = { x: 0, y: 0 }, gameSpeed;
    let currentGame = 'snake';
    
    // Pong game variables
    let playerPaddle, aiPaddle, ball, pongSpeed = 4;
    
    // Dino game variables
    let dino, obstacles = [], clouds = [], dinoSpeed = 5, gravity = 0.8, isJumping = false;

    function showGamesMenu() {
        addOutput('🎮 Available Games:', 'info');
        addOutput('  snake  - Classic Snake game', 'info');
        addOutput('  tetris - Block stacking puzzle', 'info');
        addOutput('  pong   - Classic paddle game', 'info');
        addOutput('  dino   - Chrome dinosaur runner', 'info');
        addOutput('', 'info');
        addOutput('Usage: type game name to start (e.g., "snake")', 'info');
    }

    function startGame(gameType = 'snake') {
        currentGame = gameType;
        gameWindow = document.getElementById('game-window');
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
        
        // Update game title
        document.querySelector('.game-title').textContent = `Terminal ${gameType.charAt(0).toUpperCase() + gameType.slice(1)} v1.0`;
        
        gameWindow.style.display = 'block';
        
        if (gameType === 'snake') {
            initSnakeGame();
        } else if (gameType === 'tetris') {
            initTetrisGame();
        } else if (gameType === 'pong') {
            initPongGame();
        } else if (gameType === 'dino') {
            initDinoGame();
        }
        
        setupGameControls();
        
        // Add keyup listener for dino ducking
        document.addEventListener('keyup', (e) => {
            if (currentGame === 'dino' && gameRunning && e.key.toLowerCase() === 'arrowdown') {
                dinoDuck(false);
            }
        });
    }

    function initSnakeGame() {
        snake = [{ x: 200, y: 200 }];
        food = generateFood();
        score = 0;
        highScore = localStorage.getItem('snakeHighScore') || 0;
        direction = { x: 0, y: 0 };
        gameSpeed = 150;
        gameRunning = false;
        gamePaused = false;
        
        updateSnakeDisplay();
        updateStatus('Press any key to start!');
        updateInstructions('snake');
        
        document.getElementById('score').textContent = score;
        document.getElementById('high-score').textContent = highScore;
    }

    function initTetrisGame() {
        score = 0;
        highScore = localStorage.getItem('tetrisHighScore') || 0;
        gameRunning = false;
        gamePaused = false;
        
        updateTetrisDisplay();
        updateStatus('Press any key to start!');
        updateInstructions('tetris');
        
        document.getElementById('score').textContent = score;
        document.getElementById('high-score').textContent = highScore;
    }

    function initPongGame() {
        // Reset game state
        score = 0;
        let aiScore = 0;
        highScore = localStorage.getItem('pongHighScore') || 0;
        gameRunning = false;
        gamePaused = false;
        pongSpeed = 4;
        
        // Initialize paddles
        playerPaddle = { x: 10, y: 160, width: 12, height: 60, speed: 8, score: 0 };
        aiPaddle = { x: 378, y: 160, width: 12, height: 60, speed: 5, score: 0 };
        
        // Initialize ball
        ball = { 
            x: 194, 
            y: 194, 
            width: 12, 
            height: 12, 
            speedX: pongSpeed * (Math.random() > 0.5 ? 1 : -1),
            speedY: pongSpeed * (Math.random() > 0.5 ? 1 : -1),
            maxSpeed: 8
        };
        
        updatePongDisplay();
        updateStatus('Press W/S to move paddle - First to 5 wins!');
        updateInstructions('pong');
        
        document.getElementById('score').textContent = `${playerPaddle.score} : ${aiPaddle.score}`;
        document.getElementById('high-score').textContent = highScore;
    }

    function initDinoGame() {
        // Reset game state
        score = 0;
        highScore = localStorage.getItem('dinoHighScore') || 0;
        gameRunning = false;
        gamePaused = false;
        dinoSpeed = 3;
        gravity = 0.6;
        isJumping = false;
        
        // Initialize dino
        dino = { 
            x: 60, 
            y: 340, 
            width: 20, 
            height: 25, 
            velocityY: 0,
            jumpPower: -12,
            groundY: 340,
            isDucking: false
        };
        
        // Initialize obstacles and clouds
        obstacles = [];
        clouds = [];
        
        updateDinoDisplay();
        updateStatus('Press SPACE or ↑ to jump, ↓ to duck - Avoid cacti!');
        updateInstructions('dino');
        
        document.getElementById('score').textContent = Math.floor(score / 10);
        document.getElementById('high-score').textContent = highScore;
    }

    function setupGameControls() {
        // Remove existing event listeners to prevent duplicates
        const closeBtn = document.querySelector('.close-game-btn');
        const minimizeBtn = document.querySelector('.minimize-game-btn');
        
        // Clone nodes to remove all event listeners
        const newCloseBtn = closeBtn.cloneNode(true);
        const newMinimizeBtn = minimizeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        minimizeBtn.parentNode.replaceChild(newMinimizeBtn, minimizeBtn);
        
        // Add fresh event listeners
        newCloseBtn.addEventListener('click', () => {
            gameWindow.style.display = 'none';
            gameRunning = false;
            gamePaused = false;
            // Return focus to terminal input when closing game
            input.focus();
        });

        newMinimizeBtn.addEventListener('click', () => {
            gameWindow.classList.toggle('minimized');
        });
    }

    function handleGameInput(e) {
        // Check if game window exists and is visible
        if (!gameWindow || gameWindow.style.display === 'none' || !gameWindow.style.display) return;

        // Start game if not running and not paused
        if (!gameRunning && !gamePaused) {
            if (currentGame === 'snake' && direction && direction.x === 0 && direction.y === 0) {
                gameRunning = true;
                updateStatus('Game started! Use WASD or arrows to move');
                gameLoop();
            } else if (currentGame !== 'snake') {
                gameRunning = true;
                if (currentGame === 'pong') {
                    updateStatus('Game started! Use W/S to move paddle');
                } else if (currentGame === 'dino') {
                    updateStatus('Game started! Press SPACE to jump');
                } else if (currentGame === 'tetris') {
                    updateStatus('Game started! Use WASD to control blocks');
                }
                gameLoop();
            }
        }

        // Game controls - only if game is running or paused (not game over)
        if (gameRunning || gamePaused) {
            if (currentGame === 'snake') {
                switch(e.key.toLowerCase()) {
                    case 'w':
                    case 'arrowup':
                        if (gameRunning && direction.y === 0) direction = { x: 0, y: -20 };
                        break;
                    case 's':
                    case 'arrowdown':
                        if (gameRunning && direction.y === 0) direction = { x: 0, y: 20 };
                        break;
                    case 'a':
                    case 'arrowleft':
                        if (gameRunning && direction.x === 0) direction = { x: -20, y: 0 };
                        break;
                    case 'd':
                    case 'arrowright':
                        if (gameRunning && direction.x === 0) direction = { x: 20, y: 0 };
                        break;
                }
            } else if (currentGame === 'pong') {
                switch(e.key.toLowerCase()) {
                    case 'w':
                    case 'arrowup':
                        if (gameRunning) playerPaddle.y = Math.max(playerPaddle.y - playerPaddle.speed, 0);
                        break;
                    case 's':
                    case 'arrowdown':
                        if (gameRunning) playerPaddle.y = Math.min(playerPaddle.y + playerPaddle.speed, 400 - playerPaddle.height);
                        break;
                }
            } else if (currentGame === 'dino') {
                switch(e.key.toLowerCase()) {
                    case 'arrowup':
                        if (gameRunning) dinoJump();
                        break;
                    case 'arrowdown':
                        if (gameRunning) dinoDuck(true);
                        break;
                }
            }
            
            // Universal pause for all games (except dino where space is jump)
            if (e.key === ' ') {
                if (currentGame === 'dino') {
                    if (gameRunning) dinoJump();
                } else {
                    gamePaused = !gamePaused;
                    updateStatus(gamePaused ? 'Game paused - Press SPACE to resume' : 'Game resumed!');
                    if (!gamePaused && gameRunning) {
                        gameLoop(); // Resume game loop
                    }
                }
            }
        }
        
        // Restart is always available
        if (e.key.toLowerCase() === 'r') {
            if (currentGame === 'snake') {
                initSnakeGame();
            } else if (currentGame === 'tetris') {
                initTetrisGame();
            } else if (currentGame === 'pong') {
                initPongGame();
            } else if (currentGame === 'dino') {
                initDinoGame();
            }
        }
    }

    function updateInstructions(gameType) {
        const instructionsContainer = document.querySelector('.game-instructions');
        let instructions = '';
        
        if (gameType === 'snake') {
            instructions = `
                <div class="instruction-line">Use WASD or Arrow Keys to move</div>
                <div class="instruction-line">Eat food (●) to grow</div>
                <div class="instruction-line">Don't hit walls or yourself!</div>
                <div class="instruction-line">Press SPACE to pause/resume</div>
                <div class="instruction-line">Press R to restart</div>
            `;
        } else if (gameType === 'tetris') {
            instructions = `
                <div class="instruction-line">Use A/D or ←/→ to move</div>
                <div class="instruction-line">Use W or ↑ to rotate</div>
                <div class="instruction-line">Use S or ↓ to drop faster</div>
                <div class="instruction-line">Complete lines to score</div>
                <div class="instruction-line">Press SPACE to pause, R to restart</div>
            `;
        } else if (gameType === 'pong') {
            instructions = `
                <div class="instruction-line">Use W/S or ↑/↓ to move paddle</div>
                <div class="instruction-line">Hit the ball with your paddle</div>
                <div class="instruction-line">Ball speeds up after each hit</div>
                <div class="instruction-line">First to 5 points wins!</div>
                <div class="instruction-line">Press SPACE to pause, R to restart</div>
            `;
        } else if (gameType === 'dino') {
            instructions = `
                <div class="instruction-line">Press SPACE or ↑ to jump over cacti</div>
                <div class="instruction-line">Press ↓ to duck under birds</div>
                <div class="instruction-line">Avoid all obstacles</div>
                <div class="instruction-line">Game speeds up over time</div>
                <div class="instruction-line">Press R to restart</div>
            `;
        }
        
        instructionsContainer.innerHTML = instructions;
    }

        function gameLoop() {
        if (!gameRunning || gamePaused) {
            if (gameRunning && !gamePaused) {
                setTimeout(gameLoop, currentGame === 'dino' ? 1000/60 : gameSpeed);
            }
            return;
        }

        if (currentGame === 'snake') {
            moveSnake();
            if (checkCollision()) {
                gameOver();
                return;
            }
            if (checkFood()) {
                eatFood();
            }
            updateSnakeDisplay();
            setTimeout(gameLoop, gameSpeed);
        } else if (currentGame === 'tetris') {
            updateTetrisDisplay();
            setTimeout(gameLoop, gameSpeed);
        } else if (currentGame === 'pong') {
            updatePong();
            updatePongDisplay();
            setTimeout(gameLoop, 1000/60); // 60 FPS for smooth movement
        } else if (currentGame === 'dino') {
            updateDino();
            updateDinoDisplay();
            setTimeout(gameLoop, 1000/60); // 60 FPS for smooth movement
        }
    }

    function moveSnake() {
        const head = { 
            x: snake[0].x + direction.x, 
            y: snake[0].y + direction.y 
        };
        snake.unshift(head);

        if (!checkFood()) {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];
        
        // Wall collision
        if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
            return true;
        }
        
        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }

    function checkFood() {
        return snake[0].x === food.x && snake[0].y === food.y;
    }

    function eatFood() {
        score += 10;
        document.getElementById('score').textContent = score;
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            document.getElementById('high-score').textContent = highScore;
        }
        
        food = generateFood();
        
        // Increase speed slightly
        if (gameSpeed > 80) {
            gameSpeed -= 2;
        }
    }

    function generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * 20) * 20,
                y: Math.floor(Math.random() * 20) * 20
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        return newFood;
    }

    function updateSnakeDisplay() {
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 400, 400);
        
        // Draw snake
        ctx.fillStyle = '#00ff00';
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Head - slightly different
                ctx.fillStyle = '#55ff55';
            } else {
                ctx.fillStyle = '#00ff00';
            }
            ctx.fillRect(segment.x, segment.y, 18, 18);
        });
        
        // Draw food
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(food.x, food.y, 18, 18);
        
        // Draw grid lines (subtle)
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 400; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 400);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(400, i);
            ctx.stroke();
        }
    }

    function updateTetrisDisplay() {
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 400, 400);
        
        // Simple Tetris placeholder
        ctx.fillStyle = '#00ff00';
        ctx.font = '20px monospace';
        ctx.fillText('TETRIS', 150, 200);
        ctx.fillText('Coming Soon!', 130, 230);
        
        // Draw border
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, 300, 300);
    }

    function updatePong() {
        // Move ball
        ball.x += ball.speedX;
        ball.y += ball.speedY;
        
        // Ball collision with top/bottom walls
        if (ball.y <= 0 || ball.y >= 400 - ball.height) {
            ball.speedY = -ball.speedY;
            ball.y = Math.max(0, Math.min(400 - ball.height, ball.y));
        }
        
        // Ball collision with player paddle
        if (ball.speedX < 0 && ball.x <= playerPaddle.x + playerPaddle.width &&
            ball.x + ball.width >= playerPaddle.x &&
            ball.y + ball.height >= playerPaddle.y &&
            ball.y <= playerPaddle.y + playerPaddle.height) {
            
            ball.speedX = Math.abs(ball.speedX);
            // Add spin based on where ball hits paddle
            let hitPos = (ball.y + ball.height/2 - playerPaddle.y) / playerPaddle.height - 0.5;
            ball.speedY += hitPos * 3;
            
            // Increase speed slightly
            if (Math.abs(ball.speedX) < ball.maxSpeed) {
                ball.speedX *= 1.05;
                ball.speedY *= 1.05;
            }
        }
        
        // Ball collision with AI paddle
        if (ball.speedX > 0 && ball.x + ball.width >= aiPaddle.x &&
            ball.x <= aiPaddle.x + aiPaddle.width &&
            ball.y + ball.height >= aiPaddle.y &&
            ball.y <= aiPaddle.y + aiPaddle.height) {
            
            ball.speedX = -Math.abs(ball.speedX);
            // Add spin
            let hitPos = (ball.y + ball.height/2 - aiPaddle.y) / aiPaddle.height - 0.5;
            ball.speedY += hitPos * 3;
            
            // Increase speed slightly
            if (Math.abs(ball.speedX) < ball.maxSpeed) {
                ball.speedX *= 1.05;
                ball.speedY *= 1.05;
            }
        }
        
        // AI movement - improved AI
        let aiCenter = aiPaddle.y + aiPaddle.height / 2;
        let ballCenter = ball.y + ball.height / 2;
        let predictedY = ball.y + ball.speedY * 10; // Predict ball position
        
        if (ball.speedX > 0) { // Ball moving towards AI
            if (aiCenter < predictedY - 10) {
                aiPaddle.y = Math.min(aiPaddle.y + aiPaddle.speed, 400 - aiPaddle.height);
            } else if (aiCenter > predictedY + 10) {
                aiPaddle.y = Math.max(aiPaddle.y - aiPaddle.speed, 0);
            }
        }
        
        // Score points
        if (ball.x < -10) {
            // AI scores
            aiPaddle.score++;
            if (aiPaddle.score >= 5) {
                gameOver();
                return;
            }
            resetPongBall();
        } else if (ball.x > 410) {
            // Player scores
            playerPaddle.score++;
            if (playerPaddle.score >= 5) {
                score = playerPaddle.score;
                gameOver();
                return;
            }
            resetPongBall();
        }
        
        // Update score display
        document.getElementById('score').textContent = `${playerPaddle.score} : ${aiPaddle.score}`;
    }

    function updatePongDisplay() {
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 400, 400);
        
        // Draw center line
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(200, 0);
        ctx.lineTo(200, 400);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw paddles
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
        ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
        
        // Draw ball
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
    }

    function resetPongBall() {
        ball.x = 194;
        ball.y = 194;
        ball.speedX = pongSpeed * (Math.random() > 0.5 ? 1 : -1);
        ball.speedY = pongSpeed * (Math.random() > 0.5 ? 1 : -1);
        
        // Brief pause before next round
        gameRunning = false;
        setTimeout(() => {
            if (gameWindow.style.display !== 'none') {
                gameRunning = true;
                gameLoop();
            }
        }, 1000);
    }

    function updateDino() {
        // Handle ducking
        if (dino.isDucking && !isJumping) {
            dino.height = 15;
            dino.y = dino.groundY + 10;
        } else if (!isJumping) {
            dino.height = 25;
            dino.y = dino.groundY;
        }
        
        // Apply gravity
        if (dino.y < dino.groundY || dino.velocityY < 0) {
            dino.velocityY += gravity;
            dino.y += dino.velocityY;
            
            if (dino.y >= dino.groundY) {
                dino.y = dino.groundY;
                dino.velocityY = 0;
                isJumping = false;
                if (dino.isDucking) {
                    dino.height = 15;
                    dino.y = dino.groundY + 10;
                }
            }
        }
        
        // Move obstacles
        obstacles = obstacles.filter(obstacle => {
            obstacle.x -= dinoSpeed;
            return obstacle.x > -30;
        });
        
        // Move clouds
        if (clouds) {
            clouds = clouds.filter(cloud => {
                cloud.x -= dinoSpeed * 0.3;
                return cloud.x > -50;
            });
        }
        
        // Spawn new obstacles
        if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < 250) {
            if (Math.random() < 0.015 + score * 0.000005) {
                let obstacleType = Math.random();
                if (obstacleType < 0.7) {
                    // Regular cactus
                    obstacles.push({
                        x: 420,
                        y: 345,
                        width: 15,
                        height: 25,
                        type: 'cactus'
                    });
                } else {
                    // Flying obstacle
                    obstacles.push({
                        x: 420,
                        y: 300,
                        width: 20,
                        height: 15,
                        type: 'bird'
                    });
                }
            }
        }
        
        // Spawn clouds
        if (!clouds) clouds = [];
        if (clouds.length === 0 || clouds[clouds.length - 1].x < 300) {
            if (Math.random() < 0.005) {
                clouds.push({
                    x: 420,
                    y: 50 + Math.random() * 100,
                    width: 30,
                    height: 15
                });
            }
        }
        
        // Check collisions
        for (let obstacle of obstacles) {
            if (dino.x < obstacle.x + obstacle.width - 3 &&
                dino.x + dino.width - 3 > obstacle.x &&
                dino.y < obstacle.y + obstacle.height - 3 &&
                dino.y + dino.height - 3 > obstacle.y) {
                gameOver();
                return;
            }
        }
        
        // Increase score and speed
        score += 1;
        if (score % 200 === 0) {
            dinoSpeed += 0.3;
        }
        document.getElementById('score').textContent = Math.floor(score / 10);
    }

    function updateDinoDisplay() {
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 400, 400);
        
        // Draw ground line
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 370);
        ctx.lineTo(400, 370);
        ctx.stroke();
        
        // Draw dino
        ctx.fillStyle = dino.isDucking ? '#88ff88' : '#00ff00';
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
        
        // Draw dino eye
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(dino.x + 14, dino.y + 3, 3, 3);
        
        // Draw obstacles
        obstacles.forEach(obstacle => {
            if (obstacle.type === 'cactus') {
                ctx.fillStyle = '#00aa00';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                // Cactus details
                ctx.fillStyle = '#008800';
                ctx.fillRect(obstacle.x + 2, obstacle.y + 5, 3, 8);
                ctx.fillRect(obstacle.x + obstacle.width - 5, obstacle.y + 8, 3, 6);
            } else if (obstacle.type === 'bird') {
                ctx.fillStyle = '#cccccc';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                // Bird wings
                ctx.fillStyle = '#888888';
                ctx.fillRect(obstacle.x + 2, obstacle.y + 2, 6, 3);
                ctx.fillRect(obstacle.x + 12, obstacle.y + 2, 6, 3);
            }
        });
        
        // Draw clouds
        if (clouds) {
            ctx.fillStyle = '#444444';
            clouds.forEach(cloud => {
                ctx.fillRect(cloud.x, cloud.y, cloud.width, cloud.height);
                ctx.fillRect(cloud.x + 5, cloud.y - 5, cloud.width - 10, cloud.height);
                ctx.fillRect(cloud.x + 10, cloud.y + 5, cloud.width - 20, cloud.height - 5);
            });
        }
        
        // Draw speed indicator
        ctx.fillStyle = '#666666';
        ctx.font = '12px monospace';
        ctx.fillText(`Speed: ${dinoSpeed.toFixed(1)}x`, 320, 20);
    }

    function dinoJump() {
        if (!isJumping && dino.y >= dino.groundY) {
            dino.velocityY = dino.jumpPower;
            isJumping = true;
            dino.isDucking = false;
        }
    }
    
    function dinoDuck(isDucking) {
        if (!isJumping) {
            dino.isDucking = isDucking;
        }
    }

    function gameOver() {
        gameRunning = false;
        updateStatus(`Game Over! Score: ${score} - Press R to restart`);
        
        // Update high score based on game type
        let storageKey = currentGame + 'HighScore';
        if (score > highScore) {
            highScore = score;
            localStorage.setItem(storageKey, highScore);
            document.getElementById('high-score').textContent = highScore;
            updateStatus(`New High Score: ${score}! Press R to restart`);
        }
        
        // Add score to terminal
        addOutput(`Game Over! Final score: ${score}`, score > 0 ? 'success' : 'info');
        if (score === highScore && score > 0) {
            addOutput('🎉 New high score!', 'success');
            // Auto-add record for new high scores
            addRecord(currentGame.charAt(0).toUpperCase() + currentGame.slice(1), score);
        }
    }

    function updateStatus(text) {
        document.getElementById('game-status').textContent = text;
    }

    // Records Table functionality
    let gameRecords = JSON.parse(localStorage.getItem('gameRecords') || '[]');
    
    function addRecord(game, score) {
        const record = {
            id: Date.now(),
            game: game,
            score: parseInt(score),
            date: new Date().toLocaleDateString('ru-RU')
        };
        gameRecords.push(record);
        localStorage.setItem('gameRecords', JSON.stringify(gameRecords));
        displayRecordsTable();
        addOutput(`🏆 New record added: ${game} - ${score}!`, 'success');
    }
    
    function displayRecordsTable() {
        const tbody = document.getElementById('records-window-tbody');
        if (!tbody) return;
        
        if (gameRecords.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="no-records">No records yet!</td></tr>';
            return;
        }
        
        // Sort by score descending
        const sortedRecords = [...gameRecords].sort((a, b) => b.score - a.score);
        
        tbody.innerHTML = sortedRecords.map((record, index) => `
            <tr class="${index === 0 ? 'record-new' : ''}">
                <td>${record.game}</td>
                <td class="record-score">${record.score}</td>
                <td>${record.date}</td>
            </tr>
        `).join('');
    }
    
    function clearRecords() {
        gameRecords = [];
        localStorage.setItem('gameRecords', JSON.stringify(gameRecords));
        displayRecordsTable();
        addOutput('🗑️ All records cleared', 'info');
    }
    
    // Initialize records table display
    setTimeout(() => {
        displayRecordsTable();
    }, 100);
    
    // Records window controls
    setTimeout(() => {
        const closeBtn = document.querySelector('.close-records-window-btn');
        const minimizeBtn = document.querySelector('.minimize-records-window-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('records-window').style.display = 'none';
                addOutput('→ Records window closed', 'info');
            });
        }
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                const recordsWindow = document.getElementById('records-window');
                recordsWindow.classList.toggle('minimized');
                const isMinimized = recordsWindow.classList.contains('minimized');
                addOutput(`→ Records window ${isMinimized ? 'minimized' : 'restored'}`, 'info');
            });
        }
    }, 100);

    // Live terminal features
    const liveMessages = [
        '💻 System running smoothly...',
        '🔄 Auto-updating records...',
        '📊 Monitoring performance...',
        '🎮 Gaming mode ready!',
        '🚀 Terminal optimized!',
        '⚡ Processes synchronized!',
        '🔧 Maintenance complete.',
        '📡 Connection stable.',
        '🎯 Ready for action!',
        '🌟 All systems operational.',
        '🔍 Scanning for updates...',
        '💾 Saving user data...',
        '🛡️ Security check passed.',
        '🎨 Interface refreshed.',
        '⚙️ Background tasks running.',
        '🔥 Performance boosted!',
        '📈 Analytics updated.',
        '🎪 Fun mode activated!'
    ];
    
    const activityIndicators = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let activityIndex = 0;
    
    function showRandomMessage() {
        const message = liveMessages[Math.floor(Math.random() * liveMessages.length)];
        addOutput(message, 'info');
    }
    
    function addBlinkingCursor() {
        const prompt = document.querySelector('.prompt');
        if (prompt && Math.random() > 0.7) {
            prompt.style.animation = 'blink 1s infinite';
            setTimeout(() => {
                if (prompt) {
                    prompt.style.animation = '';
                }
            }, 3000);
        }
    }
    
    function updateActivity() {
        const status = document.querySelector('.status-online');
        if (status && Math.random() > 0.3) {
            const indicator = activityIndicators[activityIndex];
            status.textContent = `${indicator} online`;
            activityIndex = (activityIndex + 1) % activityIndicators.length;
        }
    }
    
    function randomTerminalGlitch() {
        if (Math.random() > 0.95) {
            const terminal = document.querySelector('.terminal-container');
            if (terminal) {
                terminal.style.animation = 'glitch 0.1s';
                setTimeout(() => {
                    terminal.style.animation = '';
                }, 100);
            }
        }
    }
    
    function showTypingIndicator() {
        if (Math.random() > 0.8) {
            const input = document.getElementById('terminal-input');
            if (input) {
                const originalPlaceholder = input.placeholder;
                input.placeholder = 'System is thinking...';
                setTimeout(() => {
                    if (input) {
                        input.placeholder = originalPlaceholder;
                    }
                }, 2000);
            }
        }
    }
    
    // Enhanced live events
    setInterval(() => {
        if (Math.random() > 0.85) {
            showRandomMessage();
        }
    }, 12000);
    
    setInterval(addBlinkingCursor, 8000);
    setInterval(updateActivity, 500);
    setInterval(randomTerminalGlitch, 3000);
    setInterval(showTypingIndicator, 20000);
    
    // Terminal startup messages
    setTimeout(() => addOutput('🖥️  Terminal initializing...', 'info'), 500);
    setTimeout(() => addOutput('⚡ Loading modules...', 'info'), 1000);
    setTimeout(() => addOutput('✅ System ready! Type "help" for commands.', 'success'), 1500);
});
