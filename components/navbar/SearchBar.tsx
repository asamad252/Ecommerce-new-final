"use client";

import {
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useState,
} from "react";

export default function SearchBar() {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      router.push("/shop");
      return;
    }

    router.push(
      `/shop?search=${encodeURIComponent(
        value
      )}`
    );
  };

  const clear = () => {
    setSearch("");
    router.push("/shop");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="flex items-center">
        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search games, consoles, accessories..."
          aria-label="Search NexGear"
          className="w-full bg-transparent text-sm text-[#172B36] outline-none placeholder:text-[#114C5A]/60"
        />

        {search && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="ml-2 text-[#114C5A] hover:text-[#FF9932]"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </form>
  );
}