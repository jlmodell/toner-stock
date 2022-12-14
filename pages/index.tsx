import Head from "next/head";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Toner, tonerSchema } from "../src/utils/types/toner";
import { useState } from "react";

const getTonerStock = async () => {
  const { data } = await axios.get("/api/toner/all");
  return data;
};

const initialToner: Toner = {
  id: "",
  quantity: 0,
  isColor: false,
  isGeneric: false,
  isHighCapacity: false,
  alternatives: [],
};

export default function Home() {
  const query = useQuery({ queryKey: ["toners"], queryFn: getTonerStock });
  const [newToner, setNewToner] = useState<Toner>(initialToner);
  const [alternatives, setAlternatives] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: async (toner: Toner) => {
      const validate = tonerSchema.safeParse(toner);
      if (!validate.success) {
        throw new Error("Invalid toner");
      }

      if (editMode) {
        const response = await axios.put(
          `/api/toner/${toner.id.toUpperCase()}/put`,
          toner
        );

        if (response.status !== 200) {
          throw new Error("Error updating toner");
        }

        query.refetch();
        setNewToner(initialToner);
        setEditMode(false);

        return response.data;
      } else {
        const response = await axios.post(
          `/api/toner/${toner.id.toUpperCase()}/add`,
          toner
        );

        if (response.status !== 200) {
          throw new Error("Error adding toner");
        }

        setNewToner(initialToner);

        query.refetch();

        return response.data;
      }
    },
  });

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(newToner);
  };

  return (
    <>
      <Head>
        <title>Toner Stock Application</title>
        <meta
          name="description"
          content="Generated by create next app. Application for checking stock of toner and to request or reserve toner."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid place-items-center w-[100vw] h-[100vh]">
        {query.isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <div className="w-full text-center">
              <h1 className="text-4xl font-bold">Toner Stock</h1>
            </div>
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Toner</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Requested</th>
                  <th className="px-4 py-2">Available</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {query.data.map((toner: Toner) => (
                  <tr key={toner.id}>
                    <td className="border px-4 py-2">
                      <span className="font-semibold">{toner.id}</span> (color:{" "}
                      {toner.isColor ? "Y" : "N"} - generic:{" "}
                      {toner.isGeneric ? "Y" : "N"} - high yield:{" "}
                      {toner.isHighCapacity ? "Y" : "N"})
                    </td>
                    <td className="border px-4 py-2">{toner.quantity}</td>
                    <td className="border px-4 py-2">0</td>
                    <td className="border px-4 py-2">{toner.quantity}</td>
                    <td className="border px-4 py-2 flex space-x-2">
                      <button
                        onClick={() => {
                          alert("Not implemented yet");
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Request
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(true);
                          setNewToner(toner);
                        }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-500 text-white p-4 rounded-sm">
          <form
            className="flex flex-col space-y-4"
            onSubmit={onSubmitHandler}
            onReset={() => {
              setNewToner(initialToner);
              setEditMode(false);
            }}
          >
            <div className="flex space-x-4">
              <div className="flex flex-col">
                <label className="font-semibold" htmlFor="toner">
                  Toner
                </label>
                <input
                  type="text"
                  id="toner"
                  name="toner"
                  className="border rounded text-slate-900 text-center px-3 py-2"
                  value={newToner.id}
                  onChange={(e) =>
                    setNewToner({ ...newToner, id: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold" htmlFor="quantity">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={newToner.quantity}
                  onChange={(e) =>
                    setNewToner({ ...newToner, quantity: +e.target.value })
                  }
                  step="1"
                  min="0"
                  max="50"
                  className="border rounded text-slate-900 text-center px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold" htmlFor="isColor">
                  Is Color?
                </label>
                <input
                  type="checkbox"
                  id="isColor"
                  name="isColor"
                  className="border rounded text-slate-900 text-center px-3 py-2"
                  checked={newToner.isColor}
                  onChange={(e) =>
                    setNewToner({ ...newToner, isColor: e.target.checked })
                  }
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold" htmlFor="isGeneric">
                  Is Generic?
                </label>
                <input
                  type="checkbox"
                  id="isGeneric"
                  name="isGeneric"
                  className="border rounded text-slate-900 text-center px-3 py-2"
                  checked={newToner.isGeneric}
                  onChange={(e) =>
                    setNewToner({ ...newToner, isGeneric: e.target.checked })
                  }
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold" htmlFor="isHighCapacity">
                  Is High Capacity?
                </label>
                <input
                  type="checkbox"
                  id="isHighCapacity"
                  name="isHighCapacity"
                  className="border rounded text-slate-900 text-center px-3 py-2"
                  checked={newToner.isHighCapacity}
                  onChange={(e) =>
                    setNewToner({
                      ...newToner,
                      isHighCapacity: e.target.checked,
                    })
                  }
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold" htmlFor="alternatives_text">
                  Alternatives
                </label>
                <div className="flex space-x-2 justify-center items-center">
                  <input
                    type="text"
                    id="alternatives_text"
                    name="alternatives_text"
                    className="border rounded text-slate-900 text-center px-3 py-2"
                    value={alternatives}
                    onChange={(e) => {
                      const { value } = e.target;

                      setAlternatives(value);
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setNewToner((prev) => {
                        return {
                          ...prev,
                          alternatives: [...prev.alternatives, alternatives],
                        };
                      });
                      setAlternatives("");
                    }}
                    className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded text-xs"
                  >
                    Add
                  </button>
                </div>
                <ul>
                  {newToner?.alternatives !== undefined &&
                  newToner?.alternatives.length > 0 ? (
                    newToner?.alternatives.map((toner, idx) => (
                      <li key={idx} className="list-none">
                        {toner}
                      </li>
                    ))
                  ) : (
                    <li className="list-none">None</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="w-full flex space-x-4 justify-center items-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
                type="submit"
              >
                {editMode ? "Edit" : "Submit"} Toner
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs"
                type="reset"
              >
                Reset
              </button>
            </div>
            <details>
              <summary>Debug</summary>
              <pre>
                <code>{JSON.stringify(newToner, null, 2)}</code>
              </pre>
            </details>
          </form>
        </div>
      </main>
    </>
  );
}
