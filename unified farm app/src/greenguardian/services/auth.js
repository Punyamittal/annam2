import { Client, Account, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

// Set the endpoint and project ID
client
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID || '685054a70005df878ce8');

// Export the account instance
export const account = new Account(client);

// Authentication functions
export const createAccount = async (email, password, name) => {
  try {
    console.log('Creating account with:', { email, name });
    // Create a new account
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );
    
    console.log('Account created:', newAccount);
    
    if (newAccount) {
      // Login immediately after successful account creation
      return await login(email, password);
    }
    
    return newAccount;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    console.log('Logging in with:', email);
    // Create a new session
    const session = await account.createEmailSession(email, password);
    console.log('Session created:', session);
    return session;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    // Get the current user
    const user = await account.get();
    console.log('Current user:', user);
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const logout = async () => {
  try {
    // Delete the current session
    const result = await account.deleteSession('current');
    console.log('Logout result:', result);
    return result;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    // Create a password recovery request
    const result = await account.createRecovery(
      email,
      `${window.location.origin}/reset-password`
    );
    console.log('Password reset requested:', result);
    return result;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const confirmPasswordReset = async (userId, secret, password, confirmPassword) => {
  try {
    // Complete the password recovery process
    const result = await account.updateRecovery(
      userId,
      secret,
      password,
      confirmPassword
    );
    console.log('Password reset confirmed:', result);
    return result;
  } catch (error) {
    console.error('Error confirming password reset:', error);
    throw error;
  }
};
