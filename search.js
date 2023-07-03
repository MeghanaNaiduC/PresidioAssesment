const axios = require('axios');
const cheerio = require('cheerio');
const natural = require('natural');

function searchTopic(topic) {
  // Format the topic for a search query
  const query = topic.replace(' ', '+');
  // Perform a search on a search engine (e.g., Google)
  const searchUrl = `https://www.google.com/search?q=${query}`;

  return axios.get(searchUrl)
    .then(response => {
      // Parse the HTML content of the search results page
      const $ = cheerio.load(response.data);
      // Extract relevant information (e.g., search result descriptions)
      const searchResults = $('div.BNeawe.vvjwJb.AP7Wnd');
      // Extract the first search result description (modify this to suit your needs)
      if (searchResults.length > 0) {
        return searchResults.first().text();
      } else {
        return "No information found for the topic.";
      }
    })
    .catch(error => {
      console.log(error);
      return "An error occurred while searching for the topic.";
    });
}

function answerQuestion(text, question) {
  // Tokenize the text into sentences
  const tokenizer = new natural.SentenceTokenizer();
  const sentences = tokenizer.tokenize(text);
  // Loop through the sentences to find a suitable answer
  for (const sentence of sentences) {
    if (sentence.toLowerCase().includes(question.toLowerCase())) {
      return sentence;
    }
  }
  return "No answer found for the question.";
}

// Get the user input
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter a topic: ", (topic) => {
  rl.question("Ask a question: ", (question) => {
    // Search for information about the topic
    searchTopic(topic)
      .then((searchResult) => {
        // Answer the user's question based on the search result
        const answer = answerQuestion(searchResult, question);
        // Display the answer
        console.log(answer);
        rl.close();
      })
      .catch((error) => {
        console.log(error);
        rl.close();
      });
  });
});
