import { Client, Account, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

// Set the endpoint and project ID
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('685054a70005df878ce8');

// Create an account instance
const account = new Account(client);

// Test function to create a user
const testCreateUser = async () => {
  try {
    const email = `test${Math.floor(Math.random() * 10000)}@example.com`;
    const password = 'Password123!';
    const name = 'Test User';

    console.log('Creating test user with email:', email);
    
    // Create a new account
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );
    
    console.log('Account created successfully:', newAccount);
    
    // Try to login with the new account
    const session = await account.createEmailSession(email, password);
    console.log('Login successful, session created:', session);
    
    // Get the current user
    const user = await account.get();
    console.log('Current user:', user);
    
    // Logout
    await account.deleteSession('current');
    console.log('Logout successful');
    
    return { success: true, message: 'Authentication test passed!' };
  } catch (error) {
    console.error('Authentication test failed:', error);
    return { success: false, error };
  }
};

// Run the test
testCreateUser()
  .then(result => {
    console.log('Test result:', result);
    if (result.success) {
      console.log('✅ Authentication is working correctly!');
    } else {
      console.log('❌ Authentication test failed!');
    }
  })
  .catch(error => {
    console.error('Test execution error:', error);
  });
