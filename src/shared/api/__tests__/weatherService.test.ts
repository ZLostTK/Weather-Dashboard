import { describe, it, expect, beforeEach } from 'vitest';
import { weatherService } from '@/shared/api/weatherService';

describe('WeatherService', () => {
  beforeEach(() => {
    weatherService.setApiKey('test-key');
  });

  describe('Mock Data Methods', () => {
    it('should return mock current weather data', () => {
      const mockWeather = weatherService.getMockCurrentWeather();
      
      expect(mockWeather).toBeDefined();
      expect(mockWeather.location).toBeDefined();
      expect(mockWeather.current).toBeDefined();
      expect(typeof mockWeather.current.temp_c).toBe('number');
      expect(typeof mockWeather.location.name).toBe('string');
    });

    it('should return mock forecast data', () => {
      const mockForecast = weatherService.getMockForecast();
      
      expect(mockForecast).toBeDefined();
      expect(mockForecast.forecast).toBeDefined();
      expect(mockForecast.forecast.forecastday).toHaveLength(7);
      expect(mockForecast.forecast.forecastday[0].hour).toHaveLength(24);
    });
  });

  describe('Weather Condition Helper', () => {
    it('should return correct weather condition type for sunny weather', () => {
      const condition = weatherService.getWeatherConditionType(1000);
      expect(condition).toBe('sunny');
    });

    it('should return correct weather condition type for cloudy weather', () => {
      const condition = weatherService.getWeatherConditionType(1003);
      expect(condition).toBe('cloudy');
    });

    it('should return correct weather condition type for rainy weather', () => {
      const condition = weatherService.getWeatherConditionType(1180);
      expect(condition).toBe('rainy');
    });

    it('should return correct weather condition type for snowy weather', () => {
      const condition = weatherService.getWeatherConditionType(1210);
      expect(condition).toBe('snowy');
    });

    it('should return cloudy as default for unknown weather codes', () => {
      const condition = weatherService.getWeatherConditionType(9999);
      expect(condition).toBe('cloudy');
    });
  });

  describe('Weather Map URL Generator', () => {
    it('should generate correct weather map URL', () => {
      const url = weatherService.getWeatherMapUrl('temp_new', 5, 10, 15);
      expect(url).toContain('maps.weatherapi.com');
      expect(url).toContain('temp_new');
      expect(url).toContain('5/10/15');
      expect(url).toContain('key=test-key');
    });
  });
});
