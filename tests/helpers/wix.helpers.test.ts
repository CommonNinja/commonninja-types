import { helpers, loggerFactory } from '../../lib';

const logger = loggerFactory.getLogger(__filename);
const { wixHelpers } = helpers;
const testInstance = 'jn2_cSyvEbef3X4o5JKSbwJ09icmU4DLPImerhuK44g.eyJpbnN0YW5jZUlkIjoiZWMyMzMwZTYtOGYyYi00MTUyLWExYjEtNDJmYTZmZjg5ZTFkIiwiYXBwRGVmSWQiOiIxMmIzNjQwNi0zOGQwLWY1NzUtYjU2Yi0yMTdkZmQxZWM1YWYiLCJzaWduRGF0ZSI6IjIwMTktMDEtMDlUMDY6MjI6NDAuMTMyWiIsInVpZCI6IjI2OWI3Y2JiLWUwMWUtNDNhNy04ZGFjLTJlMDM0MmQ1NDA1NyIsInBlcm1pc3Npb25zIjoiT1dORVIiLCJpcEFuZFBvcnQiOiIyMTIuMTQzLjEyMS4xNTYvNTAyMDIiLCJ2ZW5kb3JQcm9kdWN0SWQiOm51bGwsImRlbW9Nb2RlIjpmYWxzZSwic2l0ZU93bmVySWQiOiIyNjliN2NiYi1lMDFlLTQzYTctOGRhYy0yZTAzNDJkNTQwNTciLCJzaXRlTWVtYmVySWQiOiIyNjliN2NiYi1lMDFlLTQzYTctOGRhYy0yZTAzNDJkNTQwNTcifQ';
const testSecret = 'aa3b9f79-e376-438f-a04f-64a03d38042b';

test('Empty app secret', async () => {
  expect(() => {
    const instanceData = wixHelpers.verifyInstance('test', '');
  }).toThrowError('App secret is empty.');
});

test('Empty instance', async () => {
  expect(() => {
    const instanceData = wixHelpers.verifyInstance('', 'test');
  }).toThrowError('Instance parameter is empty.');
});

test('Invalid instance data', async () => {
  expect(() => {
    const instanceData = wixHelpers.verifyInstance('test', 'test');
  }).toThrowError('Could not validate instance');
});

test('Wrong app secret', async () => {
  const instanceData = wixHelpers.verifyInstance(testInstance, 'test');
  expect(instanceData.verified).toBeFalsy();
});

test('Wrong instance data', async () => {
  const instanceData = wixHelpers.verifyInstance(`s${testInstance}`, testSecret);
  expect(instanceData.verified).toBeFalsy();
});

test('Good app secret', async () => {
  const instanceData = wixHelpers.verifyInstance(testInstance, testSecret);
  expect(instanceData.verified).toBeTruthy();
  expect(instanceData.data.instanceId).toEqual('ec2330e6-8f2b-4152-a1b1-42fa6ff89e1d');
});
