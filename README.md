# DynamoDB Mapping Technique

dynamoDb is directly connected to the appsync api
without using the lambda
and in the resolver we are using the techniques of

## request-Mapping-template & response-Mapping-template

These attributes are in the resolver where we will use them according to the requirement in the parameters
request mapping template and the response mapping template
for adding we r using - dynamodbPutItem

for every technique we are using different params , for example for adding , we are using dynamoDb.putitems and it has 2 arguments , one for the id other for the projection

# its basically mapping method : AppSync and DynamoDb as a DataSource
