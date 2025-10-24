import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

export default function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('user');
  const [error, setError] = useState('');
  
  // Validation logic for email and password
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters, include 1 uppercase letter and 1 number.");
      return;
    }

    setError(""); // clear errors
    console.log({ email, password, accountType });

    // Placeholder for actual API call to backend (when ready)
    alert('Registration successful!');
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-12 p-6 border border-gray-300 rounded-lg shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center mb-6">Create an Account</CardTitle>
      </CardHeader>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-4">
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Account Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="salon-owner">Salon Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
