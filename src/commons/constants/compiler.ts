import { Language } from '../types/compiler';

export const LANGUAGES: Language[] = [
  {
    value: "javascript",
    label: "JavaScript",
    version: "18.15.0",
    defaultCode: `// JavaScript Playground
const numbers = [1, 2, 3, 4, 5];

// Map numbers to their squares
const squares = numbers.map(n => n * n);
console.log('Original numbers:', numbers);
console.log('Squared numbers:', squares);

// Filter for even numbers
const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log('Even numbers:', evenNumbers);

// Calculate sum using reduce
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log('Sum of numbers:', sum);`
  },
  {
    value: "python",
    label: "Python",
    version: "3.10.0",
    defaultCode: `# Python Playground
numbers = [1, 2, 3, 4, 5]

# Map numbers to their squares
squares = [n * n for n in numbers]
print('Original numbers:', numbers)
print('Squared numbers:', squares)

# Filter for even numbers
even_numbers = [n for n in numbers if n % 2 == 0]
print('Even numbers:', even_numbers)

# Calculate sum
total = sum(numbers)
print('Sum of numbers:', total)`
  },
  {
    value: "java",
    label: "Java",
    version: "15.0.2",
    defaultCode: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        
        System.out.print("Original numbers: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        System.out.print("Squared numbers: ");
        for (int num : numbers) {
            System.out.print((num * num) + " ");
        }
        System.out.println();
        
        System.out.println("Hello from Java!");
    }
}`
  },
  {
    value: "cpp",
    label: "C++",
    version: "10.2.0",
    defaultCode: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    vector<int> numbers = {1, 2, 3, 4, 5};
    
    cout << "Original numbers: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    cout << "Squared numbers: ";
    for (int num : numbers) {
        cout << (num * num) << " ";
    }
    cout << endl;
    
    cout << "Hello from C++!" << endl;
    return 0;
}`
  },
  {
    value: "c",
    label: "C",
    version: "10.2.0",
    defaultCode: `#include <stdio.h>

int main() {
    int numbers[] = {1, 2, 3, 4, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    printf("Original numbers: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    
    printf("Squared numbers: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i] * numbers[i]);
    }
    printf("\\n");
    
    printf("Hello from C!\\n");
    return 0;
}`
  },
];

export type Theme =
  | 'dark'
  | 'light'
  | 'dracula'
  | 'monokai'
  | 'github'
  | 'solarized'
  | 'nord'
  | 'tokyo-night'
  | 'one-dark'
  | 'material'
  | 'cobalt'
  | 'high-contrast'
  | 'synthwave'
  | 'forest';

export interface EditorTheme {
  name: string;
  background: string;
  cardBackground: string;
  textColor: string;
  lineNumbers: {
    background: string;
    color: string;
    border: string;
  };
  syntax: {
    keyword: string;
    string: string;
    number: string;
    comment: string;
    operator: string;
    function: string;
  };
  selection: string;
  cursor: string;
  scrollbar: string;
}

export const themes: Record<Theme, EditorTheme> = {
  dark: {
    name: 'Dark',
    background: 'from-slate-900 via-slate-800 to-slate-900',
    cardBackground: 'bg-slate-900',
    textColor: 'text-slate-100',
    lineNumbers: {
      background: 'bg-slate-800',
      color: 'text-slate-400',
      border: 'border-slate-700'
    },
    syntax: {
      keyword: '#7c3aed',
      string: '#10b981',
      number: '#f59e0b',
      comment: '#6b7280',
      operator: '#ef4444',
      function: '#3b82f6'
    },
    selection: 'rgba(59, 130, 246, 0.3)',
    cursor: '#ffffff',
    scrollbar: 'rgba(148, 163, 184, 0.3)'
  },
  light: {
    name: 'Light',
    background: 'from-white via-gray-50 to-gray-100',
    cardBackground: 'bg-white',
    textColor: 'text-gray-900',
    lineNumbers: {
      background: 'bg-gray-100',
      color: 'text-gray-500',
      border: 'border-gray-200'
    },
    syntax: {
      keyword: '#7c3aed',
      string: '#059669',
      number: '#d97706',
      comment: '#6b7280',
      operator: '#dc2626',
      function: '#2563eb'
    },
    selection: 'rgba(59, 130, 246, 0.2)',
    cursor: '#000000',
    scrollbar: 'rgba(107, 114, 128, 0.3)'
  },
  dracula: {
    name: 'Dracula',
    background: 'from-purple-950 via-purple-900 to-indigo-950',
    cardBackground: 'bg-purple-950',
    textColor: 'text-purple-100',
    lineNumbers: {
      background: 'bg-purple-900',
      color: 'text-purple-400',
      border: 'border-purple-800'
    },
    syntax: {
      keyword: '#ff79c6',
      string: '#f1fa8c',
      number: '#bd93f9',
      comment: '#6272a4',
      operator: '#ff5555',
      function: '#50fa7b'
    },
    selection: 'rgba(255, 121, 198, 0.3)',
    cursor: '#f8f8f2',
    scrollbar: 'rgba(98, 114, 164, 0.3)'
  },
  monokai: {
    name: 'Monokai',
    background: 'from-stone-900 via-stone-800 to-amber-900',
    cardBackground: 'bg-stone-900',
    textColor: 'text-stone-100',
    lineNumbers: {
      background: 'bg-stone-800',
      color: 'text-stone-400',
      border: 'border-stone-700'
    },
    syntax: {
      keyword: '#f92672',
      string: '#e6db74',
      number: '#ae81ff',
      comment: '#75715e',
      operator: '#f92672',
      function: '#a6e22e'
    },
    selection: 'rgba(249, 38, 114, 0.3)',
    cursor: '#f8f8f0',
    scrollbar: 'rgba(117, 113, 94, 0.3)'
  },
  github: {
    name: 'GitHub',
    background: 'from-gray-50 via-blue-50 to-indigo-50',
    cardBackground: 'bg-white',
    textColor: 'text-gray-900',
    lineNumbers: {
      background: 'bg-gray-50',
      color: 'text-gray-400',
      border: 'border-gray-200'
    },
    syntax: {
      keyword: '#d73a49',
      string: '#032f62',
      number: '#005cc5',
      comment: '#6a737d',
      operator: '#d73a49',
      function: '#6f42c1'
    },
    selection: 'rgba(3, 47, 98, 0.2)',
    cursor: '#24292e',
    scrollbar: 'rgba(106, 115, 125, 0.3)'
  },
  solarized: {
    name: 'Solarized',
    background: 'from-amber-50 via-yellow-50 to-orange-50',
    cardBackground: 'bg-amber-50',
    textColor: 'text-amber-900',
    lineNumbers: {
      background: 'bg-yellow-100',
      color: 'text-amber-600',
      border: 'border-amber-200'
    },
    syntax: {
      keyword: '#859900',
      string: '#2aa198',
      number: '#d33682',
      comment: '#93a1a1',
      operator: '#dc322f',
      function: '#268bd2'
    },
    selection: 'rgba(38, 139, 210, 0.2)',
    cursor: '#657b83',
    scrollbar: 'rgba(147, 161, 161, 0.3)'
  },
  nord: {
    name: 'Nord',
    background: 'from-slate-800 via-slate-700 to-blue-900',
    cardBackground: 'bg-slate-800',
    textColor: 'text-slate-200',
    lineNumbers: {
      background: 'bg-slate-700',
      color: 'text-slate-400',
      border: 'border-slate-600'
    },
    syntax: {
      keyword: '#81a1c1',
      string: '#a3be8c',
      number: '#b48ead',
      comment: '#616e88',
      operator: '#bf616a',
      function: '#88c0d0'
    },
    selection: 'rgba(129, 161, 193, 0.3)',
    cursor: '#d8dee9',
    scrollbar: 'rgba(97, 110, 136, 0.3)'
  },
  'tokyo-night': {
    name: 'Tokyo Night',
    background: 'from-[#1a1b26] via-[#16161e] to-[#1a1b26]',
    cardBackground: 'bg-[#1a1b26]',
    textColor: 'text-[#a9b1d6]',
    lineNumbers: {
      background: 'bg-[#16161e]',
      color: 'text-[#565f89]',
      border: 'border-[#292e42]'
    },
    syntax: {
      keyword: '#bb9af7',
      string: '#9ece6a',
      number: '#ff9e64',
      comment: '#565f89',
      operator: '#f7768e',
      function: '#7aa2f7'
    },
    selection: 'rgba(41, 46, 66, 0.5)',
    cursor: '#c0caf5',
    scrollbar: 'rgba(86, 95, 137, 0.5)'
  },
  'one-dark': {
    name: 'One Dark',
    background: 'from-gray-900 via-gray-800 to-slate-900',
    cardBackground: 'bg-gray-900',
    textColor: 'text-gray-200',
    lineNumbers: {
      background: 'bg-gray-800',
      color: 'text-gray-500',
      border: 'border-gray-700'
    },
    syntax: {
      keyword: '#c678dd',
      string: '#98c379',
      number: '#d19a66',
      comment: '#5c6370',
      operator: '#56b6c2',
      function: '#61afef'
    },
    selection: 'rgba(198, 120, 221, 0.3)',
    cursor: '#abb2bf',
    scrollbar: 'rgba(92, 99, 112, 0.3)'
  },
  material: {
    name: 'Material',
    background: 'from-slate-800 via-blue-900 to-indigo-900',
    cardBackground: 'bg-slate-800',
    textColor: 'text-slate-100',
    lineNumbers: {
      background: 'bg-slate-700',
      color: 'text-slate-400',
      border: 'border-slate-600'
    },
    syntax: {
      keyword: '#c792ea',
      string: '#c3e88d',
      number: '#f78c6c',
      comment: '#546e7a',
      operator: '#89ddff',
      function: '#82aaff'
    },
    selection: 'rgba(199, 146, 234, 0.3)',
    cursor: '#ffcc02',
    scrollbar: 'rgba(84, 110, 122, 0.3)'
  },
  cobalt: {
    name: 'Cobalt',
    background: 'from-blue-900 via-blue-800 to-indigo-900',
    cardBackground: 'bg-blue-900',
    textColor: 'text-blue-100',
    lineNumbers: {
      background: 'bg-blue-800',
      color: 'text-blue-400',
      border: 'border-blue-700'
    },
    syntax: {
      keyword: '#ff9d00',
      string: '#3ad900',
      number: '#ff628c',
      comment: '#0088ff',
      operator: '#ff9d00',
      function: '#ffee80'
    },
    selection: 'rgba(255, 157, 0, 0.3)',
    cursor: '#ffffff',
    scrollbar: 'rgba(0, 136, 255, 0.3)'
  },
  'high-contrast': {
    name: 'High Contrast',
    background: 'from-black via-gray-900 to-black',
    cardBackground: 'bg-black',
    textColor: 'text-white',
    lineNumbers: {
      background: 'bg-gray-900',
      color: 'text-gray-300',
      border: 'border-gray-700'
    },
    syntax: {
      keyword: '#00ffff',
      string: '#00ff00',
      number: '#ffff00',
      comment: '#808080',
      operator: '#ff00ff',
      function: '#ff8000'
    },
    selection: 'rgba(0, 255, 255, 0.3)',
    cursor: '#ffffff',
    scrollbar: 'rgba(128, 128, 128, 0.5)'
  },
  synthwave: {
    name: 'Synthwave',
    background: 'from-purple-900 via-pink-900 to-indigo-900',
    cardBackground: 'bg-purple-900',
    textColor: 'text-pink-100',
    lineNumbers: {
      background: 'bg-purple-800',
      color: 'text-pink-400',
      border: 'border-pink-700'
    },
    syntax: {
      keyword: '#ff7edb',
      string: '#f1fa8c',
      number: '#bd93f9',
      comment: '#6272a4',
      operator: '#ff79c6',
      function: '#50fa7b'
    },
    selection: 'rgba(255, 126, 219, 0.3)',
    cursor: '#ff79c6',
    scrollbar: 'rgba(99, 114, 164, 0.3)'
  },
  forest: {
    name: 'Forest',
    background: 'from-green-900 via-emerald-900 to-teal-900',
    cardBackground: 'bg-green-900',
    textColor: 'text-green-100',
    lineNumbers: {
      background: 'bg-green-800',
      color: 'text-green-400',
      border: 'border-green-700'
    },
    syntax: {
      keyword: '#8cc8ff',
      string: '#bae67e',
      number: '#ffd580',
      comment: '#5c6773',
      operator: '#f29e74',
      function: '#73d0ff'
    },
    selection: 'rgba(140, 200, 255, 0.3)',
    cursor: '#ffcc02',
    scrollbar: 'rgba(92, 103, 115, 0.3)'
  }
};