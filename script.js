document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timerDisplay = document.getElementById('timer');
    const stepIndicator = document.getElementById('step-indicator');
    const drinkButtons = document.querySelectorAll('.beverage-btn');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const roastButtons = document.querySelectorAll('.blend-btn');
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
    let finalTime = 0;
    let timerInterval = null;
    let gameStarted = false;
    
    // Start screen - click anywhere to start
    const startScreen = document.getElementById('screen-start');
    startScreen.addEventListener('click', startGame);
    
    // Drinks that don't need blend selection
    const drinksWithoutBlend = ['hot-chocolate', 'hot-water', 'cold-milk-shot', 'hot-milk', 'hot-milk-shot', 'hot-water-shot'];
    
    // Drinks that don't need size selection (shots and espressos)
    const drinksWithoutSize = ['cold-milk-shot', 'hot-milk-shot', 'hot-water-shot', 'espresso', 'double-espresso', 'espresso-macchiato'];
    
    // Event Listeners - Screen 1
    drinkButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectDrink(btn);
            // Skip size selection for certain drinks
            if (drinksWithoutSize.includes(btn.dataset.drink)) {
                selectedSize = 'N/A'; // Set default value
                // Check if also needs to skip blend
                if (drinksWithoutBlend.includes(btn.dataset.drink)) {
                    selectedRoast = 'N/A';
                    goToScreen(4); // Go directly to confirmation
                } else {
                    goToScreen(3); // Go to blend selection
                }
            } else {
                goToScreen(2); // Go to size selection
            }
        });
    });
    
    // Event Listeners - Screen 2
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectSize(btn);
            // Skip blend selection for certain drinks
            if (drinksWithoutBlend.includes(selectedDrink)) {
                selectedRoast = 'N/A'; // Set default value
                goToScreen(4); // Go directly to confirmation
            } else {
                goToScreen(3);
            }
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
    back4.addEventListener('click', () => {
        // Determine where to go back based on drink type
        if (drinksWithoutSize.includes(selectedDrink)) {
            // If drink doesn't have size, go back to blend or drink selection
            if (drinksWithoutBlend.includes(selectedDrink)) {
                goToScreen(1); // Go back to drink selection
            } else {
                goToScreen(3); // Go back to blend selection
            }
        } else if (drinksWithoutBlend.includes(selectedDrink)) {
            goToScreen(2); // Go back to size selection
        } else {
            goToScreen(3); // Go back to blend selection
        }
    });
    confirmBtn.addEventListener('click', completeOrder);
    
    // New Order
    newOrderBtn.addEventListener('click', startNewOrder);
    
    // Share button
    const shareBtn = document.getElementById('share-btn');
    const shareMessage = document.getElementById('share-message');
    shareBtn.addEventListener('click', shareOrder);
    
    // Functions
    function startGame() {
        // Show the display
        document.querySelector('.display').style.display = 'block';
        
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
        
        // If going to screen 2, show selected beverage
        if (screenNum === 2 && selectedDrink) {
            document.getElementById('selected-beverage-display').textContent = capitalizeFirst(selectedDrink);
        }
        
        // If going to screen 3, show selected drink and size
        if (screenNum === 3 && selectedDrink && selectedSize) {
            document.getElementById('selected-order-display').textContent = 
                `${capitalizeFirst(selectedSize)} · ${capitalizeFirst(selectedDrink)}`;
        }
        
        // If going to screen 4, populate confirmation
        if (screenNum === 4 && selectedDrink) {
            let confirmText = '';
            
            // Add size if applicable
            if (selectedSize !== 'N/A') {
                confirmText = capitalizeFirst(selectedSize);
            }
            
            // Add drink
            if (confirmText) {
                confirmText += ` · ${capitalizeFirst(selectedDrink)}`;
            } else {
                confirmText = capitalizeFirst(selectedDrink);
            }
            
            // Add roast if applicable
            if (selectedRoast && selectedRoast !== 'N/A') {
                confirmText += ` · ${capitalizeFirst(selectedRoast)}`;
            }
            
            document.getElementById('final-order-display').textContent = confirmText;
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
        // Update timer one last time and store the final time
        finalTime = Date.now() - startTime;
        updateTimer(); // Update display to match finalTime
        
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        // Show result section
        coffeeMachine.classList.add('hidden');
        resultSection.classList.remove('hidden');
        
        // Update result details
        const drink = capitalizeFirst(selectedDrink);
        let orderText = '';
        
        // Add size if applicable
        if (selectedSize !== 'N/A') {
            orderText = capitalizeFirst(selectedSize);
        }
        
        // Add roast if applicable
        if (selectedRoast && selectedRoast !== 'N/A') {
            const roast = capitalizeFirst(selectedRoast);
            if (orderText) {
                orderText += ` ${roast}`;
            } else {
                orderText = roast;
            }
        }
        
        // Add drink
        if (orderText) {
            orderText += ` ${drink}`;
        } else {
            orderText = drink;
        }
        
        document.getElementById('result-order-text').textContent = orderText;
        document.getElementById('result-time').textContent = timerDisplay.textContent;
    }
    
    function startNewOrder() {
        // Reset state
        currentScreen = 0;
        selectedDrink = null;
        selectedSize = null;
        selectedRoast = null;
        startTime = 0;
        finalTime = 0;
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
        
        // Hide the display on start screen
        document.querySelector('.display').style.display = 'none';
        
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
        return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    function shareOrder() {
        // Use the stored final time
        const totalSeconds = finalTime / 1000;
        const formattedTime = totalSeconds.toFixed(3);
        
        // Create the share message
        const drink = capitalizeFirst(selectedDrink);
        const websiteUrl = window.location.href;
        
        let orderDescription = '';
        
        // Add size if applicable
        if (selectedSize !== 'N/A') {
            orderDescription = capitalizeFirst(selectedSize);
        }
        
        // Add roast if applicable
        if (selectedRoast && selectedRoast !== 'N/A') {
            const roast = capitalizeFirst(selectedRoast);
            if (orderDescription) {
                orderDescription += ` ${roast}`;
            } else {
                orderDescription = roast;
            }
        }
        
        // Add drink
        if (orderDescription) {
            orderDescription += ` ${drink}`;
        } else {
            orderDescription = drink;
        }
        
        // Get emojis for the order
        const roastEmoji = selectedRoast === 'decaf' ? '😴' : (selectedRoast === 'N/A' ? '' : '⚡');
        
        // Drinks that don't contain coffee
        const drinksWithoutCoffee = ['hot-chocolate', 'hot-water', 'hot-milk', 'hot-milk-shot', 'cold-milk-shot', 'hot-water-shot'];
        const drinkEmoji = drinksWithoutCoffee.includes(selectedDrink) ? '' : '☕';
        
        // Drinks that contain milk
        const drinksWithMilk = ['latte', 'cappuccino', 'flat-white', 'espresso-macchiato', 'hot-chocolate', 'hot-milk', 'hot-milk-shot', 'cold-milk-shot'];
        const milkEmoji = drinksWithMilk.includes(selectedDrink) ? ':brother-may-i-have-some-oats:' : '';
        
        // Build emoji line
        let emojiLine = '';
        if (roastEmoji) emojiLine += roastEmoji + ' ';
        if (drinkEmoji) emojiLine += (emojiLine ? drinkEmoji : drinkEmoji);
        if (milkEmoji) emojiLine += (emojiLine ? ' ' + milkEmoji : milkEmoji);
        
        const shareText = `I ordered a ${orderDescription} in ${formattedTime}s\n${emojiLine}.\n\nTry beat my time at ${websiteUrl}`;
        
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
