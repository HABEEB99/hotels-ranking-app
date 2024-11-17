import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useCountries = () => {
  return useQuery({
    queryKey: ["use-countries"],
    queryFn: async () => {
      const countries = await axios.get(
        "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json"
      );
      return countries.data;
    },
  });
};

export default useCountries;
