'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRef, useState, useTransition } from "react";
import Markdown from "react-markdown";
import { useChat, experimental_useObject as useObject } from '@ai-sdk/react';
import { Calendar } from "@/components/ui/calendar";
import { CloudRainWind, CloudSun, LoaderCircle, Sun } from "lucide-react";
import { cn, heroesSchema, Weather } from "@/lib/utils";
import { capitalize } from "./helpers";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-semibold mb-5">Simple LLM Generation & Tool Usage Examples</h1>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <GenerateTextSection />
        <StreamTextSection />
        <GenerateObjectSection />
        <StreamObjectSection />
      </main>
    </div>
  );
}

const GenerateTextSection = () => {
  const countryRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<string>("");
  const [loading, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      if (!countryRef.current?.value) return;
      try {
        const response = await fetch("/api/generate-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country: countryRef.current.value }),
        });
        const data = await response.json();
        setResult(data.text);
      } catch (error) {
        console.error("Error:", error);
        setResult("An error occurred while generating the text.");
      }
    });
  };

  const handleClear = () => { setResult(''); }

  return (
    <Card className="w-full max-w-[1200px]">
      <CardHeader>
        <CardTitle>Generate Text</CardTitle>
        <CardDescription>Generate recipes from country that you input</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section className="space-y-3">
          <h4>Prompt: Write recipes of specialty foods from the country you input, starting from appetizer, main dish, and dessert.</h4>
          <Input
            ref={countryRef}
            id="country"
            name="country"
            placeholder="Name a country you want to generate food recipes from"
          />
          <div className="flex gap-4">
            <Button onClick={handleSubmit} disabled={loading} className="cursor-pointer">
              {loading ? <span className="flex gap-2 items-center"><LoaderCircle className="animate-spin" size={20} /> Generating...</span> : 'Submit'}
            </Button>
            <Button variant='secondary' onClick={handleClear} className="cursor-pointer">
              Clear
            </Button>
          </div>
        </section>
        <section className="max-h-[500px] overflow-y-auto">
          <h4>Result: </h4>
          {loading ? (
            <div className='w-1/2 h-3 bg-gray-400 rounded animate-pulse' />
          ) : (
            <div className="whitespace-pre-wrap p-5"><Markdown>{result}</Markdown></div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}

const StreamTextSection = () => {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/stream-text',
    maxSteps: 5
  })

  const isLoading = status === 'submitted' || status === 'streaming';

  return (
    <Card className="w-full max-w-[1200px]">
      <CardHeader>
        <CardTitle>Stream Text</CardTitle>
        <CardDescription>Chat with the weather expert!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section className="max-h-[500px] overflow-y-auto space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <Markdown>{message.content}</Markdown>
              </div>
            </div>
          ))}
        </section>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about weather and climate..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>{isLoading ? <LoaderCircle className="animate-spin" size={20} /> : 'Send'}</Button>
        </form>
      </CardContent>
    </Card>
  )
}

const convertDate = (date: Date) => {
  return `${new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: '2-digit' })}`;
};

const getWeatherIcons = (size: number) => ({
    sunny: <Sun size={size} color="yellow" />,
    cloudy: <CloudSun size={size} color="#0b5054" />,
    rainy: <CloudRainWind size={size} color="#1b1b1f" />
})

const weatherBg = {
  sunny: 'bg-blue-200',
  cloudy: 'bg-emerald-200',
  rainy: 'bg-gray-300'
}

const GenerateObjectSection = () => {
  const [date, setDate] = useState<Date>();
  const [loading, startTransition] = useTransition();
  const [result, setResult] = useState<Weather>();

  const handleGenerate = () => {
    startTransition(async () => {
      if (!date) return;
    
      try {
        const response = await fetch('/api/generate-object', {
          method: 'POST',
          body: JSON.stringify({ date: date.toISOString() })
        });
        const data = await response.json();
        setResult(data);
        console.log(data);
      } catch (error) {
        console.error('Error generating weather report:', error);
      }
    });
  };
  return (
    <Card className="w-full max-w-[1200px]">
      <CardHeader>
        <CardTitle>Generate Object</CardTitle>
        <CardDescription>Generate weather report object</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <section className="space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(value) => setDate(value)}
          />
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? <span className="flex gap-2 items-center"><LoaderCircle className="animate-spin" size={20} /> Generating...</span> : 'Generate'}
          </Button>
        </section>
        {result ? (
          <section className={cn("w-full border text-indi rounded-lg p-5 flex flex-col justify-between", weatherBg[result?.weather])}>
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <h4>{convertDate(result?.date)}</h4>
                <div className="flex gap-3">
                  <h2 className="text-3xl">{result?.currentTemp}°C</h2>
                  {getWeatherIcons(40)[result?.weather]}
                </div>
              </div>
              <p>{capitalize(result?.weather)}</p>
            </div>
            <div className="flex justify-between">
              {result?.tempPerTime?.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 items-center">
                  <p>{item.time}</p>
                  {getWeatherIcons(28)[item?.weather]}
                  <p>{item.temperature}°C</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </CardContent>
    </Card>
  )
}

const StreamObjectSection = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { object, isLoading, submit } = useObject({
    api: '/api/stream-object',
    schema: heroesSchema
  });

  const startStream = () => {
    if (!inputRef.current?.value) return;
    submit(inputRef.current.value);
  }
  
  return (
    <Card className="w-full max-w-[1200px]">
      <CardHeader>
        <CardTitle>Stream Object</CardTitle>
        <CardDescription>Generate heroes profile cards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section className="space-y-2">
          <Label>Hero Count</Label>
          <div className="flex gap-4">
            <Input ref={inputRef} type="number" min={1} max={15} className="max-w-xs" />
            <Button onClick={startStream} disabled={isLoading}>{isLoading ? (
              <span className="flex gap-2 items-center">
                <LoaderCircle className="animate-spin" size={20} /> Streaming...
              </span>) : 'Start'}
            </Button>
          </div>
        </section>
        {object?.heroes && (
          <section className="grid grid-cols-3 gap-4 justify-between">
            {object.heroes.map((hero, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{hero?.name}</CardTitle>
                  <CardDescription>{hero?.class}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <h4>{hero?.description}</h4>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </CardContent>
    </Card>
  )
};
