import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import WeatherCard from '@/features/weather/WeatherCard.vue';
import type { WeatherData } from '@/shared/types/weather';

const mockWeatherData: WeatherData = {
  location: {
    name: 'London',
    region: 'England',
    country: 'United Kingdom',
    lat: 51.52,
    lon: -0.11,
    tz_id: 'Europe/London',
    localtime_epoch: 1701234567,
    localtime: '2023-11-29 12:00'
  },
  current: {
    last_updated_epoch: 1701234567,
    last_updated: '2023-11-29 12:00',
    temp_c: 12.0,
    temp_f: 53.6,
    is_day: 1,
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      code: 1003
    },
    wind_mph: 8.1,
    wind_kph: 13.0,
    wind_degree: 230,
    wind_dir: 'SW',
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

describe('WeatherCard', () => {
  it('renders weather data correctly', () => {
    const wrapper = mount(WeatherCard, {
      props: {
        weather: mockWeatherData
      }
    });

    expect(wrapper.text()).toContain('London');
    expect(wrapper.text()).toContain('12°');
    expect(wrapper.text()).toContain('Partly cloudy');
  });

  it('displays loading state when no weather data', () => {
    const wrapper = mount(WeatherCard, {
      props: {
        weather: null
      }
    });

    expect(wrapper.find('.shimmer')).toBeTruthy();
  });

  it('displays weather metrics correctly', () => {
    const wrapper = mount(WeatherCard, {
      props: {
        weather: mockWeatherData
      }
    });

    expect(wrapper.text()).toContain('71%'); // humidity
    expect(wrapper.text()).toContain('13km/h'); // wind (sin espacio)
    expect(wrapper.text()).toContain('1012'); // pressure
    expect(wrapper.text()).toContain('10'); // visibility
  });

  it('shows correct weather icon', () => {
    const wrapper = mount(WeatherCard, {
      props: {
        weather: mockWeatherData
      }
    });

    const img = wrapper.find('img');
    expect(img.attributes('src')).toBe(mockWeatherData.current.condition.icon);
    expect(img.attributes('alt')).toBe(mockWeatherData.current.condition.text);
  });
});
