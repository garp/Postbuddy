import geoip from 'geoip-lite';

export const ipDetails = async (req) => {
  const ip = req.ip === '::1' || req.ip === '127.0.0.1' ? '119.82.86.106' : req.ip;

  try {
    const geo = geoip.lookup(ip);
    console.log('Country ==>',geo.country)
    return geo.country;
  } catch (error) {
    console.error('Error fetching IP details:', error);
  }
};
