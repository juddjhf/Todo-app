import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);

  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("accesstoken");

  // ================= GET USER =================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate, token]);

  // ================= GET TODOS =================
  const getTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/todo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Todo fetch failed");
        return;
      }

      setTodos(data.data || []);
    } catch (error) {
      console.error(error);
      setMessage("Todo server se connect nahi ho raha");
    }
  };

  // ================= LOAD TODOS =================
  useEffect(() => {
    if (token) {
      getTodos();
    }
  }, [token]);

  // ================= CREATE TODO =================
  const handleCreateTodo = async (e) => {
    e.preventDefault();

    if (!task.trim() || !description.trim()) {
      setMessage("Task aur description dono required hain");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Todo create failed");
        return;
      }

      setTodos((prev) => [...prev, data.data]);

      setTask("");
      setDescription("");

      setMessage("Todo created successfully");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= START EDIT =================
  const handleEdit = (todo) => {
    setEditId(todo._id);
    setEditTask(todo.task);
    setEditDescription(todo.description);
  };

  // ================= UPDATE TODO =================
  const handleUpdateTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/todo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task: editTask,
          description: editDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Update failed");
        return;
      }

      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? data.data : todo
        )
      );

      setEditId(null);
      setEditTask("");
      setEditDescription("");

      setMessage("Todo updated successfully");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  };

  // ================= DELETE TODO =================
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/todo/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Delete failed");
        return;
      }

      setTodos((prev) =>
        prev.filter((todo) => todo._id !== id)
      );

      setMessage("Todo deleted successfully");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              Todo App
            </h1>

            <p className="text-sm text-gray-500">
              Welcome, {user.username}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* User Info */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

          <h2 className="text-xl font-bold text-gray-800">
            Hello, {user.username} 👋
          </h2>

          <p className="text-gray-500 mt-1">
            {user.email}
          </p>

        </div>

        {/* ================= CREATE TODO ================= */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">

          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Add New Todo
          </h2>

          <form
            onSubmit={handleCreateTodo}
            className="space-y-4"
          >

            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Adding..." : "Add Todo"}
            </button>

          </form>

          {/* Message */}
          {message && (
            <p className="mt-4 text-sm font-medium text-blue-600">
              {message}
            </p>
          )}

        </div>

        {/* ================= TODO LIST ================= */}
        <div>

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-2xl font-bold text-gray-800">
              My Todos
            </h2>

            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
              {todos.length} Todos
            </span>

          </div>

          {todos.length === 0 ? (

            <div className="bg-white rounded-xl shadow-sm p-10 text-center">

              <p className="text-gray-500">
                No todos found. Create your first todo!
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 gap-5">

              {todos.map((todo) => (

                <div
                  key={todo._id}
                  className="bg-white rounded-xl shadow-sm p-6"
                >

                  {editId === todo._id ? (

                    /* ================= EDIT MODE ================= */

                    <div className="space-y-4">

                      <input
                        type="text"
                        value={editTask}
                        onChange={(e) =>
                          setEditTask(e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <textarea
                        value={editDescription}
                        onChange={(e) =>
                          setEditDescription(e.target.value)
                        }
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            handleUpdateTodo(todo._id)
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setEditId(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  ) : (

                    /* ================= VIEW MODE ================= */

                    <>
                      <h3 className="text-xl font-bold text-gray-800">
                        {todo.task}
                      </h3>

                      <p className="text-gray-600 mt-2">
                        {todo.description}
                      </p>

                      <div className="flex gap-3 mt-5">

                        <button
                          onClick={() => handleEdit(todo)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteTodo(todo._id)
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </div>
                    </>
                  )}

                </div>

              ))}

            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default Home;
