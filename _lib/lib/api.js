
async function getAdData() {
    console.log('\nGET JSON\n');
    let response = await fetch('https://script.google.com/macros/s/AKfycbyPEliQEa0cslyrHV5qk3XN7rgBgQnhDmw9A6-D9nD3rWp-XaeYxUsRVycuHduZhQwmlQ/exec');
    let json = await response.json();
    return json;
};

const api = {
    getAdData,
};

export default api;