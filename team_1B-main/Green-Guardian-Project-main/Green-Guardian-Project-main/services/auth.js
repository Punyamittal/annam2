import { Client, Account } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '685054a70005df878ce8');

// Export the account instance
export const account = new Account(client);

// Authentication functions
export const createAccount = async (email, password, name) => {
  try {
    const newAccount = await account.create('unique()', email, password, name);
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
    return await account.createEmailSession(email, password);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const logout = async () => {
  try {
    return await account.deleteSession('current');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    return await account.createRecovery(email, `${window.location.origin}/reset-password`);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const confirmPasswordReset = async (userId, secret, password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  try {
    return await account.updateRecovery(userId, secret, password, confirmPassword);
  } catch (error) {
    console.error('Error confirming password reset:', error);
    throw error;
  }
};
