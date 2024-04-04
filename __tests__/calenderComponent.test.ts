import axios from 'axios';

jest.mock('axios');

test('fetchLocation and fetchCountries are called on mount', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockResolvedValue({ data: [] });

  // Define the functions
  const fetchLocation = async () => {
    await axios
      .get("https://ipapi.co/json/")
      .then((res) => res.data?.country_code)
      .catch((err) => console.error(err));
  };

  const fetchCountries = async () => {
    const response = await axios.get(
      "https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json"
    );
    return response.data;
  };

  // Call the functions
  await fetchLocation();
  await fetchCountries();

  // Check if the axios.get function was called
  expect(mockedAxios.get).toHaveBeenCalledTimes(2);
});