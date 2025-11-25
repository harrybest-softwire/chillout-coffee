document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timerDisplay = document.getElementById('timer');
    const stepIndicator = document.getElementById('step-indicator');
    const drinkButtons = document.querySelectorAll('.drink-btn');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const roastButtons = document.querySelectorAll('.roast-btn');
    const coffeeMachine = document.querySelector('.coffee-machine');
    const resultSection = document.getElementById('result');
    const newOrderBtn = document.getElementById('new-order');
    
    // Navigation buttons
    const back2 = document.getElementById('back-2');
    const back3 = document.getElementById('back-3');
    const back4 = document.getElementById('back-4');
    const confirmBtn = document.getElementById('confirm-btn');
    
    // Game state
    let currentScreen = 0; // 0 = start screen
    let selectedDrink = null;
    let selectedSize = null;
    let selectedRoast = null;
    let startTime = 0;
    let timerInterval = null;
    let gameStarted = false;
    
    // Start button
    const startGameBtn = document.getElementById('start-game-btn');
    startGameBtn.addEventListener('click', startGame);
    
    // Event Listeners - Screen 1
    drinkButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectDrink(btn);
            goToScreen(2);
        });
    });
    
    // Event Listeners - Screen 2
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectSize(btn);
            goToScreen(3);
        });
    });
    back2.addEventListener('click', () => goToScreen(1));
    
    // Event Listeners - Screen 3
    roastButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectRoast(btn);
            goToScreen(4);
        });
    });
    back3.addEventListener('click', () => goToScreen(2));
    
    // Event Listeners - Screen 4
    back4.addEventListener('click', () => goToScreen(3));
    confirmBtn.addEventListener('click', completeOrder);
    
    // New Order
    newOrderBtn.addEventListener('click', startNewOrder);
    
    // Share button
    const shareBtn = document.getElementById('share-btn');
    const shareMessage = document.getElementById('share-message');
    shareBtn.addEventListener('click', shareOrder);
    
    // Functions
    function startGame() {
        // Start the timer
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 10);
        gameStarted = true;
        
        // Go to screen 1
        goToScreen(1);
    }
    
    function selectDrink(button) {
        drinkButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedDrink = button.dataset.drink;
    }
    
    function selectSize(button) {
        sizeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedSize = button.dataset.size;
    }
    
    function selectRoast(button) {
        roastButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedRoast = button.dataset.roast;
    }
    
    function goToScreen(screenNum) {
        // Hide current screen
        if (currentScreen === 0) {
            document.getElementById('screen-start').classList.add('hidden');
        } else {
            document.getElementById(`screen-${currentScreen}`).classList.add('hidden');
        }
        
        // Show new screen
        document.getElementById(`screen-${screenNum}`).classList.remove('hidden');
        
        // Update step indicator
        stepIndicator.textContent = `Step ${screenNum} of 4`;
        currentScreen = screenNum;
        
        // If going to screen 4, populate confirmation
        if (screenNum === 4) {
            document.getElementById('confirm-drink').textContent = capitalizeFirst(selectedDrink);
            document.getElementById('confirm-size').textContent = capitalizeFirst(selectedSize);
            document.getElementById('confirm-roast').textContent = capitalizeFirst(selectedRoast);
        }
    }
    
    function updateTimer() {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const milliseconds = elapsed % 1000;
        
        timerDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    }
    
    function completeOrder() {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        // Show result section
        coffeeMachine.classList.add('hidden');
        resultSection.classList.remove('hidden');
        
        // Update result details
        document.getElementById('result-drink').textContent = capitalizeFirst(selectedDrink);
        document.getElementById('result-size').textContent = capitalizeFirst(selectedSize);
        document.getElementById('result-roast').textContent = capitalizeFirst(selectedRoast);
        document.getElementById('result-time').textContent = timerDisplay.textContent;
    }
    
    function startNewOrder() {
        // Reset state
        currentScreen = 0;
        selectedDrink = null;
        selectedSize = null;
        selectedRoast = null;
        startTime = 0;
        gameStarted = false;
        
        // Clear selections
        drinkButtons.forEach(btn => btn.classList.remove('selected'));
        sizeButtons.forEach(btn => btn.classList.remove('selected'));
        roastButtons.forEach(btn => btn.classList.remove('selected'));
        
        
        // Reset timer
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        timerDisplay.textContent = '00:00.000';
        stepIndicator.textContent = 'Ready to Order';
        
        // Show machine, hide result
        resultSection.classList.add('hidden');
        coffeeMachine.classList.remove('hidden');
        
        // Show start screen
        document.getElementById('screen-start').classList.remove('hidden');
        document.getElementById('screen-1').classList.add('hidden');
        document.getElementById('screen-2').classList.add('hidden');
        document.getElementById('screen-3').classList.add('hidden');
        document.getElementById('screen-4').classList.add('hidden');
    }
    
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
    }
    
    function shareOrder() {
        // Calculate total time in seconds
        const elapsed = Date.now() - startTime;
        const totalSeconds = elapsed / 1000;
        const formattedTime = totalSeconds.toFixed(2);
        
        // Create the share message
        const drink = capitalizeFirst(selectedDrink);
        const size = capitalizeFirst(selectedSize);
        const roast = capitalizeFirst(selectedRoast);
        const websiteUrl = window.location.href;
        
        const shareText = `I ordered a ${size} ${roast} ${drink} in ${formattedTime}s at ${websiteUrl}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            // Show success message
            shareMessage.classList.remove('hidden');
            
            // Hide message after 2 seconds
            setTimeout(() => {
                shareMessage.classList.add('hidden');
            }, 2000);
        }).catch(() => {
            // Fallback if clipboard API fails
            alert('Could not copy to clipboard');
        });
    }
    
    // Initialize
});
