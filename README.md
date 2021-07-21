# Building a Visual Text Analytics app using Qlik and Machine Learning techniques in NodeJS

This is a Full-stack Visual Text Analytics application developed using Qlik Sense OSS - Nebula.js and Picasso.js.
The application levergaes Machine Learning techniques such as Word Embeddings(Word2Vec) and Principal Component Analysis(PCA)
to derive textual insights from a Cannabis Effects dataset.

Technology stack: \
<b>Front-end : HTML, Bootstrap(for icons, etc.) \
 Back-end : ExpressJS framework - Nebula.js, Picasso.js(Visualizations), Word2Vec API for Word embeddings.</b>

Please note that the token.js file makes use of a 'private.pem.txt' file. This is used to add the private key to the Glitch project.

We add the private key for the JWT token to access content from Qlik Sense cloud environment. Refer to this tutorial to know how to create signed tokens for JWT - https://qlik.dev/tutorials/create-signed-tokens-for-jwt-authorization
