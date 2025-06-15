export const snippets_data = {
  javascript: [
    {
      title: "Debounce Function",
      description: "A utility function to limit how often a function can be called",
      code: `const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

// Usage
const handleSearch = debounce((query) => {
  console.log("Searching for:", query);
}, 300);`,
    },
    {
      title: "Array Methods",
      description: "Common array transformations",
      code: `// Filter items
const filtered = [1, 2, 3, 4, 5].filter(num => num > 2);

// Map to new array
const doubled = [1, 2, 3].map(num => num * 2);

// Reduce to single value
const sum = [1, 2, 3, 4].reduce((acc, num) => acc + num, 0);`,
    }
  ],
  typescript: [
    {
      title: "Type Utilities",
      description: "Useful TypeScript type helpers",
      code: `// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Create type with only specified properties
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};`,
    }
  ],
  react: [
    {
      title: "Custom Hook",
      description: "React hook for managing local storage",
      code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue] as const;
}`,
    }
  ],
  css: [
    {
      title: "Modern CSS Reset",
      description: "A minimal CSS reset for modern browsers",
      code: `/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  scroll-behavior: smooth;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}`,
    }
  ],
};