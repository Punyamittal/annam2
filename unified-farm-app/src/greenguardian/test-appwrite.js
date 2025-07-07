const { Client, Account, ID } = require('appwrite');

// Initialize Appwrite client
const client = new Client();

// Set the endpoint and project ID
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('685054a70005df878ce8');

// Create an account instance
const account = new Account(client);

// Test user credentials
const testEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
const testPassword = 'Password123!';
const testName = 'Test User';

// Test registration
async function testRegistration() {
  try {
    console.log(`Testing registration with email: ${testEmail}`);
    const user = await account.create(
      ID.unique(),
      testEmail,
      testPassword,
      testName
    );
    console.log('Registration successful:', user);
    return true;
  } catch (error) {
    console.error('Registration failed:', error);
    return false;
  }
}

// Test login
async function testLogin() {
  try {
    console.log(`Testing login with email: ${testEmail}`);
    const session = await account.createEmailSession(testEmail, testPassword);
    console.log('Login successful:', session);
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
}

// Test get current user
async function testGetCurrentUser() {
  try {
    console.log('Testing get current user');
    const user = await account.get();
    console.log('Current user:', user);
    return true;
  } catch (error) {
    console.error('Get current user failed:', error);
    return false;
  }
}

// Test logout
async function testLogout() {
  try {
    console.log('Testing logout');
    await account.deleteSession('current');
    console.log('Logout successful');
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting Appwrite authentication tests...');
  
  const registrationResult = await testRegistration();
  if (!registrationResult) {
    console.log('❌ Registration test failed. Stopping tests.');
    return;
  }
  console.log('✅ Registration test passed');
  
  const loginResult = await testLogin();
  if (!loginResult) {
    console.log('❌ Login test failed. Stopping tests.');
    return;
  }
  console.log('✅ Login test passed');
  
  const getCurrentUserResult = await testGetCurrentUser();
  if (!getCurrentUserResult) {
    console.log('❌ Get current user test failed.');
  } else {
    console.log('✅ Get current user test passed');
  }
  
  const logoutResult = await testLogout();
  if (!logoutResult) {
    console.log('❌ Logout test failed.');
  } else {
    console.log('✅ Logout test passed');
  }
  
  console.log('All tests completed.');
}

// Execute tests
runTests();
