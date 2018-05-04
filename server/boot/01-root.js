// Fake forecast
module.exports = function (server) {
  // Install a `/` route that returns server status
  let router = server.loopback.Router();
  router.get('/', server.loopback.status());
  router.get('/api/forecast', handleForecast);
  router.get('/api/Forecast', handleForecast);
  server.use(router);
};

let forecastTemplate = {
  'c72e5f9f-1cb9-4cd1-8310-9db9aa2655ac': {
    'id': 'c72e5f9f-1cb9-4cd1-8310-9db9aa2655ac',
    'api': {
      'id': '64f33b16-e620-4393-aa64-efb85474c46c',
      'name': 'API 01',
      'plans': [
        {
          'id': 'e9ce4c39-4b82-48e2-8344-0e7e9fa92f8a',
          'name': 'Free',
          'icon': 'fa-paper-plane',
          'tiers': [
            {
              'id': 'd13afef1-4897-482d-8457-82e518229354',
              'conditionFrom': 1,
              'conditionTo': 0,
              'type': 'fixed',
              'value': 0,
              'details': [
                {
                  'id': '3922d2e9-b91e-456a-9632-215a587f7609',
                  'date': '1/2018',
                  'conditionFrom': 1,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0
                },
                {
                  'id': '7093be2a-f9a0-4852-a5f6-58ba44e27c47',
                  'date': '2/2018',
                  'conditionFrom': 1,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0
                },
                {
                  'id': 'efc7f781-4a80-4cc3-beb1-7b9a9093c18f',
                  'date': '3/2018',
                  'conditionFrom': 1,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0
                },
                {
                  'id': 'b07a7f7d-b021-4583-b7c5-708eda0a1684',
                  'date': '4/2018',
                  'conditionFrom': 1,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0
                },
                {
                  'id': 'c0c59bca-e98b-4639-ac7c-b20119c3d758',
                  'date': '5/2018',
                  'conditionFrom': 1,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0
                },
                {
                  'id': '97e4a304-5997-400c-8579-314bf4af9722',
                  'date': '6/2018',
                  'conditionFrom': 1,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0
                },
                {
                  'id': '939722e4-7329-48e6-9291-071207876d4a',
                  'date': '7/2018',
                  'conditionFrom': 1,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0
                }
              ]
            },
            {
              'id': 'ab2e3c6d-a045-4b34-8dde-29ccd3c45efe',
              'conditionFrom': 5000,
              'conditionTo': 0,
              'type': 'throttle',
              'value': 1000,
              'details': [
                {
                  'id': 'd6991b91-6826-41c4-87d4-8952fdc13ec2',
                  'date': '1/2018',
                  'conditionFrom': 5000,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 1000
                },
                {
                  'id': 'bae049eb-190f-4c54-a193-10ce855c8c83',
                  'date': '2/2018',
                  'conditionFrom': 5000,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 1000
                },
                {
                  'id': 'ea23ecb0-6704-455a-8fa5-ba94c48631b1',
                  'date': '3/2018',
                  'conditionFrom': 5000,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 1000
                },
                {
                  'id': '566e9f40-9ad3-48c6-8311-cac0f0ae12fb',
                  'date': '4/2018',
                  'conditionFrom': 5000,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 1000
                },
                {
                  'id': 'e9caf202-b6e0-46af-9aa8-0f8847551424',
                  'date': '5/2018',
                  'conditionFrom': 5000,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 1000
                },
                {
                  'id': '2d293527-9ef4-4d15-87bf-7d85cca6f9b7',
                  'date': '6/2018',
                  'conditionFrom': 5000,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 1000
                },
                {
                  'id': 'ebe0c517-4b85-4acc-acc4-9ea25e318704',
                  'date': '7/2018',
                  'conditionFrom': 5000,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 1000
                }
              ]
            }
          ],
          'details': [
            {
              'id': 'def44d22-faf5-486e-ae82-169417c22114',
              'date': '1/2018',
              'changed': false,
              'subscribers': {
                'id': '9bb1aa42-8bf8-4919-8123-5f6d2037d20b',
                'existing': 100000,
                'new': 430,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 10
              },
              'parameters': {
                'id': '947773e9-5d77-4f8a-87de-d724757e796b',
                'callsPerSubscriber': 0,
                'cashPerCall': 0
              }
            },
            {
              'id': '74a12b22-cbb9-4dad-bb5b-e19a113d3da1',
              'date': '2/2018',
              'changed': false,
              'subscribers': {
                'id': '176e9885-0e08-4ec6-9568-0c476748055b',
                'existing': 100420,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': '4e16293d-b846-4774-bc31-ec608b2ea118',
                'callsPerSubscriber': 0,
                'cashPerCall': 0
              }
            },
            {
              'id': '1037db33-6ecf-4405-9da0-72b9cbd4054a',
              'date': '3/2018',
              'changed': false,
              'subscribers': {
                'id': '3cc447fc-ee59-4a07-b1c3-58ae03af779f',
                'existing': 101424,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': '63607b07-35ad-481a-8df8-13e26df81e2b',
                'callsPerSubscriber': 0,
                'cashPerCall': 0
              }
            },
            {
              'id': '9738b34f-259b-41dd-98bb-eca9caa9726c',
              'date': '4/2018',
              'changed': false,
              'subscribers': {
                'id': '9b2c9a4a-4e74-45a4-9385-55ba933c5fce',
                'existing': 102438,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': '98b5c4d2-e36e-4859-a89d-1cd575d01b94',
                'callsPerSubscriber': 0,
                'cashPerCall': 0
              }
            },
            {
              'id': 'a7dc3a1e-b6b9-4ffb-b169-af162691d7bb',
              'date': '5/2018',
              'changed': false,
              'subscribers': {
                'id': '36c88663-558f-4c18-a958-872fc57a239b',
                'existing': 103462,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': '4b26e6f6-3c99-4741-b4cf-9acaf4c48e69',
                'callsPerSubscriber': 0,
                'cashPerCall': 0
              }
            },
            {
              'id': '6234c5fd-55ca-46ee-86e1-5de06d19f417',
              'date': '6/2018',
              'changed': false,
              'subscribers': {
                'id': '6d388b30-d0c6-4a2b-b464-62bb30ef3d26',
                'existing': 104497,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': 'dec2d56f-5639-4dde-8a76-9d3743632a85',
                'callsPerSubscriber': 0,
                'cashPerCall': 0
              }
            },
            {
              'id': '8825fcf5-00f5-440f-ad90-0d41523def6b',
              'date': '7/2018',
              'changed': false,
              'subscribers': {
                'id': 'b6046517-25b8-4d82-931b-df8e663d41ae',
                'existing': 105542,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': '8ecd748d-aff4-40a8-8bf8-41d6ecdd09ea',
                'callsPerSubscriber': 0,
                'cashPerCall': 0
              }
            }
          ]
        },
        {
          'id': 'b5ff2617-4f0c-455d-a76d-d93a1bec49cf',
          'name': 'Developer',
          'icon': 'fa-plane',
          'tiers': [
            {
              'id': '1c1ef73f-6b1a-4d2d-b343-155cdffb5298',
              'conditionFrom': 1,
              'conditionTo': 10000,
              'type': 'fixed',
              'value': 0.05,
              'details': [
                {
                  'id': '0485f8b2-7dfb-41f4-a97a-15b6efad2e1c',
                  'date': '1/2018',
                  'conditionFrom': 1,
                  'conditionTo': 10000,
                  'type': 'fixed',
                  'value': 0.05
                },
                {
                  'id': '2eaf9848-354e-482c-84a2-a9d3f4c52ea8',
                  'date': '2/2018',
                  'conditionFrom': 1,
                  'conditionTo': 10000,
                  'type': 'fixed',
                  'value': 0.05
                },
                {
                  'id': 'b220b486-e4fb-4500-9fb7-82e8702edc6a',
                  'date': '3/2018',
                  'conditionFrom': 1,
                  'conditionTo': 10000,
                  'type': 'fixed',
                  'value': 0.05
                },
                {
                  'id': 'f88dfd50-9731-4135-a913-a66175e0a37d',
                  'date': '4/2018',
                  'conditionFrom': 1,
                  'conditionTo': 10000,
                  'type': 'fixed',
                  'value': 0.05
                },
                {
                  'id': '81ca13ad-f606-4ad1-80c3-4e8d3f0d44b4',
                  'date': '5/2018',
                  'conditionFrom': 1,
                  'conditionTo': 10000,
                  'type': 'fixed',
                  'value': 0.05
                },
                {
                  'id': 'd6efea5a-fc4e-4cd3-9c52-217372fc1ef8',
                  'date': '6/2018',
                  'conditionFrom': 1,
                  'conditionTo': 10000,
                  'type': 'fixed',
                  'value': 0.05
                },
                {
                  'id': '58540dce-6044-4e6b-82f9-0cfb98c1edc0',
                  'date': '7/2018',
                  'conditionFrom': 1,
                  'conditionTo': 10000,
                  'type': 'fixed',
                  'value': 0.05
                }
              ]
            },
            {
              'id': 'e8f8b9b1-2b1a-4d9d-8359-a34b29c5cebf',
              'conditionFrom': 10001,
              'conditionTo': 50000,
              'type': 'fixed',
              'value': 0.03,
              'details': [
                {
                  'id': '5f26ac99-9971-4bba-9998-2331b8641aef',
                  'date': '1/2018',
                  'conditionFrom': 10001,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.03
                },
                {
                  'id': 'da547586-5d70-4e3e-8ff8-14e29269e941',
                  'date': '2/2018',
                  'conditionFrom': 10001,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.03
                },
                {
                  'id': '460a7618-7df1-4606-a5d0-e639841a2d17',
                  'date': '3/2018',
                  'conditionFrom': 10001,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.03
                },
                {
                  'id': '8154bc53-c44d-4a7f-8e2f-f7c3c067a44e',
                  'date': '4/2018',
                  'conditionFrom': 10001,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.03
                },
                {
                  'id': '58cc2e54-f378-4f7d-a5ec-63734a5d1b29',
                  'date': '5/2018',
                  'conditionFrom': 10001,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.03
                },
                {
                  'id': '1c1e2871-3627-4eff-b8cd-c6f9cd2e354c',
                  'date': '6/2018',
                  'conditionFrom': 10001,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.03
                },
                {
                  'id': 'be836513-3988-4e61-af96-6d5e74e8872b',
                  'date': '7/2018',
                  'conditionFrom': 10001,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.03
                }
              ]
            },
            {
              'id': 'f9741231-bd7c-49df-a7aa-a5985111fdb3',
              'conditionFrom': 50001,
              'conditionTo': 0,
              'type': 'throttle',
              'value': 5000,
              'details': [
                {
                  'id': 'cfde4302-762b-48e1-8ca7-e5e3a0908818',
                  'date': '1/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 5000
                },
                {
                  'id': '25be2f2d-58a6-4fc1-9a3b-b93499b8063a',
                  'date': '2/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 5000
                },
                {
                  'id': '1c6cbd89-4c00-4ec3-95d6-aad204da731c',
                  'date': '3/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 5000
                },
                {
                  'id': 'eb080a56-cd3a-48f7-aa52-821efe8a7321',
                  'date': '4/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 5000
                },
                {
                  'id': 'bc4e090c-e3ef-4847-a043-b9f18f126406',
                  'date': '5/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 5000
                },
                {
                  'id': '49afcfb2-7292-4fc9-b732-7b13bcb21642',
                  'date': '6/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 5000
                },
                {
                  'id': 'b778778b-e43f-4fea-acb1-9325f86394d7',
                  'date': '7/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 5000
                }
              ]
            },
            {
              'id': '8c10699f-cc85-4c99-bf4a-4fbac6f15479',
              'conditionFrom': 50001,
              'conditionTo': 100000,
              'type': 'fixed',
              'value': 0.02,
              'details': [
                {
                  'id': 'fff6e08d-41f6-4a3e-9a60-0c63a40c2006',
                  'date': '1/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 100000,
                  'type': 'fixed',
                  'value': 0.02
                },
                {
                  'id': 'bdae0a2b-d41a-4ca3-8127-1e4d971ded7d',
                  'date': '2/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 100000,
                  'type': 'fixed',
                  'value': 0.02
                },
                {
                  'id': 'd5e5d3df-bac0-4f8e-b6bd-715b83edb6bb',
                  'date': '3/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 100000,
                  'type': 'fixed',
                  'value': 0.02
                },
                {
                  'id': 'f7fb1d6a-51f2-4e0d-acf9-54c74cefbbd5',
                  'date': '4/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 100000,
                  'type': 'fixed',
                  'value': 0.02
                },
                {
                  'id': 'c1a9de4e-4110-4dc8-9de7-206bdbfbed45',
                  'date': '5/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 100000,
                  'type': 'fixed',
                  'value': 0.02
                },
                {
                  'id': '76d7699b-b6df-4340-86f5-b035d50b092f',
                  'date': '6/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 100000,
                  'type': 'fixed',
                  'value': 0.02
                },
                {
                  'id': 'd672426a-1af3-4ddd-9ceb-ceb18400ffd2',
                  'date': '7/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 100000,
                  'type': 'fixed',
                  'value': 0.02
                }
              ]
            },
            {
              'id': 'a8c8a9ae-abea-4be1-80fc-0e16c72045e7',
              'conditionFrom': 100001,
              'conditionTo': 0,
              'type': 'fixed',
              'value': 0.01,
              'details': [
                {
                  'id': 'cef85c6c-04cc-4f33-8f15-285ad4505f1d',
                  'date': '1/2018',
                  'conditionFrom': 100001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                },
                {
                  'id': '8786af54-4ed2-4160-913f-58a7da210b63',
                  'date': '2/2018',
                  'conditionFrom': 100001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                },
                {
                  'id': '12adf24c-f060-4c97-9ac4-93b6093e7350',
                  'date': '3/2018',
                  'conditionFrom': 100001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                },
                {
                  'id': '3535a969-8ed7-44ff-a5da-bb89e487b013',
                  'date': '4/2018',
                  'conditionFrom': 100001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                },
                {
                  'id': 'bb238091-b25a-4524-9fab-e8f77a7e3b63',
                  'date': '5/2018',
                  'conditionFrom': 100001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                },
                {
                  'id': '32abc5f8-85a2-44e2-9502-664b612b7101',
                  'date': '6/2018',
                  'conditionFrom': 100001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                },
                {
                  'id': '512b6e74-cf3e-4f07-8980-02b14314fc07',
                  'date': '7/2018',
                  'conditionFrom': 100001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                }
              ]
            }
          ],
          'details': [
            {
              'id': '69151619-7341-49e6-8fdb-1ed50cf58d12',
              'date': '1/2018',
              'changed': false,
              'subscribers': {
                'id': 'cb2ec47d-6b45-4fc5-bf43-ad986746ea25',
                'existing': 600,
                'new': 5,
                'upgrades': 15,
                'downgrades': 0,
                'churn': 2
              },
              'parameters': {
                'id': 'f08e2be8-53eb-438c-ad77-6ed2997c8270',
                'callsPerSubscriber': 100000,
                'cashPerCall': 0
              }
            },
            {
              'id': '6813a04a-5995-4acd-acad-a99835fdb751',
              'date': '2/2018',
              'changed': false,
              'subscribers': {
                'id': '368556c9-25a0-48c6-98a1-92b4a8c89c49',
                'existing': 618,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': '58701d84-b431-4b2c-9954-25342c3df69d',
                'callsPerSubscriber': 100000,
                'cashPerCall': 0
              }
            },
            {
              'id': '53f52148-7f1c-4260-b828-49fd366d051a',
              'date': '3/2018',
              'changed': false,
              'subscribers': {
                'id': 'e9adfc0a-b4e4-42f6-9ffa-81db171e1baf',
                'existing': 624,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': '2d8d04ac-e996-4b8c-bc11-8e7dfa41e239',
                'callsPerSubscriber': 100000,
                'cashPerCall': 0
              }
            },
            {
              'id': '3fe15d4c-aac9-40bd-9ab6-4fb9eea5538e',
              'date': '4/2018',
              'changed': false,
              'subscribers': {
                'id': 'bb357309-2276-4d5c-83ac-bd669df56fc4',
                'existing': 630,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': 'f853699e-64b7-4da6-aa75-b4070e948b37',
                'callsPerSubscriber': 100000,
                'cashPerCall': 0
              }
            },
            {
              'id': '6133ca3a-402f-48d9-a1ee-c4820dcc548a',
              'date': '5/2018',
              'changed': false,
              'subscribers': {
                'id': '2aa48fbf-ea88-4708-aaaf-aaa629550378',
                'existing': 636,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': '87b42a1b-d9dd-4204-9e43-b3056cfdb0ec',
                'callsPerSubscriber': 100000,
                'cashPerCall': 0
              }
            },
            {
              'id': 'cdb126eb-e380-4229-a116-50b917c040ff',
              'date': '6/2018',
              'changed': false,
              'subscribers': {
                'id': 'e9b5ccd1-4317-4501-a3ca-8732b298d787',
                'existing': 642,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': '42ec6862-8254-4ee6-ae51-a98df6e90ba7',
                'callsPerSubscriber': 100000,
                'cashPerCall': 0
              }
            },
            {
              'id': '2305e751-177a-4d4d-b805-6789184c302e',
              'date': '7/2018',
              'changed': false,
              'subscribers': {
                'id': 'ff5d186a-10bf-4eec-8b58-046561ebb913',
                'existing': 648,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': 'd9c479e4-0369-45d0-9217-7fe2a68549eb',
                'callsPerSubscriber': 100000,
                'cashPerCall': 0
              }
            }
          ]
        },
        {
          'id': 'fb798e7e-fb9d-4f0a-93dc-77bf225a9de1',
          'name': 'Professional',
          'icon': 'fa-fighter-jet',
          'tiers': [
            {
              'id': '5521a735-cbb2-4fd7-b1a7-69f28202c8ec',
              'conditionFrom': 1,
              'conditionTo': 50000,
              'type': 'fixed',
              'value': 0.02,
              'details': [
                {
                  'id': 'd2e053e9-09b6-4a79-a2e3-6928c7383b8a',
                  'date': '1/2018',
                  'conditionFrom': 1,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.02
                },
                {
                  'id': 'f9240d11-6b7d-4cdf-a79b-27afb9a496e0',
                  'date': '2/2018',
                  'conditionFrom': 1,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.02
                },
                {
                  'id': '1d4cc974-1c4a-40d7-a294-54afadb54e11',
                  'date': '3/2018',
                  'conditionFrom': 1,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.02
                },
                {
                  'id': 'f38bc36b-72d4-4244-a081-fd16e764d91e',
                  'date': '4/2018',
                  'conditionFrom': 1,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.02
                },
                {
                  'id': '2851f437-ab8c-4aa9-b991-f9cce3dfc13e',
                  'date': '5/2018',
                  'conditionFrom': 1,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.02
                },
                {
                  'id': '8497f7eb-9dab-4da3-8256-07aa85aaeffa',
                  'date': '6/2018',
                  'conditionFrom': 1,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.02
                },
                {
                  'id': '81201906-8214-4152-8ed2-06fe982b20f6',
                  'date': '7/2018',
                  'conditionFrom': 1,
                  'conditionTo': 50000,
                  'type': 'fixed',
                  'value': 0.02
                }
              ]
            },
            {
              'id': '469efad8-b8a5-46b8-a37b-00b784600c85',
              'conditionFrom': 50001,
              'conditionTo': 0,
              'type': 'fixed',
              'value': 0.01,
              'details': [
                {
                  'id': '02051a55-4335-4409-bfee-f62fa80ea741',
                  'date': '1/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                },
                {
                  'id': '686bde62-ea20-440a-a0e9-87ab199b6f36',
                  'date': '2/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                },
                {
                  'id': '37b67d90-031a-435e-9502-51232cae1325',
                  'date': '3/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                },
                {
                  'id': 'ba514594-6528-474a-819c-1338d2e138b6',
                  'date': '4/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                },
                {
                  'id': '8a3808c1-94ea-4b62-8c36-4fc9fdf94ba1',
                  'date': '5/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                },
                {
                  'id': '1d35eaf4-f858-4357-aa81-c84fe6fc01dd',
                  'date': '6/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                },
                {
                  'id': 'c81726e9-e659-4acb-9c80-0e2797b1217d',
                  'date': '7/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'fixed',
                  'value': 0.01
                }
              ]
            },
            {
              'id': '2133d16d-746f-41ed-83c6-5c7f2ef802d0',
              'conditionFrom': 50001,
              'conditionTo': 0,
              'type': 'throttle',
              'value': 100000,
              'details': [
                {
                  'id': 'acd99943-29ee-4def-b84c-fcb7ea5771f8',
                  'date': '1/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 100000
                },
                {
                  'id': 'ee2338a1-d639-4e54-b24b-af6ff9990c8a',
                  'date': '2/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 100000
                },
                {
                  'id': '935df2d6-4eb1-4111-ab8b-98b2e8928c41',
                  'date': '3/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 100000
                },
                {
                  'id': 'fd8ddc3c-8466-4015-a13e-23c3ef93feaa',
                  'date': '4/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 100000
                },
                {
                  'id': '95bf7274-3b18-44bf-a237-7fe69ffb67b1',
                  'date': '5/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 100000
                },
                {
                  'id': '6cd1abd5-2554-415c-8a49-7f2d18912e15',
                  'date': '6/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 100000
                },
                {
                  'id': '224dff4f-2b13-40b7-8d57-533a1625163a',
                  'date': '7/2018',
                  'conditionFrom': 50001,
                  'conditionTo': 0,
                  'type': 'throttle',
                  'value': 100000
                }
              ]
            },
            {
              'id': 'e99f80b3-06ca-4db7-a25a-bfac2035a148',
              'conditionFrom': 0,
              'conditionTo': 0,
              'type': 'percentage',
              'value': 0.2,
              'details': [
                {
                  'id': '4e0e8b3f-e369-48f6-88c8-28bca5c22f19',
                  'date': '1/2018',
                  'conditionFrom': 0,
                  'conditionTo': 0,
                  'type': 'percentage',
                  'value': 0.2
                },
                {
                  'id': '1688fbb7-b7de-4df3-97c1-c747a7b5bfb5',
                  'date': '2/2018',
                  'conditionFrom': 0,
                  'conditionTo': 0,
                  'type': 'percentage',
                  'value': 0.2
                },
                {
                  'id': 'ca2de8a7-1b2e-401d-b61b-228066b165b3',
                  'date': '3/2018',
                  'conditionFrom': 0,
                  'conditionTo': 0,
                  'type': 'percentage',
                  'value': 0.2
                },
                {
                  'id': 'b049528d-6fe9-4398-9338-6b4e6d64bf90',
                  'date': '4/2018',
                  'conditionFrom': 0,
                  'conditionTo': 0,
                  'type': 'percentage',
                  'value': 0.2
                },
                {
                  'id': '24ad02a7-2df1-46e6-9111-71cd57bae8b8',
                  'date': '5/2018',
                  'conditionFrom': 0,
                  'conditionTo': 0,
                  'type': 'percentage',
                  'value': 0.2
                },
                {
                  'id': '95ab8d3f-036e-40bc-a8ad-5cdef0d4e07c',
                  'date': '6/2018',
                  'conditionFrom': 0,
                  'conditionTo': 0,
                  'type': 'percentage',
                  'value': 0.2
                },
                {
                  'id': '1964d391-bb95-4d24-9f04-73c95b7e5e75',
                  'date': '7/2018',
                  'conditionFrom': 0,
                  'conditionTo': 0,
                  'type': 'percentage',
                  'value': 0.2
                }
              ]
            }
          ],
          'details': [
            {
              'id': '1650a868-fdd3-424e-b7ca-4138fb3c6365',
              'date': '1/2018',
              'changed': false,
              'subscribers': {
                'id': '2d26d38c-03e8-44e7-8056-076ea9f358b9',
                'existing': 5,
                'new': 1,
                'upgrades': 1,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': 'd61750ba-94f2-49d7-848d-68db9e13261f',
                'callsPerSubscriber': 475000,
                'cashPerCall': 0.115
              }
            },
            {
              'id': '2a9a64a4-8b82-4757-a4de-ef784f15dfe2',
              'date': '2/2018',
              'changed': false,
              'subscribers': {
                'id': '8dfa5827-0ca8-4fd4-a6eb-dace862f1f23',
                'existing': 7,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': 'afab7688-f1cc-4c0a-b7d0-e0058a142216',
                'callsPerSubscriber': 475000,
                'cashPerCall': 0.115
              }
            },
            {
              'id': 'd112e7da-af7f-4903-b38f-2ed44f1b45ed',
              'date': '3/2018',
              'changed': false,
              'subscribers': {
                'id': '452d8d14-2117-4dfe-b625-0bc4e6ec04c8',
                'existing': 7,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': '1ca1486d-7c5b-4cb9-935c-f3d2043f8430',
                'callsPerSubscriber': 475000,
                'cashPerCall': 0.115
              }
            },
            {
              'id': '4dad8dde-ed09-41e7-818e-8c63fa962b5c',
              'date': '4/2018',
              'changed': false,
              'subscribers': {
                'id': '1c1a9e51-2950-43a1-b49c-51419b4dbd22',
                'existing': 7,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': '32422818-bc43-4e76-8934-1b1337c997f6',
                'callsPerSubscriber': 475000,
                'cashPerCall': 0.115
              }
            },
            {
              'id': '83513070-46d7-4560-bda3-9e4d1676bea8',
              'date': '5/2018',
              'changed': false,
              'subscribers': {
                'id': '0b09c29b-b02e-4b04-99a1-a20d384f0053',
                'existing': 7,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': 'c7fe07e2-64c1-4a9b-be06-876b5e0f69f5',
                'callsPerSubscriber': 475000,
                'cashPerCall': 0.115
              }
            },
            {
              'id': '209bf460-2884-4c78-aa65-7b4765554035',
              'date': '6/2018',
              'changed': false,
              'subscribers': {
                'id': '4634ae35-78fe-43a9-88b7-d2f5f48d416f',
                'existing': 7,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': 'f89e941b-0986-4f6b-b801-f71d23c505c5',
                'callsPerSubscriber': 475000,
                'cashPerCall': 0.115
              }
            },
            {
              'id': 'e12b0e0a-843a-46c5-86bb-bd12d7ce3694',
              'date': '7/2018',
              'changed': false,
              'subscribers': {
                'id': '709f9bbf-6925-4457-a827-032a78e21d54',
                'existing': 7,
                'new': 0,
                'upgrades': 0,
                'downgrades': 0,
                'churn': 0
              },
              'parameters': {
                'id': 'fd9de1e7-09fc-4547-861c-30a58c96fced',
                'callsPerSubscriber': 475000,
                'cashPerCall': 0.115
              }
            }
          ]
        }
      ],
      'upgrades': []
    }
  }
};

function handleForecast (req, res) {
  res.json(forecastTemplate);
}
