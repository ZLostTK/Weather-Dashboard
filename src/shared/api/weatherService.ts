import axios from 'axios';
import type { WeatherData, ForecastData } from '@/shared/types/weather';

const API_KEY = 'YOUR_WEATHER_API_KEY'; // Users will need to add their API key
const BASE_URL = 'https://api.weatherapi.com/v1';

class WeatherService {
  public apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || API_KEY;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(query: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/current.json`, {
        params: {
          key: this.apiKey,
          q: query,
          aqi: 'yes'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  }

  async getForecast(query: string, days: number = 7): Promise<ForecastData> {
    try {
      const response = await axios.get(`${BASE_URL}/forecast.json`, {
        params: {
          key: this.apiKey,
          q: query,
          days: days,
          aqi: 'yes',
          alerts: 'yes'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  }

  async searchLocations(query: string) {
    try {
      const response = await axios.get(`${BASE_URL}/search.json`, {
        params: {
          key: this.apiKey,
          q: query
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  }

  async getHistoricalWeather(query: string, date: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/history.json`, {
        params: {
          key: this.apiKey,
          q: query,
          dt: date
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      throw error;
    }
  }

  // Get weather alerts for a location
  async getWeatherAlerts(query: string) {
    try {
      const response = await axios.get(`${BASE_URL}/alerts.json`, {
        params: {
          key: this.apiKey,
          q: query
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      throw error;
    }
  }

  // Get marine weather data
  async getMarineWeather(query: string, days: number = 3) {
    try {
      const response = await axios.get(`${BASE_URL}/marine.json`, {
        params: {
          key: this.apiKey,
          q: query,
          days: days
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching marine weather:', error);
      throw error;
    }
  }

  // Get IP location
  async getIPLocation() {
    try {
      const response = await axios.get(`${BASE_URL}/ip.json`, {
        params: {
          key: this.apiKey,
          q: 'auto:ip'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching IP location:', error);
      throw error;
    }
  }

  // Get weather map tiles URL
  getWeatherMapUrl(layer: string, zoom: number, x: number, y: number): string {
    return `https://maps.weatherapi.com/v1/statics/${layer}/${zoom}/${x}/${y}.png?key=${this.apiKey}`;
  }

  // Helper method to determine weather condition for styling
  getWeatherConditionType(code: number): 'sunny' | 'cloudy' | 'rainy' | 'snowy' {
    if ([1000].includes(code)) return 'sunny';
    if ([1003, 1006, 1009].includes(code)) return 'cloudy';
    if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1273, 1276, 1279, 1282].includes(code)) return 'rainy';
    if ([1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) return 'snowy';
    return 'cloudy';
  }

  // Mock data for demo purposes when API key is not available
  getMockCurrentWeather(): WeatherData {
    return {
      location: {
        name: "London",
        region: "City of London, Greater London",
        country: "United Kingdom",
        lat: 51.52,
        lon: -0.11,
        tz_id: "Europe/London",
        localtime_epoch: 1701234567,
        localtime: "2023-11-29 12:00"
      },
      current: {
        last_updated_epoch: 1701234567,
        last_updated: "2023-11-29 12:00",
        temp_c: 12.0,
        temp_f: 53.6,
        is_day: 1,
        condition: {
          text: "Partly cloudy",
          icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
          code: 1003
        },
        wind_mph: 8.1,
        wind_kph: 13.0,
        wind_degree: 230,
        wind_dir: "SW",
        pressure_mb: 1012.0,
        pressure_in: 29.88,
        precip_mm: 0.0,
        precip_in: 0.0,
        humidity: 71,
        cloud: 50,
        feelslike_c: 10.5,
        feelslike_f: 50.9,
        vis_km: 10.0,
        vis_miles: 6.0,
        uv: 3.0,
        gust_mph: 12.1,
        gust_kph: 19.4
      }
    };
  }

  getMockForecast(): ForecastData {
    const mockCurrent = this.getMockCurrentWeather();
    return {
      ...mockCurrent,
      forecast: {
        forecastday: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          date_epoch: Math.floor(Date.now() / 1000) + i * 24 * 60 * 60,
          day: {
            maxtemp_c: 15 + Math.random() * 10,
            maxtemp_f: 59 + Math.random() * 18,
            mintemp_c: 5 + Math.random() * 10,
            mintemp_f: 41 + Math.random() * 18,
            avgtemp_c: 10 + Math.random() * 10,
            avgtemp_f: 50 + Math.random() * 18,
            maxwind_mph: 10 + Math.random() * 20,
            maxwind_kph: 16 + Math.random() * 32,
            totalprecip_mm: Math.random() * 10,
            totalprecip_in: Math.random() * 0.4,
            totalsnow_cm: 0,
            avgvis_km: 8 + Math.random() * 4,
            avgvis_miles: 5 + Math.random() * 2.5,
            avghumidity: 60 + Math.random() * 30,
            daily_will_it_rain: Math.random() > 0.7 ? 1 : 0,
            daily_chance_of_rain: Math.floor(Math.random() * 100),
            daily_will_it_snow: 0,
            daily_chance_of_snow: 0,
            condition: {
              text: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain'][Math.floor(Math.random() * 4)],
              icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
              code: 1003
            },
            uv: 1 + Math.random() * 8
          },
          astro: {
            sunrise: "07:30 AM",
            sunset: "04:30 PM",
            moonrise: "08:45 PM",
            moonset: "06:15 AM",
            moon_phase: "Waxing Crescent",
            moon_illumination: "25"
          },
          hour: Array.from({ length: 24 }, (_, h) => ({
            time_epoch: Math.floor(Date.now() / 1000) + i * 24 * 60 * 60 + h * 60 * 60,
            time: `2023-11-${29 + i} ${h.toString().padStart(2, '0')}:00`,
            temp_c: 8 + Math.random() * 8,
            temp_f: 46 + Math.random() * 14.4,
            is_day: h >= 7 && h <= 16 ? 1 : 0,
            condition: {
              text: 'Partly cloudy',
              icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
              code: 1003
            },
            wind_mph: 5 + Math.random() * 15,
            wind_kph: 8 + Math.random() * 24,
            wind_degree: Math.floor(Math.random() * 360),
            wind_dir: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
            pressure_mb: 1010 + Math.random() * 10,
            pressure_in: 29.8 + Math.random() * 0.3,
            precip_mm: Math.random() * 2,
            precip_in: Math.random() * 0.08,
            humidity: 50 + Math.random() * 40,
            cloud: Math.floor(Math.random() * 100),
            feelslike_c: 8 + Math.random() * 8,
            feelslike_f: 46 + Math.random() * 14.4,
            windchill_c: 6 + Math.random() * 8,
            windchill_f: 43 + Math.random() * 14.4,
            heatindex_c: 8 + Math.random() * 8,
            heatindex_f: 46 + Math.random() * 14.4,
            dewpoint_c: 4 + Math.random() * 6,
            dewpoint_f: 39 + Math.random() * 10.8,
            will_it_rain: Math.random() > 0.8 ? 1 : 0,
            chance_of_rain: Math.floor(Math.random() * 100),
            will_it_snow: 0,
            chance_of_snow: 0,
            vis_km: 8 + Math.random() * 4,
            vis_miles: 5 + Math.random() * 2.5,
            gust_mph: 8 + Math.random() * 20,
            gust_kph: 13 + Math.random() * 32,
            uv: h >= 10 && h <= 14 ? 2 + Math.random() * 6 : 0
          }))
        }))
      }
    };
  }
}

export const weatherService = new WeatherService();