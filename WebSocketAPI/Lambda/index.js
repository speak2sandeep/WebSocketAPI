  
const AWS = require('aws-sdk')

const api = new AWS.ApiGatewayManagementApi({
  endpoint: ''})

exports.handler = async (event) => {
    console.log(event)
    const route=event.requestContext.routeKey
    const connectionId=event.requestContext.connectionId
    
    switch (route) {
        case '$connect':
            console.log('Connection established')
            break
        case '$disconnect':
            console.log('Disconnected')
            break 
         case 'sendToSpecificClient':
              sendmsg(connectionId,{message : 'Hello'})
            break
         case 'sendToAllClients':
           sendMessageToAllClients([connectionId],{message : 'Hello to All'})
            break
         default:
             sendmsg(connectionId,{message : 'Default Route'})
            break        
    }
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

async function sendmsg(connectionId,body)
{
    const params = {
      'ConnectionId': connectionId,
      'Data': Buffer.from(JSON.stringify(body))
    }
    console.log(params)
    return api.postToConnection(params).promise()
}

 async function sendMessageToAllClients(connectionIds,body) {
    const all=connectionIds.map(i=> sendmsg(i,body))
    return Promise.all(all)
 };