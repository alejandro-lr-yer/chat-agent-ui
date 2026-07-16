import { Sidebar } from "./components/Sidebar";
import { ChatView } from "./components/ChatView";
import { Composer } from "./components/Composer";

function App() {
  return (
    <div class="flex h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Sidebar />
      <main class="flex min-w-0 flex-1 flex-col">
        <ChatView />
        <Composer />
      </main>
    </div>
  );
}

export default App;
