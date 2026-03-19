const endPoint = 'http://localhost:4001/api/v1/comment';
// const endPoint = 'https://infinite-green-replybot-backend.nfaml9.easypanel.host/api/v1/comment';

export default function fetchResponse () {
  fetch(endPoint) 
   .then(response => response.json())
   .then(data => console.log(data))
   .catch(error => console.error('Error:', error));
}