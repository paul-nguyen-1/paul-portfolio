import type { RefObject } from "react";
import { useEffect, useState } from "react";

export const scrollToBottom = (ref: RefObject<HTMLElement | null>) => {
  ref.current?.scrollIntoView({ behavior: "smooth" });
};

export function getRotatingIndex(length: number, delay = 7500) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, delay);
    return () => clearInterval(interval);
  }, [length, delay]);

  return index;
}

export async function postData<TData, TVariables>(
  url: string,
  variables: TVariables
): Promise<TData> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(variables),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorMessage = `HTTP ${response.status}`;

    if (contentType?.includes("application/json")) {
      const errorBody = await response.json();
      errorMessage += `: ${JSON.stringify(errorBody)}`;
    } else {
      const errorText = await response.text();
      errorMessage += `: ${errorText}`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}
