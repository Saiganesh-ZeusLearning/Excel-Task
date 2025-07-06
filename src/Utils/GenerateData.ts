import * as fs from 'fs';
import * as path from 'path';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  Age: number;
  Salary: number;
}

// Sample name data
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Sai', 'Karthik', 'Rohan', 'Ayaan', 'Ishaan', 'Dev', 'Om'];
const lastNames = ['Sharma', 'Verma', 'Kumar', 'Reddy', 'Patel', 'Mehta', 'Joshi', 'Nair', 'Singh', 'Kapoor'];


/**
 * Generates dummy user data and writes it to a JSON file.
 * @param count Number of user entries to generate.
 * @param filePath Output JSON file path.
 */
function generateDummyUserData(count: number, filePath: string): void {
  const data: User[] = [];

  for (let i = 1; i <= count; i++) {
    const user: User = {
      id: i,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      Age: Math.floor(Math.random() * (60 - 20 + 1)) + 20,
      Salary: Math.floor(Math.random() * (2000000 - 500000 + 1)) + 500000,
    };
    data.push(user);
  }

  fs.writeFileSync(path.resolve(filePath), JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Dummy data for ${count} users has been written to ${filePath}`);
}

// Example usage
generateDummyUserData(100, 'data.json');
