import {dynamodbCreateRecord, dynamodbCreateTable, dynamodbDeleteTable, dynamodbDescribeTable} from './aws';
import vendors from './data/vendors';

const delay = (ms: number) => new Promise(res =>setTimeout(res,ms));

const init = async () => { 

    const vendorsTableName  = 'vendors' ;

    const vendorsTable =  await  dynamodbDescribeTable(vendorsTableName);
  //console.log(vendorsTable);

  if(!(vendorsTable instanceof Error))
{
 // delete the table
 //console.log('Table exists');
 await dynamodbDeleteTable(vendorsTableName);
    await delay(6000);
}
const vendorsTableParams: AWS.DynamoDB.CreateTableInput =
{
    TableName: 'vendors',
    KeySchema : [
        {
            AttributeName : 'twitterId', KeyType : 'HASH'
        }

    ],
    AttributeDefinitions :[
        {AttributeName :'twitterId', AttributeType: 'S'}
    ],
    ProvisionedThroughput:{
        ReadCapacityUnits:10,
        WriteCapacityUnits:10
    }
}
await dynamodbCreateTable(vendorsTableParams);
await delay(6000);

for(const i in vendors){
  const vendor = vendors[i];
  const res = await dynamodbCreateRecord(vendorsTableName,vendor);
   if(res instanceof Error){
    console.log('Error:', vendor, res);
   }
}
}



 init();