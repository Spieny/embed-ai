import { Sequential, Routing, Parallel, Orchestrator, Evaluator } from '@/components/pattern-examples'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function App() {
  return (
    <div className="justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Tabs defaultValue="sequential">
          <TabsList className="d-flex gap-10 text-2xl">
            <TabsTrigger className="cursor-pointer" value="sequential">Sequential Processing</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="routing">Routing</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="parallel">Parallel Processing</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="orchestrator">Orchestrator-Worker</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="evaluator">Evaluator-Optimizer</TabsTrigger>
          </TabsList>
          <TabsContent value="sequential">
            <Sequential />
          </TabsContent>
          <TabsContent value="routing">
            <Routing />
          </TabsContent>
          <TabsContent value="parallel">
            <Parallel />
          </TabsContent>
          <TabsContent value="orchestrator">
            <Orchestrator />
          </TabsContent>
          <TabsContent value="evaluator">
            <Evaluator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
