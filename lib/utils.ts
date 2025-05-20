import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const weatherSchema = z.object({
  date: z.string().datetime().transform((value) => new Date(value)),
  currentTemp: z.number().min(16).max(40).describe('the current temperature in celcius based on the weather, must be between 16 to 40 inclusively'),
  weather: z.enum(['sunny', 'cloudy', 'rainy']).describe('randomly chosen weather condition'),
  tempPerTime: z.array(z.object({
      time: z.string().describe('time, from 7am to 1pm. always use am and pm format.'),
      temperature: z.number().min(16).max(40).describe('the temperature in celsius at the specified time based on the weather, must be between 16 to 40 inclusively.'),
      weather: z.enum(['sunny', 'cloudy', 'rainy']).describe('randomly chosen weather condition')
  })).describe('the list of random temperature for each time from 7am to 1pm')
})

export type Weather = z.infer<typeof weatherSchema>;

export const heroesSchema = z.object({
  heroes: z.array(
    z.object({
      name: z.string(),
      class: z
        .string()
        .describe('Character class, e.g. warrior, mage, or thief.'),
      description: z.string(),
    })
  )
});

export type Heroes = z.infer<typeof heroesSchema>;