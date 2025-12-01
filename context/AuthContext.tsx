import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Address, Order } from '../types';
import { LoyaltyLedgerKernel } from '../src/core/ledger/LoyaltyLedgerKernel';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // Persist kernel instance
  const [ledgerKernel] = useState(() => new LoyaltyLedgerKernel());

  useEffect(() => {
    // Check for logged in user on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.ledger) {
        ledgerKernel.loadChain(parsedUser.ledger);
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    // Simple check (in real app, use hashed passwords and backend)
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      // Load ledger if exists
      if (foundUser.ledger) {
        ledgerKernel.loadChain(foundUser.ledger);
      }
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string): boolean => {
    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.some(u => u.email === email)) {
      return false; // User already exists
    }

    // Initialize with "Gold Member" stats for demonstration
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password, // Demo only: storing plain text
      phone: '0812-3456-7890',
      addresses: [
        { id: 'addr-1', label: 'Rumah', recipient: name, phone: '08123456789', fullAddress: 'Jl. Kemang Selatan No. 10', city: 'Jakarta Selatan' }
      ],
      orders: [],
      joinedDate: new Date().toLocaleDateString('id-ID'),
      membershipTier: 'Gold',
      loyaltyPoints: 0, // Start with 0, let ledger handle it? Or init with transaction?
      companyName: 'PT. Maju Mundur',
      familyMembers: [
        { id: 'f1', name: 'Budi (Suami)', relation: 'Suami', birthDate: '1985-05-20' },
        { id: 'f2', name: 'Aisha (Anak)', relation: 'Anak', birthDate: '2015-10-12' }
      ],
      savedMenus: [
        { id: 'sm1', name: 'Paket Ultah Anak', totalPrice: 2500000, itemsSummary: 'Nasi Kuning Bento, Sosis Solo, Puding Coklat' },
        { id: 'sm2', name: 'Meeting Kantor Bulanan', totalPrice: 1200000, itemsSummary: 'Nasi Kotak Ayam Bakar, Snack Box Premium' }
      ]
    };

    // Initial Bonus Transaction
    ledgerKernel.addTransaction(newUser.id, 150, 'EARN');
    newUser.ledger = ledgerKernel.getChain();
    newUser.loyaltyPoints = ledgerKernel.getBalance(newUser.id);

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Auto login after register
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update in users array as well
    const usersStr = localStorage.getItem('users');
    if (usersStr) {
      const users: User[] = JSON.parse(usersStr);
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const addOrder = (order: Order) => {
    if (!user) return;
    const newOrders = [order, ...user.orders];

    // Calculate points: 1 point per 100.000
    const pointsEarned = Math.floor(order.total / 100000);

    // Mine a new block for the points
    ledgerKernel.addTransaction(user.id, pointsEarned, 'EARN');
    const newChain = ledgerKernel.getChain();
    const newBalance = ledgerKernel.getBalance(user.id);

    updateUser({ orders: newOrders, loyaltyPoints: newBalance, ledger: newChain });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, addOrder }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
