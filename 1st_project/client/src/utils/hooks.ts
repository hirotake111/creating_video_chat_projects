import { useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, initialVale: T) => {
  const storedData = localStorage.getItem(key);
  const [value, setValue] = useState<T>(
    storedData ? (JSON.parse(storedData) as T) : initialVale
  );

  const update = (data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    setValue(data);
  };

  return { value, update };
};
