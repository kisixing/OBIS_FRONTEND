import provinces from "./china-division/provinces";
import cities from "./china-division/cities";
import areas from "./china-division/areas";
import hkmotw from "./china-division/HK-MO-TW";

areas.forEach(area => {
  const matchCity = cities.filter(city => city.code === area.cityCode)[0];
  if (matchCity) {
    matchCity.children = matchCity.children || [];
    matchCity.children.push({
      label: area.name,
      value: area.name
    });
  }
});

cities.forEach(city => {
  const matchProvince = provinces.filter(
    province => province.code === city.provinceCode
  )[0];
  if (matchProvince) {
    matchProvince.children = matchProvince.children || [];
    matchProvince.children.push({
      label: city.name,
      value: city.name,
      children: city.children
    });
  }
});

// 合并港澳台行政区
const _hkmotw = Object.entries(hkmotw).map(([provinceName, provinceItem]) => {
  return {
    label: provinceName,
    value: provinceName, // (Math.random() * 1e10).toFixed(),
    children: Object.entries(provinceItem).map(([cityName, cityItem]) => {
      return {
        label: cityName,
        value: cityName, // (Math.random() * 1e10).toFixed(),
        children: cityItem.map(area => {
          return {
            label: area,
            value: area // (Math.random() * 1e10).toFixed()
          };
        })
      };
    })
  };
});

let options = provinces.map(province => ({
  label: province.name,
  value: province.name, // province.code,
  children: province.children
}));

options = options.concat(_hkmotw);

export default options;
