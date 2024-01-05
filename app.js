// This event listener is triggered when the DOM content has fully loaded.
document.addEventListener('DOMContentLoaded', function(){
    // Add an event listener to the 'generateGiftsBtn' button for the click event.
    document.getElementById('generateGiftsBtn').addEventListener('click', function() {
        event.preventDefault();

        // Retrieve input values from the form fields.
        var recipient = document.getElementById('boxOne').value;
        var age = document.getElementById('boxTwo').value;
        var budget = document.getElementById('boxThree').value;
        var occasion = document.getElementById('boxFour').value;
        var interests = document.getElementById('boxFive').value;

        // Display the loading screen while the AI generates gift ideas.
        var loadingScreen = document.getElementById('loadingScreen'); 
        loadingScreen.style.display = 'flex';
    
        // Call the function to generate gift ideas.
        generateGiftIdeas(recipient, age, budget, occasion, interests);
    });
});

// This asynchronous function uses the OpenAI API to generate gift ideas.
async function generateGiftIdeas(recipient, age, budget, occasion, interests) {
    var prompt = `*NO DESCRIPTION* + *Gifts that can be searched up on in Amazon* + *each idea should have around the same amount of characters* List 10 Gift ideas with no description for ${recipient} (Age: ${age}, Budget: ${budget}, Occasion: ${occasion}, Interests: ${interests})`;

    // Attempt to call the OpenAI API using the provided prompt.
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'INSERT KEY HERE'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', 
                messages: [{ role: 'user', content: prompt }]
            })
        });

        // Process the response and display the gift ideas.
        const data = await response.json();
        const giftIdeas = data.choices[0].message['content'];

        showGiftIdeasBox(giftIdeas);

    } catch (error) {
        // Handle errors during the API call.
        console.error('Error:', error);
        alert('Failed to generate gift ideas. Please try again.');

        // Hide the loading screen if an error occurs.
        var loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.display = 'none';
    }
}

// Function to display the gift ideas in a formatted box.
function showGiftIdeasBox(giftIdeas) {
    // Format and display the gift ideas.
    const giftIdeasContent = document.getElementById('giftIdeasContent');
    giftIdeasContent.innerHTML = giftIdeas.replace(/\n/g, '<br>');

    const giftIdeasContainer = document.getElementById ('giftIdeasContainer');
    giftIdeasContainer.style.display = 'flex'

    // Adjust the dimensions of the giftIdeasBox based on the content.
    const contentWidth = giftIdeasContent.clientWidth;
    const contentHeight = giftIdeasContent.clientHeight;
    const giftIdeasBox = document.getElementById('giftIdeasBox');
    giftIdeasBox.style.width = '${contentWidth}px';
    giftIdeasBox.style.height = '${contentHeight}px';
    
    // Convert the gift ideas into an array and create links for each idea.
    const giftIdeasArray = giftIdeas.split('\n');
    const giftIdeasLinksDiv = document.createElement('div');
    const giftIdeasLinksContent = document.getElementById('giftIdeasLinksContent');
    giftIdeasLinksContent.innerHTML = '';
    
    giftIdeasArray.forEach(giftIdea => {
        const trimmedIdea = giftIdea.trim();
        if (trimmedIdea !== '') {
            const giftBox = document.createElement('div');
            const giftLink = document.createElement('a');
            giftLink.textContent = 'Click Here';
            const amazonShoppingURL = `https://www.amazon.com/s?k=${encodeURIComponent(trimmedIdea)}`;
            giftLink.href = amazonShoppingURL;
            giftLink.target = '_blank';
            giftLink.rel = 'noopener noreferrer';
            giftIdeasLinksDiv.appendChild(giftLink);
            giftIdeasLinksDiv.appendChild(document.createElement('br'));
            giftBox.appendChild(giftLink);
            giftIdeasLinksContent.appendChild(giftBox);
        }
    });

    // Hide the loading screen once the gift ideas are displayed.
    var loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'none';
}

// Function to hide the gift ideas container when the close button is clicked.
function hideGiftIdeasContainer(){
    const giftIdeasContainer = document.getElementById('giftIdeasContainer');
    giftIdeasContainer.style.display = 'none';
}