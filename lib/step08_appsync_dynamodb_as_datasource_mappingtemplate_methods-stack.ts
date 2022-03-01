import { CfnOutput, Duration, Expiration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { MappingTemplate } from '@aws-cdk/aws-appsync-alpha';


export class Step08AppsyncDynamodbAsDatasourceMappingtemplateMethodsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //api for dynamodb mapping template
    const api = new appsync.GraphqlApi(this, "GraphqlApi", {
      name: "Step-08-dynamoDb-as-mapping-tool",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365))
          }
        }
      }
    });

    //url
    new CfnOutput(this, "ApiGraphqlUrl", {
      value: api.graphqlUrl
    })

    //api key 
    new CfnOutput(this, "apiKey", {
      value: api.apiKey || ''
    })

    //DynamoDb Table
    const dynamoDbTable = new dynamodb.Table(this, "DynamoDbTable", {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })

    //dynamoDb Data Source 
    const DynamoDB_DataSource = api.addDynamoDbDataSource('DataSource', dynamoDbTable);

    //Resolvers by using dynamoDb DataSource
    DynamoDB_DataSource.createResolver({
      typeName: "Mutation",
      fieldName: "createNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition('id').auto(),                                              ///Create an autoID for your primary Key Id
        appsync.Values.projecting()                                                             ///Add Remaining input values
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()                     ////Mapping template for a single result item from DynamoDB.
    })

    DynamoDB_DataSource.createResolver({
      typeName: "Query",
      fieldName: "notes",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),                     ///Mapping template to scan a DynamoDB table to fetch all entries.
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()                    ///Mapping template to scan a DynamoDB table to fetch all entries. idhar hmesha ResultList aega
    })

    DynamoDB_DataSource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem('id', 'id'),           ///Mapping template to delete a single item from a DynamoDB table.
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()                     ///Mapping template to scan a DynamoDB table to fetch all entries.   
    })

    DynamoDB_DataSource.createResolver({
      typeName: "Mutation",
      fieldName: "updateNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(                           ///Mapping template to save a single item to a DynamoDB table.
        appsync.PrimaryKey.partition('id').is('id'),                                             ///Where id is input ID
        appsync.Values.projecting()                                                              ///Add Remaining input values
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()                       ////Mapping template for a single result item from DynamoDB.
    })

  }
}
